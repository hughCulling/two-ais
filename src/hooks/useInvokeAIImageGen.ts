// src/hooks/useInvokeAIImageGen.ts
// Client-side hook to handle InvokeAI image generation for media segments
// Generates images sequentially, one segment at a time

import { useEffect, useRef, useCallback } from 'react';
import { doc, collection, onSnapshot, updateDoc, getDoc, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/clientApp';
import {
    buildIndexedSmartMediaSegments,
    createIndexedMediaSegmentationPrompt,
    splitIntoMediaSegments,
    replacePromptPlaceholders,
    type MediaGranularity,
    type IndexedMediaSegmentationMismatch,
    type MediaSegment,
} from '@/lib/segment-utils';
import { getProviderFromId } from '@/lib/models';
import { auth } from '@/lib/firebase/clientApp';
import { getInvokeAIErrorMessage } from '@/lib/invokeai';
import {
    DEFAULT_SMART_MEDIA_SEGMENTATION_PROMPT,
    normalizeImageSearchQuery,
    type ImageMediaProvider,
    type ImageSearchOrientation,
    type ImageSearchResult,
    type ImageSearchSize,
    type ImageSearchType,
    type ImageSourceMetadata,
    type PixabayMediaType,
    type VideoSearchDuration,
    type VideoSearchResult,
    type VideoSearchType,
} from '@/lib/image-media';

interface ParagraphImage {
    paragraphIndex: number;
    imageUrl: string | null;
    mediaType?: PixabayMediaType;
    videoUrl?: string;
    posterUrl?: string;
    status: 'pending' | 'generating' | 'complete' | 'error';
    error?: string;
    source?: ImageSourceMetadata;
    alt?: string;
    width?: number;
    height?: number;
    duration?: number;
    sizeBytes?: number;
    searchQuery?: string;
    mediaPrompt?: string;
    mediaPromptType?: 'image-prompt' | 'search-query';
}

interface MediaSegmentationDebug {
    status: 'ok' | 'empty' | 'invalid-json' | 'invalid-indexes' | 'source-mismatch' | 'error';
    rawResponse?: string;
    rawResponseTruncated?: boolean;
    parsedSections?: string[];
    parsedSectionsTruncated?: boolean;
    mismatch?: SmartMediaMismatchDetails;
    breakOffsets?: number[];
    breakTokenIds?: number[];
    tokenCount?: number;
    fallbackUsed: 'paragraph' | null;
    error?: string;
    promptLlm?: string;
    segmentCount?: number;
    createdAt: string;
}

type SmartMediaMismatchDetails = IndexedMediaSegmentationMismatch;

interface SmartMediaSegmentationResult {
    segments: MediaSegment[];
    debug?: MediaSegmentationDebug;
}

interface ConversationData {
    status: 'running' | 'stopped' | 'error';
    ollamaEndpoint?: string;
    language?: string;
    imageGenSettings?: {
        enabled: boolean;
        provider?: ImageMediaProvider;
        invokeaiEndpoint?: string;
        invokeaiModel?: string;
        invokeaiLoraKey?: string;
        invokeaiLoraWeight?: number;
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
        panoramaMode?: boolean;
        pixabayMediaType?: PixabayMediaType;
        searchOrientation?: ImageSearchOrientation;
        searchSize?: ImageSearchSize;
        searchImageType?: ImageSearchType;
        videoSearchType?: VideoSearchType;
        videoSearchDuration?: VideoSearchDuration;
    };
}

interface MessageData {
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    paragraphImages?: ParagraphImage[];
    mediaSegments?: MediaSegment[];
    mediaSegmentationDebug?: MediaSegmentationDebug;
}

interface QueueItem {
    messageId: string;
    paragraphIndex: number;
    messageRef: DocumentReference;
    segmentTexts: string[];
    imageGenSettings: NonNullable<ConversationData['imageGenSettings']>;
    ollamaEndpoint: string;
}

interface PromptQueueItem {
    promptKey: string;
    paragraph: string;
    promptLlmId: string;
    promptSystemMessage: string;
    ollamaEndpoint: string;
    resolve: (prompt: string | null) => void;
}

export function useInvokeAIImageGen(conversationId: string | null, userId: string | null) {
    const processingRef = useRef<Set<string>>(new Set()); // Track which messages are being processed
    const generationQueueRef = useRef<QueueItem[]>([]);
    const isGeneratingRef = useRef(false);
    const promptCacheRef = useRef<Map<string, string>>(new Map());
    const promptInFlightRef = useRef<Map<string, Promise<string | null>>>(new Map());
    const promptQueueRef = useRef<PromptQueueItem[]>([]);
    const queuedPromptKeysRef = useRef<Set<string>>(new Set());
    const isPromptWorkerRunningRef = useRef(false);
    const resetGenerationState = useCallback(() => {
        generationQueueRef.current = [];
        processingRef.current.clear();
        promptCacheRef.current.clear();
        promptInFlightRef.current.clear();
        promptQueueRef.current = [];
        queuedPromptKeysRef.current.clear();
        isPromptWorkerRunningRef.current = false;
    }, []);

    const isPermissionDeniedError = (error: unknown): boolean => {
        return Boolean(
            error &&
            typeof error === 'object' &&
            'code' in error &&
            (error as { code?: string }).code === 'permission-denied'
        );
    };

    const runPromptQueue = useCallback(async () => {
        if (isPromptWorkerRunningRef.current) return;
        isPromptWorkerRunningRef.current = true;

        while (promptQueueRef.current.length > 0) {
            const promptQueueItem = promptQueueRef.current.shift();
            if (!promptQueueItem) break;

            queuedPromptKeysRef.current.delete(promptQueueItem.promptKey);

            try {
                const generatedPrompt = await generateImagePrompt(
                    promptQueueItem.paragraph,
                    promptQueueItem.promptLlmId,
                    promptQueueItem.promptSystemMessage,
                    promptQueueItem.ollamaEndpoint
                );
                const trimmedPrompt = generatedPrompt?.trim() || null;

                if (trimmedPrompt) {
                    promptCacheRef.current.set(promptQueueItem.promptKey, trimmedPrompt);
                }

                promptQueueItem.resolve(trimmedPrompt);
            } catch (error) {
                console.error('[InvokeAI ImageGen] Sequential prompt worker failed:', error);
                promptQueueItem.resolve(null);
            } finally {
                promptInFlightRef.current.delete(promptQueueItem.promptKey);
            }
        }

        isPromptWorkerRunningRef.current = false;

        if (promptQueueRef.current.length > 0) {
            void runPromptQueue();
        }
    }, []);

    const enqueuePromptGeneration = useCallback((
        promptKey: string,
        paragraph: string,
        imageGenSettings: NonNullable<ConversationData['imageGenSettings']>,
        ollamaEndpoint: string
    ): Promise<string | null> => {
        const cachedPrompt = promptCacheRef.current.get(promptKey);
        if (cachedPrompt) {
            return Promise.resolve(cachedPrompt);
        }

        const inFlightPrompt = promptInFlightRef.current.get(promptKey);
        if (inFlightPrompt) {
            return inFlightPrompt;
        }

        const promptPromise = new Promise<string | null>((resolve) => {
            promptQueueRef.current.push({
                promptKey,
                paragraph,
                promptLlmId: imageGenSettings.promptLlm,
                promptSystemMessage: imageGenSettings.promptSystemMessage,
                ollamaEndpoint,
                resolve,
            });
            queuedPromptKeysRef.current.add(promptKey);
        });

        promptInFlightRef.current.set(promptKey, promptPromise);
        void runPromptQueue();

        return promptPromise;
    }, [runPromptQueue]);

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
                        return promptCacheRef.current.get(promptKey) || null;
                    }

                    const inFlightPrompt = promptInFlightRef.current.get(promptKey);
                    if (inFlightPrompt) {
                        return inFlightPrompt;
                    }

                    return enqueuePromptGeneration(promptKey, targetParagraph, imageGenSettings, ollamaEndpoint);
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
                        const nextPromptKey = `${messageId}:${nextParagraphIndex}`;
                        if (!promptCacheRef.current.has(nextPromptKey) &&
                            !promptInFlightRef.current.has(nextPromptKey) &&
                            !queuedPromptKeysRef.current.has(nextPromptKey)) {
                            void getOrCreatePrompt(nextParagraphIndex).then((prefetchedPrompt) => {
                                if (!prefetchedPrompt) {
                                    console.warn(`[InvokeAI ImageGen] Prompt lookahead returned no prompt for segment ${nextParagraphIndex}`);
                                }
                            }).catch((prefetchError) => {
                                console.warn(`[InvokeAI ImageGen] Prompt lookahead failed for segment ${nextParagraphIndex}:`, prefetchError);
                            });
                        }
                    }
                }

                if (imageGenSettings.provider === 'pixabay') {
                    const mediaType = imageGenSettings.pixabayMediaType || 'image';
                    const searchQuery = normalizeImageSearchQuery(prompt);

                    if (mediaType === 'video') {
                        const videoResult = await searchPixabayVideo(prompt, imageGenSettings);

                        if (!videoResult.result) {
                            paragraphImages[paragraphIndex] = {
                                ...paragraphImages[paragraphIndex],
                                mediaType: 'video',
                                status: 'error',
                                error: videoResult.error || 'Failed to find a Pixabay video',
                            };
                            await updateDoc(messageRef, { paragraphImages });
                            continue;
                        }

                        paragraphImages[paragraphIndex] = {
                            ...paragraphImages[paragraphIndex],
                            mediaType: 'video',
                            imageUrl: videoResult.result.posterUrl || null,
                            videoUrl: videoResult.result.videoUrl,
                            posterUrl: videoResult.result.posterUrl,
                            status: 'complete',
                            source: videoResult.result.source,
                            alt: videoResult.result.alt || prompt,
                            width: videoResult.result.width,
                            height: videoResult.result.height,
                            duration: videoResult.result.duration,
                            sizeBytes: videoResult.result.sizeBytes,
                            searchQuery,
                            mediaPrompt: searchQuery,
                            mediaPromptType: 'search-query',
                        };
                        await updateDoc(messageRef, { paragraphImages });
                        continue;
                    }

                    const imageResult = await searchPixabayImage(prompt, imageGenSettings);

                    if (!imageResult.result) {
                        paragraphImages[paragraphIndex] = {
                            ...paragraphImages[paragraphIndex],
                            mediaType: 'image',
                            status: 'error',
                            error: imageResult.error || 'Failed to find a Pixabay image',
                        };
                        await updateDoc(messageRef, { paragraphImages });
                        continue;
                    }

                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        mediaType: 'image',
                        imageUrl: imageResult.result.imageUrl,
                        status: 'complete',
                        source: imageResult.result.source,
                        alt: imageResult.result.alt || prompt,
                        width: imageResult.result.width,
                        height: imageResult.result.height,
                        searchQuery,
                        mediaPrompt: searchQuery,
                        mediaPromptType: 'search-query',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Step 2: Generate image using InvokeAI
                const imageResult = await generateImage(prompt, imageGenSettings);

                if (!imageResult.imageBase64) {
                    paragraphImages[paragraphIndex] = {
                        ...paragraphImages[paragraphIndex],
                        status: 'error',
                        error: imageResult.error || 'Failed to generate image',
                    };
                    await updateDoc(messageRef, { paragraphImages });
                    continue;
                }

                // Step 3: Upload image to Firebase Storage
                const imageUrl = await uploadImageToStorage(
                    conversationId!,
                    messageId,
                    paragraphIndex,
                    imageResult.imageBase64
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
                    mediaType: 'image',
                    imageUrl,
                    status: 'complete',
                    mediaPrompt: prompt,
                    mediaPromptType: 'image-prompt',
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
                    promptQueueRef.current = promptQueueRef.current.filter((item) => !item.promptKey.startsWith(promptKeyPrefix));
                    for (const key of queuedPromptKeysRef.current.keys()) {
                        if (key.startsWith(promptKeyPrefix)) {
                            queuedPromptKeysRef.current.delete(key);
                        }
                    }
                }
            }
        }

        isGeneratingRef.current = false;
    }, [conversationId, enqueuePromptGeneration]);

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

                        // Mark before any async segmentation work so repeated snapshots do not
                        // enqueue the same message while the prompt LLM is deciding sections.
                        processingRef.current.add(messageId);

                        // Split message into media segments based on configured granularity
                        const settings = conversationData.imageGenSettings!;
                        const granularity: MediaGranularity = settings.mediaGranularity || 'paragraph';
                        const convLanguage = conversationData.language || 'en';
                        const convOllamaEndpoint = conversationData.ollamaEndpoint || 'http://localhost:11434';
                        const segmentationResult = granularity === 'smart'
                            ? await generateSmartMediaSegments(messageData.content, settings, convOllamaEndpoint)
                            : { segments: splitIntoMediaSegments(messageData.content, granularity, convLanguage) };
                        const { segments } = segmentationResult;

                        if (segments.length === 0) {
                            processingRef.current.delete(messageId);
                            continue;
                        }

                        const initializedSegments = await initializeMediaSegmentsForMessage({
                            messageRef: messageDoc.ref,
                            content: messageData.content,
                            segments,
                            settings,
                            granularity,
                            language: convLanguage,
                            debug: segmentationResult.debug,
                        });

                        // Queue all segments for sequential generation
                        const segmentTexts = initializedSegments.map(s => s.text);
                        for (let i = 0; i < initializedSegments.length; i++) {
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
    // Smart segmentation only reads per-call settings and stable module imports.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, userId, processGenerationQueue, resetGenerationState]);

    async function initializeMediaSegmentsForMessage({
        messageRef,
        content,
        segments,
        settings,
        granularity,
        language,
        debug,
    }: {
        messageRef: DocumentReference;
        content: string;
        segments: MediaSegment[];
        settings: NonNullable<ConversationData['imageGenSettings']>;
        granularity: MediaGranularity;
        language: string;
        debug?: MediaSegmentationDebug;
    }): Promise<MediaSegment[]> {
        const makeParagraphImages = (targetSegments: MediaSegment[]): ParagraphImage[] =>
            targetSegments.map((_, index) => ({
                paragraphIndex: index,
                imageUrl: null,
                mediaType: settings.provider === 'pixabay' ? (settings.pixabayMediaType || 'image') : 'image',
                status: 'pending',
            }));

        const paragraphImages = makeParagraphImages(segments);

        if (granularity !== 'smart') {
            await updateDoc(messageRef, { paragraphImages });
            return segments;
        }

        try {
            await updateDoc(messageRef, {
                paragraphImages,
                mediaSegments: segments,
                ...(debug ? { mediaSegmentationDebug: debug } : {}),
            });
            return segments;
        } catch (error) {
            if (!isPermissionDeniedError(error)) {
                throw error;
            }

            if (debug) {
                try {
                    await updateDoc(messageRef, { paragraphImages, mediaSegments: segments });
                    console.warn(
                        '[InvokeAI ImageGen] Firestore rules blocked mediaSegmentationDebug updates. ' +
                        'Smart media still ran, but deploy firestore.rules to persist segmentation debug details.'
                    );
                    return segments;
                } catch (fallbackError) {
                    if (!isPermissionDeniedError(fallbackError)) {
                        throw fallbackError;
                    }
                }
            }

            console.warn(
                '[InvokeAI ImageGen] Firestore rules blocked mediaSegments updates. ' +
                'Falling back to paragraph media for this message. Deploy firestore.rules to enable AI-directed sections and segmentation debug details.'
            );

            const fallbackSegments = splitIntoMediaSegments(content, 'paragraph', language);
            await updateDoc(messageRef, { paragraphImages: makeParagraphImages(fallbackSegments) });
            return fallbackSegments;
        }
    }

    async function generateSmartMediaSegments(
        content: string,
        imageGenSettings: NonNullable<ConversationData['imageGenSettings']>,
        ollamaEndpoint: string
    ): Promise<SmartMediaSegmentationResult> {
        const fallbackSegments = splitIntoMediaSegments(content, 'paragraph');
        const indexedPrompt = createIndexedMediaSegmentationPrompt(content);

        try {
            const response = await generateImagePrompt(
                indexedPrompt.indexedText,
                imageGenSettings.promptLlm,
                DEFAULT_SMART_MEDIA_SEGMENTATION_PROMPT,
                ollamaEndpoint
            );

            if (!response) {
                const debug = createMediaSegmentationDebug({
                    status: 'empty',
                    rawResponse: response || '',
                    fallbackUsed: 'paragraph',
                    promptLlm: imageGenSettings.promptLlm,
                    segmentCount: fallbackSegments.length,
                });
                logSmartSegmentationDebug(debug);
                console.warn('[InvokeAI ImageGen] Smart media segmentation returned no response. Falling back to paragraph mode.');
                return { segments: fallbackSegments, debug };
            }

            const requestedBreakTokenIds = parseSmartMediaBreakTokenIds(response);
            if (!requestedBreakTokenIds) {
                const debug = createMediaSegmentationDebug({
                    status: 'invalid-json',
                    rawResponse: response,
                    fallbackUsed: 'paragraph',
                    promptLlm: imageGenSettings.promptLlm,
                    segmentCount: fallbackSegments.length,
                    tokenCount: indexedPrompt.tokens.length,
                });
                logSmartSegmentationDebug(debug);
                console.warn('[InvokeAI ImageGen] Smart media segmentation returned invalid breakpoint JSON. Falling back to paragraph mode.');
                return { segments: fallbackSegments, debug };
            }

            const indexedResult = buildIndexedSmartMediaSegments(content, indexedPrompt.tokens, requestedBreakTokenIds);
            if (!indexedResult.segments || indexedResult.segments.length === 0) {
                const debug = createMediaSegmentationDebug({
                    status: 'invalid-indexes',
                    rawResponse: response,
                    mismatch: indexedResult.mismatch,
                    breakOffsets: indexedResult.breakOffsets,
                    breakTokenIds: indexedResult.breakTokenIds,
                    fallbackUsed: 'paragraph',
                    promptLlm: imageGenSettings.promptLlm,
                    segmentCount: fallbackSegments.length,
                    tokenCount: indexedPrompt.tokens.length,
                });
                logSmartSegmentationDebug(debug);
                console.warn('[InvokeAI ImageGen] Smart media segmentation returned invalid breakpoint indexes. Falling back to paragraph mode.');
                return { segments: fallbackSegments, debug };
            }

            const smartSegments = indexedResult.segments;
            const debug = createMediaSegmentationDebug({
                status: 'ok',
                rawResponse: response,
                parsedSections: smartSegments.map(segment => segment.text),
                breakOffsets: indexedResult.breakOffsets,
                breakTokenIds: indexedResult.breakTokenIds,
                fallbackUsed: null,
                promptLlm: imageGenSettings.promptLlm,
                segmentCount: smartSegments.length,
                tokenCount: indexedPrompt.tokens.length,
            });
            logSmartSegmentationDebug(debug);

            return { segments: smartSegments, debug };
        } catch (error) {
            const debug = createMediaSegmentationDebug({
                status: 'error',
                fallbackUsed: 'paragraph',
                error: error instanceof Error ? error.message : String(error),
                promptLlm: imageGenSettings.promptLlm,
                segmentCount: fallbackSegments.length,
            });
            logSmartSegmentationDebug(debug);
            console.warn('[InvokeAI ImageGen] Smart media segmentation failed. Falling back to paragraph mode:', error);
            return { segments: fallbackSegments, debug };
        }
    }

    function createMediaSegmentationDebug({
        status,
        rawResponse,
        parsedSections,
        mismatch,
        breakOffsets,
        breakTokenIds,
        fallbackUsed,
        error,
        promptLlm,
        segmentCount,
        tokenCount,
    }: {
        status: MediaSegmentationDebug['status'];
        rawResponse?: string;
        parsedSections?: string[];
        mismatch?: SmartMediaMismatchDetails;
        breakOffsets?: number[];
        breakTokenIds?: number[];
        fallbackUsed: 'paragraph' | null;
        error?: string;
        promptLlm?: string;
        segmentCount?: number;
        tokenCount?: number;
    }): MediaSegmentationDebug {
        const maxRawResponseLength = 12000;
        const maxSections = 80;
        const maxSectionLength = 2000;
        const safeRawResponse = typeof rawResponse === 'string'
            ? rawResponse.slice(0, maxRawResponseLength)
            : undefined;
        const safeSections = Array.isArray(parsedSections)
            ? parsedSections
                .slice(0, maxSections)
                .map(section => section.slice(0, maxSectionLength))
            : undefined;

        return {
            status,
            ...(typeof safeRawResponse === 'string' ? { rawResponse: safeRawResponse } : {}),
            ...(typeof rawResponse === 'string' && rawResponse.length > maxRawResponseLength ? { rawResponseTruncated: true } : {}),
            ...(safeSections ? { parsedSections: safeSections } : {}),
            ...(Array.isArray(parsedSections) && parsedSections.length > maxSections ? { parsedSectionsTruncated: true } : {}),
            ...(mismatch ? { mismatch } : {}),
            ...(Array.isArray(breakOffsets) ? { breakOffsets: breakOffsets.slice(0, maxSections) } : {}),
            ...(Array.isArray(breakTokenIds) ? { breakTokenIds: breakTokenIds.slice(0, maxSections) } : {}),
            fallbackUsed,
            ...(error ? { error: error.slice(0, 1000) } : {}),
            ...(promptLlm ? { promptLlm } : {}),
            ...(typeof segmentCount === 'number' ? { segmentCount } : {}),
            ...(typeof tokenCount === 'number' ? { tokenCount } : {}),
            createdAt: new Date().toISOString(),
        };
    }

    function logSmartSegmentationDebug(debug: MediaSegmentationDebug) {
        console.info('[InvokeAI ImageGen] Smart media segmentation debug:', debug);
        if (process.env.NODE_ENV === 'development') {
            void fetch('/api/client-debug-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scope: 'smart-media',
                    message: 'segmentation summary',
                    data: {
                        status: debug.status,
                        fallbackUsed: debug.fallbackUsed,
                        segmentCount: debug.segmentCount,
                        breakCount: debug.breakOffsets?.length ?? 0,
                        breakTokenCount: debug.breakTokenIds?.length ?? 0,
                        tokenCount: debug.tokenCount,
                        promptLlm: debug.promptLlm,
                        mismatchReason: debug.mismatch?.reason,
                        invalidBreakTokenIds: debug.mismatch
                            ? debug.mismatch.invalidBreakTokenIds.slice(0, 20)
                            : undefined,
                    },
                }),
            }).catch(() => undefined);
        }
    }

    function parseSmartMediaBreakTokenIds(response: string): unknown[] | null {
        const trimmed = response.trim();
        const withoutFence = trimmed
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
        const jsonStart = withoutFence.indexOf('{');
        const jsonEnd = withoutFence.lastIndexOf('}');
        const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
            ? withoutFence.slice(jsonStart, jsonEnd + 1)
            : withoutFence;

        try {
            const parsed = JSON.parse(jsonText) as unknown;
            const ids = Array.isArray(parsed)
                ? parsed
                : typeof parsed === 'object' && parsed !== null
                    ? readBreakTokenIds(parsed as Record<string, unknown>)
                    : null;

            if (!ids) return null;

            return ids.map((id) => {
                if (typeof id === 'string' && /^-?\d+$/.test(id.trim())) {
                    return Number(id.trim());
                }
                return id;
            });
        } catch {
            return null;
        }
    }

    function readBreakTokenIds(parsed: Record<string, unknown>): unknown[] | null {
        const candidateKeys = [
            'breakAfterTokenIds',
            'breakAfterTokens',
            'break_after_token_ids',
            'breakpoints',
        ];

        for (const key of candidateKeys) {
            const value = parsed[key];
            if (Array.isArray(value)) return value;
        }

        return null;
    }

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

    async function searchPixabayImage(
        query: string,
        imageGenSettings: NonNullable<ConversationData['imageGenSettings']>
    ): Promise<{ result: ImageSearchResult | null; error?: string }> {
        try {
            const normalizedQuery = normalizeImageSearchQuery(query);
            if (!normalizedQuery) {
                return { result: null, error: 'Image search query was empty' };
            }

            const currentUser = auth.currentUser;
            const idToken = currentUser ? await currentUser.getIdToken() : null;
            if (!idToken) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/image-search/pixabay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    query: normalizedQuery,
                    orientation: imageGenSettings.searchOrientation || 'landscape',
                    size: imageGenSettings.searchSize || 'medium',
                    imageType: imageGenSettings.searchImageType || 'photo',
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Pixabay search error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as { result?: ImageSearchResult };
            return { result: data.result || null };
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error searching Pixabay:', error);
            return { result: null, error: error instanceof Error ? error.message : 'Failed to search Pixabay' };
        }
    }

    async function searchPixabayVideo(
        query: string,
        imageGenSettings: NonNullable<ConversationData['imageGenSettings']>
    ): Promise<{ result: VideoSearchResult | null; error?: string }> {
        try {
            const normalizedQuery = normalizeImageSearchQuery(query);
            if (!normalizedQuery) {
                return { result: null, error: 'Video search query was empty' };
            }

            const currentUser = auth.currentUser;
            const idToken = currentUser ? await currentUser.getIdToken() : null;
            if (!idToken) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/video-search/pixabay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    query: normalizedQuery,
                    orientation: imageGenSettings.searchOrientation || 'landscape',
                    size: imageGenSettings.searchSize || 'medium',
                    videoType: imageGenSettings.videoSearchType || 'film',
                    duration: imageGenSettings.videoSearchDuration || 'short',
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Pixabay video search error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as { result?: VideoSearchResult };
            return { result: data.result || null };
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error searching Pixabay video:', error);
            return { result: null, error: error instanceof Error ? error.message : 'Failed to search Pixabay video' };
        }
    }

    async function generateImage(
        prompt: string,
        imageGenSettings: NonNullable<ConversationData['imageGenSettings']>
    ): Promise<{ imageBase64: string | null; error?: string }> {
        try {
            if (!imageGenSettings.invokeaiEndpoint) {
                return { imageBase64: null, error: 'InvokeAI endpoint is missing' };
            }

            const generationPayload = {
                prompt,
                invokeaiEndpoint: imageGenSettings.invokeaiEndpoint,
                model: imageGenSettings.invokeaiModel,
                ...(imageGenSettings.invokeaiLoraKey?.trim()
                    ? {
                        lora_key: imageGenSettings.invokeaiLoraKey.trim(),
                        lora_weight:
                            typeof imageGenSettings.invokeaiLoraWeight === 'number' && Number.isFinite(imageGenSettings.invokeaiLoraWeight)
                                ? imageGenSettings.invokeaiLoraWeight
                                : 0.75,
                    }
                    : {}),
                negative_prompt: imageGenSettings.negativePrompt,
                steps: imageGenSettings.steps,
                guidance_scale: imageGenSettings.guidanceScale,
                width: imageGenSettings.width,
                height: imageGenSettings.height,
                seed: imageGenSettings.seed,
                scheduler: imageGenSettings.scheduler,
                clip_skip: imageGenSettings.clipSkip,
                cfg_rescale_multiplier: imageGenSettings.cfgRescaleMultiplier,
            };

            const enqueueResponse = await fetch('/api/invokeai/enqueue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generationPayload),
            });

            if (!enqueueResponse.ok) {
                throw new Error(await getInvokeAIErrorMessage(enqueueResponse));
            }

            const enqueueResult = await enqueueResponse.json() as {
                batchId?: string;
                queueId?: string;
                endpoint?: string;
            };
            if (!enqueueResult.batchId) {
                throw new Error('InvokeAI did not return a batch ID');
            }

            const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            const maxAttempts = 300;
            const intervalMs = 2000;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const statusResponse = await fetch('/api/invokeai/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        batchId: enqueueResult.batchId,
                        queueId: enqueueResult.queueId,
                        invokeaiEndpoint: enqueueResult.endpoint || imageGenSettings.invokeaiEndpoint,
                    }),
                });

                if (!statusResponse.ok) {
                    throw new Error(await getInvokeAIErrorMessage(statusResponse));
                }

                const statusResult = await statusResponse.json() as {
                    status?: {
                        completed?: number;
                        failed?: number;
                        canceled?: number;
                    };
                    done?: boolean;
                };
                const queueStatus = statusResult.status;

                if ((queueStatus?.failed ?? 0) > 0) {
                    throw new Error('Image generation failed in InvokeAI. Check InvokeAI server logs for details.');
                }
                if ((queueStatus?.canceled ?? 0) > 0) {
                    throw new Error('Image generation was canceled in InvokeAI.');
                }
                if ((queueStatus?.completed ?? 0) > 0 || statusResult.done) {
                    break;
                }

                if (attempt >= maxAttempts - 1) {
                    throw new Error('Image generation timed out while waiting for InvokeAI.');
                }

                await wait(intervalMs);
            }

            const resultResponse = await fetch('/api/invokeai/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invokeaiEndpoint: enqueueResult.endpoint || imageGenSettings.invokeaiEndpoint,
                }),
            });

            if (!resultResponse.ok) {
                throw new Error(await getInvokeAIErrorMessage(resultResponse));
            }

            const result = await resultResponse.json() as { image?: string };
            return { imageBase64: result.image || null };
        } catch (error) {
            console.error('[InvokeAI ImageGen] Error generating image:', error);
            return { imageBase64: null, error: error instanceof Error ? error.message : 'Failed to generate image' };
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
