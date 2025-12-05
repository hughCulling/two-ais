// src/hooks/useInvokeAIImageGen.ts
// Client-side hook to handle InvokeAI image generation for paragraphs
// Generates images sequentially, one paragraph at a time

import { useEffect, useRef, useCallback } from 'react';
import { doc, collection, onSnapshot, updateDoc, getDoc, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/clientApp';
import { splitIntoParagraphs } from '@/lib/tts-utils';
import { getProviderFromId } from '@/lib/models';

interface ParagraphImage {
    paragraphIndex: number;
    imageUrl: string | null;
    status: 'pending' | 'generating' | 'complete' | 'error';
    error?: string;
}

interface ConversationData {
    status: 'running' | 'stopped' | 'error';
    imageGenSettings?: {
        enabled: boolean;
        invokeaiEndpoint: string;
        promptLlm: string;
        promptSystemMessage: string;
    };
}

interface MessageData {
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    paragraphImages?: ParagraphImage[];
}

export function useInvokeAIImageGen(conversationId: string | null, userId: string | null) {
    const processingRef = useRef<Set<string>>(new Set()); // Track which messages are being processed
    const generationQueueRef = useRef<Array<{ messageId: string; paragraphIndex: number; messageRef: DocumentReference; paragraphs: string[]; imageGenSettings: NonNullable<ConversationData['imageGenSettings']> }>>([]);
    const isGeneratingRef = useRef(false);

    const processGenerationQueue = useCallback(async () => {
        if (isGeneratingRef.current) return;
        isGeneratingRef.current = true;

        while (generationQueueRef.current.length > 0) {
            const { messageId, paragraphIndex, messageRef, paragraphs, imageGenSettings } = generationQueueRef.current.shift()!;

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

                const paragraph = paragraphs[paragraphIndex];
                if (!paragraph || paragraph.trim().length === 0) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: 'Empty paragraph',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Step 1: Generate prompt using prompt LLM
                const prompt = await generateImagePrompt(
                    paragraph,
                    imageGenSettings.promptLlm,
                    imageGenSettings.promptSystemMessage
                );

                if (!prompt) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: 'Failed to generate prompt',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Step 2: Generate image using InvokeAI
                const imageBase64 = await generateImage(prompt, imageGenSettings.invokeaiEndpoint);

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
            }
        }

        isGeneratingRef.current = false;
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId || !userId) return;

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

                        // Split message into paragraphs
                        const paragraphs = splitIntoParagraphs(messageData.content);

                        if (paragraphs.length === 0) continue;

                        // Mark as processing
                        processingRef.current.add(messageId);

                        // Initialize paragraph images array
                        const paragraphImages: ParagraphImage[] = paragraphs.map((_, index) => ({
                            paragraphIndex: index,
                            imageUrl: null,
                            status: 'pending',
                        }));

                        // Update message with initial paragraph images state
                        await updateDoc(messageDoc.ref, {
                            paragraphImages,
                        });

                        // Queue all paragraphs for sequential generation
                        // At this point, imageGenSettings is guaranteed to exist due to check at line 167
                        const settings = conversationData.imageGenSettings!;
                        for (let i = 0; i < paragraphs.length; i++) {
                            generationQueueRef.current.push({
                                messageId,
                                paragraphIndex: i,
                                messageRef: messageDoc.ref,
                                paragraphs,
                                imageGenSettings: settings,
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
        };
    }, [conversationId, userId, processGenerationQueue]);

    async function generateImagePrompt(
        paragraph: string,
        promptLlmId: string,
        promptSystemMessage: string
    ): Promise<string | null> {
        try {
            // Replace {paragraph} placeholder
            const systemMessage = promptSystemMessage.replace('{paragraph}', paragraph);

            // Check if prompt LLM is Ollama (local) or cloud-based
            const provider = getProviderFromId(promptLlmId);

            if (provider === 'Ollama') {
                // Use Ollama API route
                const modelName = promptLlmId.replace(/^ollama:/, '');
                // Use default Ollama endpoint (localhost:11434) - InvokeAI endpoint is separate
                const ollamaEndpoint = 'http://localhost:11434';

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
                // Use cloud LLM via Firebase Functions or API
                // For now, return a simple prompt - this can be enhanced later
                // TODO: Implement cloud LLM prompt generation
                console.warn('[InvokeAI ImageGen] Cloud LLM prompt generation not yet implemented');
                return `A detailed image depicting: ${paragraph}`;
            }
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error generating prompt:', error);
            return null;
        }
    }

    async function generateImage(prompt: string, invokeaiEndpoint: string): Promise<string | null> {
        try {
            const response = await fetch('/api/invokeai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    invokeaiEndpoint,
                    steps: 20,
                    guidance_scale: 7.5,
                    width: 512,
                    height: 512,
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

