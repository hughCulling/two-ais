// src/hooks/useInvokeAIImageGen.ts
// Client-side hook to handle InvokeAI image generation for media segments
// Generates images sequentially, one segment at a time

import { useEffect, useRef, useCallback } from 'react';
import { doc, collection, onSnapshot, updateDoc, getDoc, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/clientApp';
import { splitIntoMediaSegments, replacePromptPlaceholders, type MediaGranularity } from '@/lib/segment-utils';
import { getProviderFromId } from '@/lib/models';
import { auth } from '@/lib/firebase/clientApp';

interface ParagraphImage {
    paragraphIndex: number;
    imageUrl: string | null;
    status: 'pending' | 'generating' | 'complete' | 'error';
    error?: string;
}

interface ConversationData {
    status: 'running' | 'stopped' | 'error';
    ollamaEndpoint?: string;
    language?: string;
    imageGenSettings?: {
        enabled: boolean;
        provider?: string;
        invokeaiEndpoint: string;
        invokeaiModel?: string;
        negativePrompt?: string;
        steps?: number;
        guidanceScale?: number;
        width?: number;
        height?: number;
        seed?: number;
        scheduler?: string;
        clipSkip?: number;
        cfgRescaleMultiplier?: number;
        promptLlm: string;
        promptSystemMessage: string;
        promptLookaheadLimit?: number;
        mediaGranularity?: MediaGranularity;
    };
}

interface MessageData {
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    paragraphImages?: ParagraphImage[];
}

interface QueueItem {
    messageId: string;
    paragraphIndex: number;
    messageRef: DocumentReference;
    segmentTexts: string[];
    imageGenSettings: NonNullable<ConversationData['imageGenSettings']>;
    ollamaEndpoint: string;
}

export function useInvokeAIImageGen(conversationId: string | null, userId: string | null) {
    const processingRef = useRef<Set<string>>(new Set()); // Track which messages are being processed
    const generationQueueRef = useRef<QueueItem[]>([]);
    const isGeneratingRef = useRef(false);
    const promptCacheRef = useRef<Map<string, string | null>>(new Map());
    const promptInFlightRef = useRef<Map<string, Promise<string | null>>>(new Map());
    const resetGenerationState = useCallback(() => {
        generationQueueRef.current = [];
        processingRef.current.clear();
        promptCacheRef.current.clear();
        promptInFlightRef.current.clear();
    }, []);

    const processGenerationQueue = useCallback(async () => {
        if (isGeneratingRef.current) return;
        isGeneratingRef.current = true;

        while (generationQueueRef.current.length > 0) {
            const queueItem = generationQueueRef.current.shift();
            if (!queueItem) break;
            const { messageId, paragraphIndex, messageRef, segmentTexts, imageGenSettings, ollamaEndpoint } = queueItem;
            const promptKeyPrefix = `${messageId}:`;
            const currentPromptKey = `${messageId}:${paragraphIndex}`;

            try {
                // Get current message data
                const messageSnap = await getDoc(messageRef);
                if (!messageSnap.exists()) continue;

                const messageData = messageSnap.data() as MessageData;
                const paragraphImages = messageData.paragraphImages || [];

                // Update status to generating
                paragraphImages[paragraphIndex] = {
                    ...paragraphImages[paragraphIndex],
                    status: 'generating',
                };
                await updateDoc(messageRef, { paragraphImages });

                const paragraph = segmentTexts[paragraphIndex];
                if (!paragraph || paragraph.trim().length === 0) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: 'Empty paragraph',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                const getOrCreatePrompt = async (targetParagraphIndex: number): Promise<string | null> => {
                    const targetParagraph = segmentTexts[targetParagraphIndex];
                    if (!targetParagraph || targetParagraph.trim().length === 0) {
                        return null;
                    }

                    const promptKey = `${messageId}:${targetParagraphIndex}`;

                    if (promptCacheRef.current.has(promptKey)) {
                        return promptCacheRef.current.get(promptKey) ?? null;
                    }

                    const inFlightPrompt = promptInFlightRef.current.get(promptKey);
                    if (inFlightPrompt) {
                        return inFlightPrompt;
                    }

                    const promptPromise = generateImagePrompt(
                        targetParagraph,
                        imageGenSettings.promptLlm,
                        imageGenSettings.promptSystemMessage,
                        ollamaEndpoint
                    ).then((generatedPrompt) => {
                        promptCacheRef.current.set(promptKey, generatedPrompt);
                        return generatedPrompt;
                    }).finally(() => {
                        promptInFlightRef.current.delete(promptKey);
                    });

                    promptInFlightRef.current.set(promptKey, promptPromise);
                    return promptPromise;
                };

                // Step 1: Ensure prompt for current paragraph is ready
                const prompt = await getOrCreatePrompt(paragraphIndex);

                if (!prompt) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: 'Failed to generate prompt',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Start prompt generation for upcoming paragraphs while this image renders.
                const lookaheadLimit = Math.max(0, Math.floor(imageGenSettings.promptLookaheadLimit ?? 1));
                if (lookaheadLimit > 0) {
                    for (let offset = 1; offset <= lookaheadLimit; offset++) {
                        const nextParagraphIndex = paragraphIndex + offset;
                        if (nextParagraphIndex >= segmentTexts.length) break;
                        void getOrCreatePrompt(nextParagraphIndex).catch((prefetchError) => {
                            console.warn(`[InvokeAI ImageGen] Prompt lookahead failed for segment ${nextParagraphIndex}:`, prefetchError);
                        });
                    }
                }

                // Step 2: Generate image using InvokeAI
                const imageBase64 = await generateImage(prompt, imageGenSettings);

                if (!imageBase64) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: 'Failed to generate image',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Step 3: Upload image to Firebase Storage
                const imageUrl = await uploadImageToStorage(
                    conversationId!,
                    messageId,
                    paragraphIndex,
                    imageBase64
                );

                if (!imageUrl) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: 'Failed to upload image',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Step 4: Update message with image URL
                paragraphImages[paragraphIndex] = {
                    ...paragraphImages[paragraphIndex],
                    imageUrl,
                    status: 'complete',
                };
                await updateDoc(messageRef, { paragraphImages });

            } catch (error) {
                console.error(`[InvokeAI ImageGen] Error generating image for paragraph ${paragraphIndex}:`, error);

                // Update status to error
                try {
                    const messageSnap = await getDoc(messageRef);
                    if (messageSnap.exists()) {
                        const messageData = messageSnap.data() as MessageData;
                        const paragraphImages = messageData.paragraphImages || [];
                        paragraphImages[paragraphIndex] = {
                            ...paragraphImages[paragraphIndex],
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Unknown error',
                        };
                        await updateDoc(messageRef, { paragraphImages });
                    }
                } catch (updateError) {
                    console.error('[InvokeAI ImageGen] Failed to update error status:', updateError);
                }
            } finally {
                promptCacheRef.current.delete(currentPromptKey);
                promptInFlightRef.current.delete(currentPromptKey);
                if (paragraphIndex >= segmentTexts.length - 1) {
                    for (const key of promptCacheRef.current.keys()) {
                        if (key.startsWith(promptKeyPrefix)) {
                            promptCacheRef.current.delete(key);
                        }
                    }
                    for (const key of promptInFlightRef.current.keys()) {
                        if (key.startsWith(promptKeyPrefix)) {
                            promptInFlightRef.current.delete(key);
                        }
                    }
                }
            }
        }

        isGeneratingRef.current = false;
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId || !userId) {
            resetGenerationState();
            return;
        }

        const conversationRef = doc(db, 'conversations', conversationId);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');

        // Listen to conversation changes to get image generation settings
        const unsubscribeConversation = onSnapshot(conversationRef, async (snapshot) => {
            if (!snapshot.exists()) return;

            const conversationData = snapshot.data() as ConversationData;

            // Only process if image generation is enabled and conversation is running
            if (!conversationData.imageGenSettings?.enabled || conversationData.status !== 'running') {
                return;
            }

            // Listen to messages for new agent messages
            const unsubscribeMessages = onSnapshot(messagesRef, async (messagesSnapshot) => {
                for (const messageDoc of messagesSnapshot.docs) {
                    const messageId = messageDoc.id;
                    const messageData = messageDoc.data() as MessageData;

                    // Only process agent messages that don't have paragraph images yet
                    if ((messageData.role === 'agentA' || messageData.role === 'agentB') &&
                        messageData.content &&
                        !messageData.paragraphImages &&
                        !processingRef.current.has(messageId)) {

                        // Split message into media segments based on configured granularity
                        const settings = conversationData.imageGenSettings!;
                        const granularity: MediaGranularity = settings.mediaGranularity || 'paragraph';
                        const convLanguage = conversationData.language || 'en';
                        const segments = splitIntoMediaSegments(messageData.content, granularity, convLanguage);

                        if (segments.length === 0) continue;

                        // Mark as processing
                        processingRef.current.add(messageId);

                        // Initialize paragraph images array (indexed by segment)
                        const paragraphImages: ParagraphImage[] = segments.map((_, index) => ({
                            paragraphIndex: index,
                            imageUrl: null,
                            status: 'pending',
                        }));

                        // Update message with initial paragraph images state
                        await updateDoc(messageDoc.ref, {
                            paragraphImages,
                        });

                        // Queue all segments for sequential generation
                        const segmentTexts = segments.map(s => s.text);
                        const convOllamaEndpoint = conversationData.ollamaEndpoint || 'http://localhost:11434';
                        for (let i = 0; i < segments.length; i++) {
                            generationQueueRef.current.push({
                                messageId,
                                paragraphIndex: i,
                                messageRef: messageDoc.ref,
                                segmentTexts,
                                imageGenSettings: settings,
                                ollamaEndpoint: convOllamaEndpoint,
                            });
                        }

                        // Start processing queue if not already processing
                        processGenerationQueue();
                    }
                }
            });

            return () => {
                unsubscribeMessages();
            };
        });

        return () => {
            unsubscribeConversation();
            resetGenerationState();
        };
    }, [conversationId, userId, processGenerationQueue, resetGenerationState]);

    async function generateImagePrompt(
        paragraph: string,
        promptLlmId: string,
        promptSystemMessage: string,
        ollamaEndpoint: string = 'http://localhost:11434'
    ): Promise<string | null> {
        try {
            // Replace {paragraph} / {text} placeholders
            const systemMessage = replacePromptPlaceholders(promptSystemMessage, paragraph);

            // Check if prompt LLM is Ollama (local) or cloud-based
            const provider = getProviderFromId(promptLlmId);

            if (provider === 'Ollama') {
                // Use Ollama API route
                const modelName = promptLlmId.replace(/^ollama:/, '');
                // Use the conversation's configured Ollama endpoint (ngrok URL or localhost)

                const response = await fetch('/api/ollama/stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: modelName,
                        messages: [
                            { role: 'system', content: systemMessage },
                            { role: 'user', content: paragraph },
                        ],
                        ollamaEndpoint,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Ollama API error: ${response.statusText}`);
                }

                // Read streaming response
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let prompt = '';

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') break;

                                try {
                                    const parsed = JSON.parse(data);
                                    if (parsed.token) {
                                        prompt += parsed.token;
                                    }
                                } catch {
                                    // Ignore parse errors
                                }
                            }
                        }
                    }
                }

                return prompt.trim() || null;
            } else {
                const currentUser = auth.currentUser;
                const idToken = currentUser ? await currentUser.getIdToken() : null;
                if (!idToken) {
                    throw new Error('Not authenticated');
                }

                const res = await fetch('/api/image-prompt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        paragraph,
                        promptLlmId,
                        promptSystemMessage,
                    }),
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Image prompt API error: ${res.status} ${res.statusText} - ${errorText}`);
                }
                const data = await res.json();
                const prompt = typeof data?.prompt === 'string' ? data.prompt : '';
                return prompt.trim() || null;
            }
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error generating prompt:', error);
            return null;
        }
    }

    async function generateImage(
        prompt: string,
        imageGenSettings: NonNullable<ConversationData['imageGenSettings']>
    ): Promise<string | null> {
        try {
            const response = await fetch('/api/invokeai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    invokeaiEndpoint: imageGenSettings.invokeaiEndpoint,
                    model: imageGenSettings.invokeaiModel,
                    negative_prompt: imageGenSettings.negativePrompt,
                    steps: imageGenSettings.steps,
                    guidance_scale: imageGenSettings.guidanceScale,
                    width: imageGenSettings.width,
                    height: imageGenSettings.height,
                    seed: imageGenSettings.seed,
                    scheduler: imageGenSettings.scheduler,
                    clip_skip: imageGenSettings.clipSkip,
                    cfg_rescale_multiplier: imageGenSettings.cfgRescaleMultiplier,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`InvokeAI API error: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            return result.image || null;
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error generating image:', error);
            return null;
        }
    }

    async function uploadImageToStorage(
        conversationId: string,
        messageId: string,
        paragraphIndex: number,
        imageBase64: string
    ): Promise<string | null> {
        try {
            // Convert base64 to blob
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const blob = new Blob([buffer], { type: 'image/png' });

            // Upload to Firebase Storage
            const storagePath = `conversations/${conversationId}/images/${messageId}_${paragraphIndex}.png`;
            const storageRef = ref(storage, storagePath);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error uploading image:', error);
            return null;
        }
    }
}
