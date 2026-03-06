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
}

export function useLocalAITTSGen(conversationId: string | null, userId: string | null) {
    const processingRef = useRef<Set<string>>(new Set());
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

    const processGenerationQueue = useCallback(async () => {
        if (isGeneratingRef.current) return;
        isGeneratingRef.current = true;

        while (generationQueueRef.current.length > 0) {
            const item = generationQueueRef.current.shift();
            if (!item) continue;

            const { messageId, paragraphIndex, messageRef, paragraphs, endpoint, model, voice } = item;

            try {
                const messageSnap = await getDoc(messageRef);
                if (!messageSnap.exists()) continue;

                const messageData = messageSnap.data() as MessageData;
                const paragraphAudioUrls = Array.isArray(messageData.paragraphAudioUrls)
                    ? [...messageData.paragraphAudioUrls]
                    : [];

                const paragraph = paragraphs[paragraphIndex];
                if (!paragraph || paragraph.trim().length === 0) {
                    // Empty paragraph: mark as done but skip playback later
                    paragraphAudioUrls[paragraphIndex] = '';
                    await updateDoc(messageRef, { paragraphAudioUrls });
                    continue;
                }

                const cleaned = cleanTextForTTS(removeEmojis(removeMarkdown(paragraph)));

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

                // If API returned JSON error, it'll still be 200 in our proxy right now.
                // Best-effort detect non-audio replies.
                if (contentType.includes('application/json') || contentType.includes('text/')) {
                    paragraphAudioUrls[paragraphIndex] = '';
                    await updateDoc(messageRef, { paragraphAudioUrls });
                    continue;
                }

                const blob = new Blob([arrayBuffer], { type: contentType });
                const ext = contentType.includes('mpeg') ? 'mp3' : 'wav';
                const storagePath = `conversations/${conversationId}/audio/${messageId}_${paragraphIndex}.${ext}`;
                const storageRef = ref(storage, storagePath);

                await uploadBytes(storageRef, blob, { contentType });
                const downloadURL = await getDownloadURL(storageRef);

                paragraphAudioUrls[paragraphIndex] = downloadURL;
                await updateDoc(messageRef, { paragraphAudioUrls });
            } catch (error) {
                console.error(`[LocalAI TTS] Error generating audio for paragraph ${paragraphIndex}:`, error);
                try {
                    const messageSnap = await getDoc(messageRef);
                    if (messageSnap.exists()) {
                        const messageData = messageSnap.data() as MessageData;
                        const paragraphAudioUrls = Array.isArray(messageData.paragraphAudioUrls)
                            ? [...messageData.paragraphAudioUrls]
                            : [];
                        paragraphAudioUrls[paragraphIndex] = '';
                        await updateDoc(messageRef, { paragraphAudioUrls });
                    }
                } catch (updateError) {
                    console.error('[LocalAI TTS] Failed to update error state:', updateError);
                }
            }
        }

        isGeneratingRef.current = false;
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId || !userId) return;

        const conversationRef = doc(db, 'conversations', conversationId);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');

        const unsubscribeConversation = onSnapshot(conversationRef, async (snapshot) => {
            if (!snapshot.exists()) return;

            const conversationData = snapshot.data() as ConversationData;
            if (conversationData.status !== 'running') return;
            if (!conversationData.ttsSettings?.enabled) return;
            const endpoint = conversationData.localaiEndpoint;
            if (!endpoint || !endpoint.trim()) return;

            const unsubscribeMessages = onSnapshot(messagesRef, async (messagesSnapshot) => {
                for (const messageDoc of messagesSnapshot.docs) {
                    const messageId = messageDoc.id;
                    const messageData = messageDoc.data() as MessageData;

                    if (messageData.role !== 'agentA' && messageData.role !== 'agentB') continue;
                    if (!messageData.content) continue;
                    if (messageData.isStreaming) continue;
                    if (Array.isArray(messageData.paragraphAudioUrls) && messageData.paragraphAudioUrls.length > 0) continue;
                    if (processingRef.current.has(messageId)) continue;

                    const agentTts = conversationData.ttsSettings?.[messageData.role];
                    if (!agentTts) continue;
                    if (agentTts.provider !== 'localai') continue;

                    const model = agentTts.selectedTtsModelId;
                    const voice = typeof agentTts.voice === 'string' ? agentTts.voice.trim() : '';
                    if (!model || !model.trim()) continue;

                    const paragraphs = splitIntoParagraphs(messageData.content);
                    if (paragraphs.length === 0) continue;

                    try {
                        processingRef.current.add(messageId);

                        const initialUrls: Array<string | null> = paragraphs.map(() => null);
                        await updateDoc(messageDoc.ref, { paragraphAudioUrls: initialUrls });

                        for (let i = 0; i < paragraphs.length; i++) {
                            generationQueueRef.current.push({
                                messageId,
                                paragraphIndex: i,
                                messageRef: messageDoc.ref,
                                paragraphs,
                                endpoint,
                                model,
                                voice: voice || undefined,
                            });
                        }

                        processGenerationQueue();
                    } catch (error) {
                        console.error('[LocalAI TTS] Failed to initialize paragraphAudioUrls:', error);
                        processingRef.current.delete(messageId);
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
}
