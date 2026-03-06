import { useEffect, useRef, useCallback } from 'react';
import { doc, collection, onSnapshot, updateDoc, getDoc, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/clientApp';
import { splitIntoParagraphs } from '@/lib/tts-utils';
import removeMarkdown from 'remove-markdown';
import { cleanTextForTTS, removeEmojis } from '@/lib/utils';

interface ConversationData {
    status: 'running' | 'stopped' | 'error';
    localaiEndpoint?: string;
    ttsSettings?: {
        enabled: boolean;
        agentA: { provider: string; voice: string | null; selectedTtsModelId?: string };
        agentB: { provider: string; voice: string | null; selectedTtsModelId?: string };
    };
}

interface MessageData {
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    isStreaming?: boolean;
    paragraphAudioUrls?: Array<string | null>;
    paragraphAudioErrors?: Array<string | null>;
}

export function useLocalAITTSGen(conversationId: string | null, userId: string | null) {
    const SILENT_WAV_DATA_URL = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    const queuedParagraphKeysRef = useRef<Set<string>>(new Set());
    const isConversationRunnableRef = useRef(false);
    const localAIEndpointRef = useRef<string | null>(null);
    const localAITtsSettingsRef = useRef<ConversationData['ttsSettings'] | null>(null);
    const warnedParagraphErrorRulesRef = useRef(false);
    const generationQueueRef = useRef<Array<{
        messageId: string;
        paragraphIndex: number;
        messageRef: DocumentReference;
        paragraphs: string[];
        endpoint: string;
        model: string;
        voice?: string;
    }>>([]);
    const isGeneratingRef = useRef(false);
    const queueKey = (messageId: string, paragraphIndex: number) => `${messageId}:${paragraphIndex}`;
    const isPermissionDeniedError = (error: unknown): boolean => {
        if (!error || typeof error !== 'object') return false;
        return 'code' in error && (error as { code?: string }).code === 'permission-denied';
    };
    const updateMessageMetadata = useCallback(async (messageRef: DocumentReference, payload: Record<string, unknown>) => {
        try {
            await updateDoc(messageRef, payload);
            return;
        } catch (error) {
            if (!isPermissionDeniedError(error)) {
                throw error;
            }

            // Backward-compatible fallback: if rules don't allow paragraphAudioErrors yet,
            // retry without that field so paragraph audio generation can still continue.
            if ('paragraphAudioErrors' in payload) {
                const fallbackPayload = { ...payload };
                delete (fallbackPayload as { paragraphAudioErrors?: unknown }).paragraphAudioErrors;

                if (Object.keys(fallbackPayload).length === 0) {
                    if (!warnedParagraphErrorRulesRef.current) {
                        warnedParagraphErrorRulesRef.current = true;
                        console.warn('[LocalAI TTS] Firestore rules do not allow paragraphAudioErrors updates yet. Continuing without writing error metadata.');
                    }
                    return;
                }

                await updateDoc(messageRef, fallbackPayload);
                if (!warnedParagraphErrorRulesRef.current) {
                    warnedParagraphErrorRulesRef.current = true;
                    console.warn('[LocalAI TTS] Firestore rules blocked paragraphAudioErrors updates. Falling back to paragraphAudioUrls-only writes.');
                }
                return;
            }

            throw error;
        }
    }, []);

    const processGenerationQueue = useCallback(async () => {
        if (isGeneratingRef.current) return;
        isGeneratingRef.current = true;

        while (generationQueueRef.current.length > 0) {
            if (!isConversationRunnableRef.current) {
                break;
            }

            const item = generationQueueRef.current.shift();
            if (!item) continue;

            queuedParagraphKeysRef.current.delete(queueKey(item.messageId, item.paragraphIndex));
            const { messageId, paragraphIndex, messageRef, paragraphs, endpoint, model, voice } = item;
            let attempt = 0;

            while (isConversationRunnableRef.current) {
                const messageSnap = await getDoc(messageRef);
                if (!messageSnap.exists()) break;

                const messageData = messageSnap.data() as MessageData;
                const paragraphAudioUrls = Array.isArray(messageData.paragraphAudioUrls)
                    ? [...messageData.paragraphAudioUrls]
                    : [];
                const paragraphAudioErrors = Array.isArray(messageData.paragraphAudioErrors)
                    ? [...messageData.paragraphAudioErrors]
                    : [];

                const paragraph = paragraphs[paragraphIndex];
                if (!paragraph || paragraph.trim().length === 0) {
                    // No speakable content - treat as an intentional short pause clip.
                    paragraphAudioUrls[paragraphIndex] = SILENT_WAV_DATA_URL;
                    paragraphAudioErrors[paragraphIndex] = null;
                    await updateMessageMetadata(messageRef, { paragraphAudioUrls, paragraphAudioErrors });
                    break;
                }

                const cleaned = cleanTextForTTS(removeEmojis(removeMarkdown(paragraph)));
                if (!cleaned.trim()) {
                    paragraphAudioUrls[paragraphIndex] = SILENT_WAV_DATA_URL;
                    paragraphAudioErrors[paragraphIndex] = null;
                    await updateMessageMetadata(messageRef, { paragraphAudioUrls, paragraphAudioErrors });
                    break;
                }

                const alreadyGenerated = paragraphAudioUrls[paragraphIndex];
                if (typeof alreadyGenerated === 'string' && alreadyGenerated.length > 0) {
                    break;
                }

                try {
                    const ttsResp = await fetch('/api/localai/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            endpoint,
                            model,
                            voice,
                            input: cleaned,
                        }),
                    });

                    const contentType = ttsResp.headers.get('content-type') || 'audio/wav';
                    const arrayBuffer = await ttsResp.arrayBuffer();

                    if (!ttsResp.ok) {
                        const responseText = new TextDecoder().decode(arrayBuffer).slice(0, 240);
                        throw new Error(`HTTP ${ttsResp.status} ${ttsResp.statusText} - ${responseText}`);
                    }

                    // If API returned JSON/text, treat it as an error and retry.
                    if (contentType.includes('application/json') || contentType.includes('text/')) {
                        const responseText = new TextDecoder().decode(arrayBuffer).slice(0, 240);
                        throw new Error(`Non-audio LocalAI response (${contentType}) - ${responseText}`);
                    }

                    const blob = new Blob([arrayBuffer], { type: contentType });
                    const ext = contentType.includes('mpeg') ? 'mp3' : 'wav';
                    const storagePath = `conversations/${conversationId}/audio/${messageId}_${paragraphIndex}.${ext}`;
                    const storageRef = ref(storage, storagePath);

                    await uploadBytes(storageRef, blob, { contentType });
                    const downloadURL = await getDownloadURL(storageRef);

                    paragraphAudioUrls[paragraphIndex] = downloadURL;
                    paragraphAudioErrors[paragraphIndex] = null;
                    await updateMessageMetadata(messageRef, { paragraphAudioUrls, paragraphAudioErrors });
                    break;
                } catch (error) {
                    attempt++;
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    const retryDelayMs = Math.min(1000 * Math.pow(2, Math.min(attempt - 1, 4)), 15000);
                    const retryStatus = `Paragraph ${paragraphIndex + 1} TTS failed (attempt ${attempt}). Retrying in ${Math.round(retryDelayMs / 1000)}s.`;

                    console.error(`[LocalAI TTS] ${retryStatus}`, error);

                    try {
                        paragraphAudioErrors[paragraphIndex] = `${retryStatus} ${errorMessage}`.slice(0, 500);
                        await updateMessageMetadata(messageRef, { paragraphAudioErrors });
                    } catch (updateError) {
                        console.error('[LocalAI TTS] Failed to update retry status:', updateError);
                    }

                    await new Promise(resolve => setTimeout(resolve, retryDelayMs));
                }
            }
        }

        isGeneratingRef.current = false;
    }, [conversationId, updateMessageMetadata]);

    useEffect(() => {
        if (!conversationId || !userId) return;

        const conversationRef = doc(db, 'conversations', conversationId);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        let unsubscribeMessages: (() => void) | null = null;

        const unsubscribeConversation = onSnapshot(conversationRef, async (snapshot) => {
            if (!snapshot.exists()) {
                isConversationRunnableRef.current = false;
                localAIEndpointRef.current = null;
                localAITtsSettingsRef.current = null;
                if (unsubscribeMessages) {
                    unsubscribeMessages();
                    unsubscribeMessages = null;
                }
                return;
            }

            const conversationData = snapshot.data() as ConversationData;
            if (conversationData.status !== 'running' || !conversationData.ttsSettings?.enabled) {
                isConversationRunnableRef.current = false;
                localAIEndpointRef.current = null;
                localAITtsSettingsRef.current = null;
                if (unsubscribeMessages) {
                    unsubscribeMessages();
                    unsubscribeMessages = null;
                }
                return;
            }
            const endpoint = conversationData.localaiEndpoint;
            if (!endpoint || !endpoint.trim()) {
                isConversationRunnableRef.current = false;
                localAIEndpointRef.current = null;
                localAITtsSettingsRef.current = null;
                if (unsubscribeMessages) {
                    unsubscribeMessages();
                    unsubscribeMessages = null;
                }
                return;
            }
            isConversationRunnableRef.current = true;
            localAIEndpointRef.current = endpoint;
            localAITtsSettingsRef.current = conversationData.ttsSettings;

            // If work was queued while paused/unavailable, resume processing now.
            if (generationQueueRef.current.length > 0) {
                processGenerationQueue();
            }

            if (!unsubscribeMessages) {
                unsubscribeMessages = onSnapshot(messagesRef, async (messagesSnapshot) => {
                    for (const messageDoc of messagesSnapshot.docs) {
                        const messageId = messageDoc.id;
                        const messageData = messageDoc.data() as MessageData;

                        if (messageData.role !== 'agentA' && messageData.role !== 'agentB') continue;
                        if (!messageData.content) continue;
                        if (messageData.isStreaming) continue;

                        const currentEndpoint = localAIEndpointRef.current;
                        const currentTtsSettings = localAITtsSettingsRef.current;
                        if (!currentEndpoint || !currentTtsSettings) continue;

                        const agentTts = currentTtsSettings[messageData.role];
                        if (!agentTts) continue;
                        if (agentTts.provider !== 'localai') continue;

                        const model = agentTts.selectedTtsModelId;
                        const voice = typeof agentTts.voice === 'string' ? agentTts.voice.trim() : '';
                        if (!model || !model.trim()) continue;

                        const paragraphs = splitIntoParagraphs(messageData.content);
                        if (paragraphs.length === 0) continue;

                        try {
                            let paragraphAudioUrls = Array.isArray(messageData.paragraphAudioUrls)
                                ? [...messageData.paragraphAudioUrls]
                                : [];
                            let paragraphAudioErrors = Array.isArray(messageData.paragraphAudioErrors)
                                ? [...messageData.paragraphAudioErrors]
                                : [];

                            let shouldUpdateDoc = false;
                            if (paragraphAudioUrls.length !== paragraphs.length) {
                                paragraphAudioUrls = paragraphs.map((_, idx) => paragraphAudioUrls[idx] ?? null);
                                shouldUpdateDoc = true;
                            }
                            if (paragraphAudioErrors.length !== paragraphs.length) {
                                paragraphAudioErrors = paragraphs.map((_, idx) => paragraphAudioErrors[idx] ?? null);
                                shouldUpdateDoc = true;
                            }

                            if (shouldUpdateDoc) {
                                await updateMessageMetadata(messageDoc.ref, { paragraphAudioUrls, paragraphAudioErrors });
                            }

                            for (let i = 0; i < paragraphs.length; i++) {
                                const existingUrl = paragraphAudioUrls[i];
                                if (typeof existingUrl === 'string' && existingUrl.length > 0) {
                                    continue;
                                }

                                const key = queueKey(messageId, i);
                                if (queuedParagraphKeysRef.current.has(key)) {
                                    continue;
                                }
                                queuedParagraphKeysRef.current.add(key);

                                generationQueueRef.current.push({
                                    messageId,
                                    paragraphIndex: i,
                                    messageRef: messageDoc.ref,
                                    paragraphs,
                                    endpoint: currentEndpoint,
                                    model,
                                    voice: voice || undefined,
                                });
                            }

                            if (generationQueueRef.current.length > 0) {
                                processGenerationQueue();
                            }
                        } catch (error) {
                            console.error('[LocalAI TTS] Failed to initialize/enqueue paragraph audio generation:', error);
                        }
                    }
                });
            }
        });

        return () => {
            isConversationRunnableRef.current = false;
            localAIEndpointRef.current = null;
            localAITtsSettingsRef.current = null;
            if (unsubscribeMessages) {
                unsubscribeMessages();
            }
            unsubscribeConversation();
        };
    }, [conversationId, userId, processGenerationQueue, updateMessageMetadata]);
}
