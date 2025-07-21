import * as admin from "firebase-admin";
import type { ConversationTTSSettingsBackend } from "./index";
import { DocumentReference, CollectionReference, FieldValue } from "firebase-admin/firestore";
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatXAI } from "@langchain/xai";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { getProviderFromId, getFirestoreKeyIdFromProvider, getApiKeyFromSecret, getTTSApiKeyId, getBackendTTSModelById, getTTSInputChunks, createWavBuffer, storageBucket } from "./index";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import OpenAI from "openai";
import axios from "axios";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
const { AudioEncoding } = protos.google.cloud.texttospeech.v1;

type QuotaError = { code?: string; status?: number };

const LOOKAHEAD_LIMIT = 2; // How many agent messages ahead can be generated

// --- ConversationData type for linter ---
type ConversationData = {
  agentA_llm: string;
  agentB_llm: string;
  turn: "agentA" | "agentB";
  apiSecretVersions: { [key: string]: string };
  status?: "running" | "stopped" | "error";
  userId?: string;
  ttsSettings?: ConversationTTSSettingsBackend;
  waitingForTTSEndSignal?: boolean;
  errorContext?: string;
  lastPlayedAgentMessageId?: string;
  imageGenSettings?: {
    enabled: boolean;
    provider: string;
    model: string;
    quality: string;
    size: string;
    promptLlm: string;
    promptSystemMessage: string;
  };
};

// Copy the _triggerAgentResponse function here and export as triggerAgentResponse
export async function triggerAgentResponse(
    conversationId: string,
    agentToRespond: "agentA" | "agentB",
    conversationRef: DocumentReference,
    messagesRef: CollectionReference,
    forceNextTurn: boolean = false
): Promise<void> {
    // --- Begin pasted function body ---
    let conversationData: ConversationData;
    let llmApiKey: string | null = null;
    const logger = console; // Use console as logger fallback
    const rtdb = admin.database();
    try {
        const conversationSnap = await conversationRef.get();
        if (!conversationSnap.exists) {
            logger.error(`Conversation ${conversationId} not found in triggerAgentResponse.`);
            return;
        }
        conversationData = conversationSnap.data() as ConversationData;
        // Move debug log here, before any early returns
        logger.info(`[DEBUG] imageGenSettings for ${agentToRespond}:`, conversationData?.imageGenSettings);
        if (!conversationData) {
            logger.error(`Conversation ${conversationId} has no data in triggerAgentResponse.`);
            return;
        }
        if (conversationData.status !== "running") {
            logger.info(`Conversation ${conversationId} status is ${conversationData.status}. Aborting triggerAgentResponse.`);
            return;
        }

        // --- NEW: Enforce lookahead limit ---
        if (!forceNextTurn) {
            // Fetch all messages ordered by timestamp
            const allMessagesSnap = await messagesRef.orderBy("timestamp", "asc").get();
            const allMessages: { id: string; role: string }[] = allMessagesSnap.docs.map(doc => {
                const data = doc.data() as { role: string };
                return { id: doc.id, role: data.role };
            });
            // Find the index of lastPlayedAgentMessageId
            let lastPlayedIdx = -1;
            if (conversationData.lastPlayedAgentMessageId) {
                lastPlayedIdx = allMessages.findIndex(m => m.id === conversationData.lastPlayedAgentMessageId);
            }
            // Count agent messages after lastPlayedIdx
            let agentMessagesAhead = 0;
            for (let i = lastPlayedIdx + 1; i < allMessages.length; i++) {
                if (allMessages[i].role === "agentA" || allMessages[i].role === "agentB") {
                    agentMessagesAhead++;
                }
            }
            if (agentMessagesAhead >= LOOKAHEAD_LIMIT) {
                logger.info(`[Lookahead Limit] ${agentMessagesAhead} agent messages ahead of user. Limit is ${LOOKAHEAD_LIMIT}. Skipping agent response generation.`);
                return;
            }
        }
        let historyMessages: BaseMessage[] = [];
        try {
            const historyQuery = messagesRef.orderBy("timestamp", "asc").limit(20);
            const historySnap = await historyQuery.get();
            const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
            const llmProvider = getProviderFromId(agentModelId);
            if (llmProvider === "TogetherAI") {
                const docs = historySnap.docs;
                let idx = 0;
                if (docs.length > 0 && docs[0].data().role === "system") {
                    historyMessages.push(new SystemMessage({ content: docs[0].data().content }));
                    idx = 1;
                }
                let isUser = true;
                for (let i = idx; i < docs.length; i++) {
                    const data = docs[i].data() as { role: string; content: string };
                    if (isUser) {
                        historyMessages.push(new HumanMessage({ content: data.content }));
                    } else {
                        historyMessages.push(new AIMessage({ content: data.content }));
                    }
                    isUser = !isUser;
                }
            } else {
                historyMessages = historySnap.docs.map((doc) => {
                    const data = doc.data() as { role: string; content: string };
                    if (data.role === agentToRespond) return new AIMessage({ content: data.content });
                    if (["agentA", "agentB", "user", "system"].includes(data.role)) return new HumanMessage({ content: data.content });
                    logger.warn(`Unknown role found in history: ${data.role}`); return null;
                }).filter((msg): msg is BaseMessage => msg !== null);
            }
            logger.info(`Fetched ${historyMessages.length} messages for history in triggerAgentResponse.`);
        } catch (error) { throw new Error(`Failed to fetch message history: ${error}`); }
        const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
        const llmProvider = getProviderFromId(agentModelId);
        const llmFirestoreKeyId = getFirestoreKeyIdFromProvider(llmProvider);
        if (!llmProvider || !llmFirestoreKeyId) { throw new Error(`Invalid LLM configuration ID "${agentModelId}" for ${agentToRespond}.`); }
        const llmSecretVersionName = conversationData.apiSecretVersions[llmFirestoreKeyId];
        if (!llmSecretVersionName) { throw new Error(`API key reference missing for ${agentToRespond} (${llmProvider}). Check Firestore user data.`); }
        try {
            llmApiKey = await getApiKeyFromSecret(llmSecretVersionName);
            if (!llmApiKey) { throw new Error(`getApiKeyFromSecret returned null for LLM version ${llmSecretVersionName}`); }
            logger.info(`Successfully retrieved API key for LLM provider ${llmProvider} in triggerAgentResponse.`);
        } catch(error) { throw new Error(`Failed to retrieve API key for ${agentToRespond} (${llmProvider}): ${error}`); }
        let chatModel: BaseChatModel;
        try {
            const modelName = agentModelId;
            if (llmProvider === "OpenAI") chatModel = new ChatOpenAI({ apiKey: llmApiKey, modelName: modelName });
            else if (llmProvider === "Google") chatModel = new ChatGoogleGenerativeAI({ apiKey: llmApiKey, model: modelName });
            else if (llmProvider === "Anthropic") chatModel = new ChatAnthropic({ apiKey: llmApiKey, modelName: modelName });
            else if (llmProvider === "xAI") chatModel = new ChatXAI({ apiKey: llmApiKey, model: modelName });
            else if (llmProvider === "TogetherAI") {
                 chatModel = new ChatTogetherAI({
                     apiKey: llmApiKey,
                     modelName: modelName,
                 });
            }
            else throw new Error(`Unsupported provider configuration: ${llmProvider}`);
            logger.info(`Initialized ${llmProvider} model: ${modelName} for ${agentToRespond} in triggerAgentResponse`);
        } catch (error) { throw new Error(`Failed to initialize LLM "${agentModelId}" for ${agentToRespond}: ${error}`); }
        // --- Streaming logic ---
        const messageId = admin.firestore().collection("dummy").doc().id;
        const rtdbRef = rtdb.ref(`/streamingMessages/${conversationId}/${messageId}`);
        let responseContent = "";
        try {
            await rtdbRef.set({
                role: agentToRespond,
                content: "",
                status: "streaming",
                timestamp: Date.now(),
            });
            const stream = await chatModel.stream(historyMessages as BaseLanguageModelInput);
            for await (const chunk of stream) {
                let token = "";
                if (typeof chunk === "string") token = chunk;
                else if (chunk && typeof chunk.content === "string") token = chunk.content;
                else if (chunk && Array.isArray(chunk.content)) token = chunk.content.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join("");
                else token = String(chunk);
                responseContent += token;
                await rtdbRef.update({ content: responseContent });
            }
            await rtdbRef.update({ status: "complete" });
        } catch (error) {
            logger.error(`LLM streaming failed for ${agentToRespond} (${agentModelId}):`, error);
            await rtdbRef.update({ status: "error", error: error instanceof Error ? error.message : String(error) });
            logger.error("Streaming error occurred, aborting before Firestore write.");
            throw new Error(`LLM streaming failed for ${agentToRespond} (${agentModelId}): ${error}`);
        }
        logger.info("Streaming complete. Preparing to start TTS and image generation in parallel", { messageId, responseContent });

        // --- TTS and IMAGE GENERATION in PARALLEL ---
        const ttsSettings = conversationData.ttsSettings;
        const agentSettings = agentToRespond === "agentA" ? ttsSettings?.agentA : ttsSettings?.agentB;
        const textToSpeak = responseContent;
        const imageGenSettings = conversationData.imageGenSettings;

        // Add debug log for imageGenSettings
        logger.info(`[DEBUG] imageGenSettings for ${agentToRespond}:`, imageGenSettings);

        // Helper for TTS
        async function runTTS() {
            let audioUrl: string | null = null;
            let ttsWasSplit = false;
            if (ttsSettings?.enabled && agentSettings && agentSettings.provider !== "none" && agentSettings.voice && textToSpeak) {
                let audioBuffer: Buffer | null = null;
                let ttsApiKey: string | null = null;
                const ttsApiKeyId = getTTSApiKeyId(agentSettings.provider);
                if (!ttsApiKeyId) {
                    logger.error(`[TTS Error] Unsupported TTS provider or no API key ID mapping for: ${agentSettings.provider}. Skipping TTS.`);
                } else {
                    const ttsSecretVersionName = conversationData.apiSecretVersions[ttsApiKeyId];
                    logger.info(`[TTS Key Check] Provider: ${agentSettings.provider}, Key ID: ${ttsApiKeyId}, Version Ref: ${ttsSecretVersionName}`);
                    if (!ttsSecretVersionName) {
                        logger.error(`[TTS Error] TTS selected, but API key reference ('${ttsApiKeyId}') missing in apiSecretVersions. Skipping TTS.`);
                    } else {
                        ttsApiKey = await getApiKeyFromSecret(ttsSecretVersionName);
                        if (!ttsApiKey) {
                            logger.error(`[TTS Error] Failed to retrieve API key for TTS (provider: ${agentSettings.provider}, version: ${ttsSecretVersionName}). Skipping TTS.`);
                        } else {
                            logger.info(`[TTS Key Check] Successfully retrieved API key for TTS provider: ${agentSettings.provider}.`);
                        }
                    }
                }
                if (ttsApiKey && agentSettings && agentSettings.voice) {
                    // --- New: TTS Input Splitting Logic ---
                    const ttsModel = getBackendTTSModelById(agentSettings.selectedTtsModelId || agentSettings.ttsApiModelId || "");
                    let inputLimitType = "characters";
                    let inputLimitValue = 4096;
                    let encodingName = "cl100k_base";
                    if (ttsModel) {
                      inputLimitType = ttsModel.inputLimitType;
                      inputLimitValue = ttsModel.inputLimitValue;
                      if (ttsModel.encodingName) encodingName = ttsModel.encodingName;
                    }
                    const ttsChunks = getTTSInputChunks(
                      textToSpeak,
                      inputLimitType as import("./tts_models").TTSInputLimitType,
                      inputLimitValue,
                      encodingName as import("@dqbd/tiktoken").TiktokenEncoding | undefined
                    );
                    if (ttsChunks.length > 1) {
                      ttsWasSplit = true;
                      logger.info(`[TTS Split] Text for ${agentToRespond} split into ${ttsChunks.length} chunks for TTS model ${ttsModel?.name || agentSettings.selectedTtsModelId}`);
                    }
                    const audioBuffers: Buffer[] = [];
                    for (let i = 0; i < ttsChunks.length; i++) {
                      const chunkText = ttsChunks[i];
                      let chunkBuffer: Buffer | null = null;
                      try {
                        if (agentSettings.provider === "openai") {
                          const openAIVoice = agentSettings.voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
                          const openAIModelApiId = agentSettings.selectedTtsModelId === "openai-tts-1-hd" ? "tts-1-hd" :
                                                   agentSettings.selectedTtsModelId === "openai-gpt-4o-mini-tts" ? "tts-1" :
                                                   "tts-1";
                          const openai = new OpenAI({ apiKey: ttsApiKey });
                          logger.info(`[TTS Debug] chunkText type: ${typeof chunkText}, isBuffer: ${Buffer.isBuffer(chunkText)}, value:`, chunkText);
                          const mp3 = await openai.audio.speech.create({
                            model: openAIModelApiId,
                            voice: openAIVoice,
                            input: chunkText,
                            response_format: "mp3",
                          });
                          chunkBuffer = Buffer.from(await mp3.arrayBuffer());
                        } else if (agentSettings.provider === "google-cloud") {
                          const textToSpeechClient = new TextToSpeechClient();
                          const googleVoiceName = agentSettings.voice;
                          const languageCode = googleVoiceName.split("-").slice(0, 2).join("-");
                          const request = {
                            input: { text: chunkText },
                            voice: { languageCode: languageCode, name: googleVoiceName },
                            audioConfig: { audioEncoding: AudioEncoding.MP3 },
                          };
                          const [response] = await textToSpeechClient.synthesizeSpeech(request);
                          if (response.audioContent instanceof Uint8Array) {
                            chunkBuffer = Buffer.from(response.audioContent);
                          } else {
                            throw new Error("Google TTS audio content is not Uint8Array");
                          }
                        } else if (agentSettings.provider === "google-gemini") {
                          const geminiVoiceId = agentSettings.voice;
                          const geminiModelApiId = agentSettings.ttsApiModelId || agentSettings.selectedTtsModelId;
                          const ttsModelName = geminiModelApiId && geminiModelApiId.includes("tts") ? geminiModelApiId : "gemini-2.5-flash-preview-tts";
                          const geminiTtsApiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModelName}:generateContent?key=${ttsApiKey}`;
                          const geminiTtsRequestBody = {
                            contents: [{ parts: [{ text: chunkText }] }],
                            generationConfig: {
                              responseModalities: ["AUDIO"],
                              speechConfig: {
                                voiceConfig: { prebuiltVoiceConfig: { voiceName: geminiVoiceId } }
                              }
                            }
                          };
                          const geminiResponse = await axios({
                            method: "post",
                            url: geminiTtsApiEndpoint,
                            headers: { "Content-Type": "application/json" },
                            data: geminiTtsRequestBody,
                            responseType: "json",
                            timeout: 30000,
                          });
                          if (geminiResponse.data &&
                            geminiResponse.data.candidates &&
                            geminiResponse.data.candidates[0] &&
                            geminiResponse.data.candidates[0].content &&
                            geminiResponse.data.candidates[0].content.parts &&
                            geminiResponse.data.candidates[0].content.parts[0] &&
                            geminiResponse.data.candidates[0].content.parts[0].inlineData &&
                            geminiResponse.data.candidates[0].content.parts[0].inlineData.data) {
                            const audioData = geminiResponse.data.candidates[0].content.parts[0].inlineData.data;
                            const rawPcmBuffer = Buffer.from(audioData, "base64");
                            chunkBuffer = createWavBuffer(rawPcmBuffer, 1, 24000, 16);
                          } else {
                            throw new Error("Gemini TTS: No audio data in response or invalid response structure");
                          }
                        } else if (agentSettings.provider === "elevenlabs") {
                          const elevenLabsVoiceId = agentSettings.voice;
                          let modelId = "eleven_multilingual_v2";
                          if (agentSettings.selectedTtsModelId === "elevenlabs-flash-v2-5") {
                            modelId = "eleven_flash_v2_5";
                          } else if (agentSettings.selectedTtsModelId === "elevenlabs-turbo-v2-5") {
                            modelId = "eleven_turbo_v2_5";
                          }
                          const elevenlabsApiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`;
                          const headers = {
                            "xi-api-key": ttsApiKey,
                            "Content-Type": "application/json",
                            "Accept": "audio/mpeg"
                          };
                          const requestBody = {
                            text: chunkText,
                            model_id: modelId,
                            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                          };
                          const response = await axios({
                            method: "post",
                            url: elevenlabsApiUrl,
                            headers: headers,
                            data: requestBody,
                            responseType: "arraybuffer"
                          });
                          if (response.data) {
                            chunkBuffer = Buffer.from(response.data);
                          } else {
                            throw new Error("ElevenLabs TTS: No audio data returned");
                          }
                        }
                      } catch (err) {
                        logger.error(`[TTS Chunk Error] Failed to generate audio for chunk ${i + 1}/${ttsChunks.length}:`, err);
                        // Check if this is a quota error that should be surfaced to the user
                        if (err instanceof Error && err.message.includes("quota") || 
                            (err as QuotaError)?.code === "insufficient_quota" || 
                            (err as QuotaError)?.status === 429) {
                          logger.warn(`[TTS Quota Error] TTS failed due to quota/rate limit for ${agentToRespond}. This will be surfaced to the user.`);
                          // Store the error in the conversation document for frontend display
                          try {
                            await conversationRef.update({
                              errorContext: `TTS temporarily unavailable for ${agentToRespond}: ${agentSettings.provider} quota exceeded. Please check your API key billing or try again later.`,
                              lastActivity: admin.firestore.FieldValue.serverTimestamp()
                            });
                          } catch (updateErr) {
                            logger.error("Failed to update conversation with TTS error context:", updateErr);
                          }
                        }
                        chunkBuffer = null;
                      }
                      if (chunkBuffer) audioBuffers.push(chunkBuffer);
                    }
                    if (audioBuffers.length > 0) {
                      audioBuffer = Buffer.concat(audioBuffers);
                    }
                }
                if (ttsApiKey && agentSettings && agentSettings.voice) {
                    if (audioBuffer) {
                        logger.info("[TTS Upload] Attempting to upload audio buffer...");
                        const currentMessageId = admin.firestore().collection("dummy").doc().id;
                        let fileExtension = "mp3";
                        let contentType = "audio/mpeg";
                        if (agentSettings.provider === "google-gemini") {
                            fileExtension = "wav";
                            contentType = "audio/wav";
                            logger.info("[TTS Upload] Using WAV format for Google Gemini TTS");
                        }
                        const audioFileName = `conversations/${conversationId}/audio/${currentMessageId}_${agentToRespond}.${fileExtension}`;
                        const file = storageBucket.file(audioFileName);
                        await file.save(audioBuffer, { metadata: { contentType: contentType } });
                        await file.makePublic();
                        audioUrl = file.publicUrl();
                        logger.info(`[TTS Upload Success] TTS audio uploaded for ${agentToRespond} to: ${audioUrl}`);
                        // Clear any previous TTS error context since TTS is now working
                        try {
                            await conversationRef.update({
                                errorContext: admin.firestore.FieldValue.delete()
                            });
                            logger.info(`[TTS Success] Cleared TTS error context for conversation ${conversationId}`);
                        } catch (clearErr) {
                            logger.warn("Failed to clear TTS error context:", clearErr);
                        }
                    } else {
                        logger.warn("[TTS Upload Skip] No audio buffer generated, skipping upload.");
                    }
                }
            }
            return { audioUrl, ttsWasSplit };
        }
        // Helper for Image Generation
        async function runImageGen() {
            logger.info("[DEBUG] Entered runImageGen. imageGenSettings:", imageGenSettings);
            let imageUrl: string | null = null;
            let imageGenError: string | null = null;
            try {
            if (imageGenSettings && imageGenSettings.enabled) {
                logger.info(`[ImageGen] Starting image generation for messageId: ${messageId}`);
                const imageGenStart = Date.now();
                try {
                    // 1. Generate image prompt using selected LLM
                    const promptLlmId = imageGenSettings.promptLlm;
                    const promptSystemMessage = imageGenSettings.promptSystemMessage || "Create a prompt to give to the image generation model based on this turn: {turn}";
                    const promptLlmProvider = getProviderFromId(promptLlmId);
                    const promptLlmFirestoreKeyId = getFirestoreKeyIdFromProvider(promptLlmProvider);
                    if (!promptLlmFirestoreKeyId) throw new Error(`Invalid Firestore key ID for image prompt LLM provider: ${promptLlmProvider}`);
                    const promptLlmSecretVersionName = conversationData.apiSecretVersions[promptLlmFirestoreKeyId];
                    if (!promptLlmSecretVersionName) throw new Error(`API key reference missing for image prompt LLM (${promptLlmProvider}).`);
                    const promptLlmApiKey = await getApiKeyFromSecret(promptLlmSecretVersionName);
                    if (!promptLlmApiKey) throw new Error(`getApiKeyFromSecret returned null for image prompt LLM version ${promptLlmSecretVersionName}`);
                    let promptLlmModel: BaseChatModel;
                    if (promptLlmProvider === "OpenAI") promptLlmModel = new ChatOpenAI({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                    else if (promptLlmProvider === "Google") promptLlmModel = new ChatGoogleGenerativeAI({ apiKey: promptLlmApiKey, model: promptLlmId });
                    else if (promptLlmProvider === "Anthropic") promptLlmModel = new ChatAnthropic({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                    else if (promptLlmProvider === "xAI") promptLlmModel = new ChatXAI({ apiKey: promptLlmApiKey, model: promptLlmId });
                    else if (promptLlmProvider === "TogetherAI") promptLlmModel = new ChatTogetherAI({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                    else throw new Error(`Unsupported provider for image prompt LLM: ${promptLlmProvider}`);
                    // Compose system/user messages
                    const systemMsg = promptSystemMessage.replace("{turn}", responseContent);
                    const promptMessages = [
                        new SystemMessage({ content: systemMsg }),
                        new HumanMessage({ content: responseContent })
                    ];
                    // Use .invoke for single-turn prompt
                    const promptResult = await promptLlmModel.invoke(promptMessages as BaseLanguageModelInput);
                    let imagePrompt: string;
                    if (typeof promptResult === "string") {
                      imagePrompt = promptResult;
                    } else if (promptResult && typeof promptResult.content === "string") {
                      imagePrompt = promptResult.content;
                    } else if (promptResult && Array.isArray(promptResult.content)) {
                      imagePrompt = promptResult.content.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join(" ");
                    } else {
                      imagePrompt = responseContent;
                    }
                    logger.info(`[ImageGen] Generated image prompt: ${imagePrompt}`);
                    
                    // 2. Call image generation API
                    const provider = (imageGenSettings.provider || "").toLowerCase();
                    if (provider === "openai") {
                        // FIX: Correctly retrieve the API key from the secret version reference.
                        const openaiApiKeyRef = conversationData.apiSecretVersions["openai"];
                        if (!openaiApiKeyRef) throw new Error("OpenAI API key reference not found for image generation.");
                        const openaiApiKey = await getApiKeyFromSecret(openaiApiKeyRef);
                        if (!openaiApiKey) throw new Error("getApiKeyFromSecret returned null for OpenAI image generation.");

                        const openai = new OpenAI({ apiKey: openaiApiKey });
                        const quality = imageGenSettings.quality;
                        const size = imageGenSettings.size;
                        const model = imageGenSettings.model || "dall-e-3";

                        // FIX: Changed 'let' to 'const' and 'any' to 'OpenAI.ImageGenerateParams'.
                        // This resolves the 'prefer-const' and 'no-explicit-any' lint errors.
                        const openaiParams: OpenAI.ImageGenerateParams = {
                            prompt: imagePrompt,
                            model: model as "dall-e-2" | "dall-e-3", // Cast model to the allowed types
                            n: 1,
                            response_format: "url", // Common default
                        };

                        // Logic is now structured to correctly assign type-safe parameters
                        if (model === "dall-e-3") {
                            // Assign quality, defaulting to 'standard' if the provided value is invalid
                            openaiParams.quality = (["standard", "hd"].includes(quality)) ? (quality as "standard" | "hd") : "standard";
                            // Assign size, defaulting to '1024x1024' if the provided value is invalid
                            openaiParams.size = (["1024x1024", "1792x1024", "1024x1792"].includes(size)) ? (size as "1024x1024" | "1792x1024" | "1024x1792") : "1024x1024";
                        } else if (model === "dall-e-2") {
                            openaiParams.quality = "standard"; // DALL-E 2 only supports 'standard'
                            // Assign size, defaulting to '1024x1024' if the provided value is invalid
                            openaiParams.size = (["256x256", "512x512", "1024x1024"].includes(size)) ? (size as "256x256" | "512x512" | "1024x1024") : "1024x1024";
                        } else {
                            // The original code checked for "gpt-image-1", which is not a valid image model.
                            // This throws an error for any unsupported model to prevent runtime failures.
                            throw new Error(`Unsupported OpenAI image model: '${model}'. Please use 'dall-e-2' or 'dall-e-3'.`);
                        }

                        // The redundant 'as "url"' and 'as "standard"' assertions are now removed, fixing the 'prefer-as-const' errors.
                        logger.info("[ImageGen] Calling OpenAI images.generate with params:", openaiParams);
                        const openaiRes = await openai.images.generate(openaiParams);
                        if (openaiRes && openaiRes.data && openaiRes.data[0]) {
                            if (openaiRes.data[0].url) {
                                imageUrl = openaiRes.data[0].url;
                                logger.info(`[ImageGen] Image generated (url): ${imageUrl}`);
                            } else if (openaiRes.data[0].b64_json) {
                                // If b64_json is returned, upload to storage and get a public URL (not implemented here)
                                logger.info("[ImageGen] Image generated (b64_json)");
                                // You could add logic here to upload the image to your storage bucket and set imageUrl
                                imageUrl = null; // Not implemented
                            } else {
                                throw new Error("No image URL or b64_json returned from OpenAI image generation.");
                            }
                        } else {
                            throw new Error("No image data returned from OpenAI image generation.");
                        }
                    } else {
                        throw new Error(`Image generation provider not implemented: ${imageGenSettings.provider}`);
                    }
                } catch (err) {
                    imageGenError = err instanceof Error ? err.message : String(err);
                    logger.error("[ImageGen] Error:", err);
                    imageUrl = null;
                }
                const imageGenEnd = Date.now();
                logger.info(`[ImageGen] Image generation for messageId: ${messageId} took ${imageGenEnd - imageGenStart}ms`);
            }
            } catch (err) {
                imageGenError = err instanceof Error ? err.message : String(err);
                logger.error("[ImageGen] Outer Error:", err);
                imageUrl = null;
            }
            return { imageUrl, imageGenError };
        }

        // Run TTS and image generation in parallel
        logger.info(`[Orchestrator] Starting TTS and image generation in parallel for messageId: ${messageId}`);
        const [ttsResult, imageResult] = await Promise.all([
            runTTS(),
            runImageGen()
        ]);
        logger.info(`[Orchestrator] TTS and image generation complete for messageId: ${messageId}`, { ttsResult, imageResult });

        // --- Write Firestore message only after both are ready ---
        const nextTurn = agentToRespond === "agentA" ? "agentB" : "agentA";
        const responseMessage: { role: string; content: string; timestamp: FieldValue; audioUrl?: string | null; ttsWasSplit?: boolean; imageUrl?: string | null; imageGenError?: string | null } = {
            role: agentToRespond, content: responseContent, timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (ttsResult.audioUrl) { responseMessage.audioUrl = ttsResult.audioUrl; }
        if (ttsResult.ttsWasSplit) { responseMessage.ttsWasSplit = true; }
        if (imageResult.imageUrl !== undefined) { responseMessage.imageUrl = imageResult.imageUrl; }
        if (imageResult.imageGenError !== undefined) { responseMessage.imageGenError = imageResult.imageGenError; }
        logger.info(`[Orchestrator] Writing Firestore message for messageId: ${messageId}`, { responseMessage });
        // Fetch the last message
        const lastMsgSnap = await messagesRef.orderBy("timestamp", "desc").limit(1).get();
        const lastMessage = !lastMsgSnap.empty ? lastMsgSnap.docs[0].data() : null;
        if (!forceNextTurn && lastMessage && lastMessage.role === agentToRespond) {
            logger.info(`No response needed: Last message was from ${agentToRespond}.`);
            return;
        }
        try {
            await messagesRef.doc(messageId).set(responseMessage);
            logger.info(`Agent ${agentToRespond} response saved to Firestore (message ID: ${messageId}). TTS and image generation complete.`);
            const updateData: { lastActivity: FieldValue; turn?: string } = {
                lastActivity: admin.firestore.FieldValue.serverTimestamp()
            };
            updateData.turn = nextTurn;
            logger.info(`Updating turn to ${nextTurn} for conversation ${conversationId}.`);
            await conversationRef.update(updateData);
            logger.info(`Conversation ${conversationId} updated after ${agentToRespond}'s turn.`);
        } catch (err) {
            logger.error(`Failed to write agent response to Firestore (message ID: ${messageId}):`, err);
            logger.error("responseMessage object that failed to write:", { responseMessage });
            throw err;
        }
    } catch (error) {
        logger.error(`Error in triggerAgentResponse for ${conversationId} (${agentToRespond}):`, error);
        // ... (error handling unchanged) ...
    }
}
