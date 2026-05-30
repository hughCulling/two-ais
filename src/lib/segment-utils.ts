// src/lib/segment-utils.ts
// Shared media segmentation utility.
// All systems (image gen, TTS gen, TTS playback, rendering, gallery)
// consume the same ordered segment list produced here.

import { splitIntoParagraphs } from './tts-utils';

// ── Public types ────────────────────────────────────────────────────────

export type MediaGranularity = 'paragraph' | 'sentence' | 'smart';

export const SMART_MEDIA_BREAK_MARKER = '<<<MEDIA_BREAK>>>';

export interface MediaSegment {
    /** Raw text of this segment (may contain Markdown). */
    text: string;
    /** Flat index across the entire message (0, 1, 2, …). */
    segmentIndex: number;
    /** Which original paragraph (newline-split block) this segment belongs to. */
    paragraphIndex: number;
    /** Sentence index within the paragraph. Always 0 in paragraph mode. */
    sentenceIndex: number;
}

export interface MarkedMediaSegmentationMismatch {
    reason: 'marker-text-mismatch';
    responseIndex: number;
    sourceIndex: number;
    responseContext: string;
    sourceContext: string;
}

export interface MarkedMediaSegmentationResult {
    segments: MediaSegment[] | null;
    breakOffsets: number[];
    mismatch?: MarkedMediaSegmentationMismatch;
}

export interface IndexedMediaToken {
    id: number;
    text: string;
    startOffset: number;
    endOffset: number;
}

export interface IndexedMediaSegmentationMismatch {
    reason: 'invalid-break-token-ids';
    invalidBreakTokenIds: Array<string | number | boolean | null>;
    tokenCount: number;
}

export interface IndexedMediaSegmentationPrompt {
    tokens: IndexedMediaToken[];
    indexedText: string;
}

export interface IndexedMediaSegmentationResult {
    segments: MediaSegment[] | null;
    breakOffsets: number[];
    breakTokenIds: number[];
    mismatch?: IndexedMediaSegmentationMismatch;
}

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Returns true when a paragraph should be treated as an atomic block
 * that must not be sentence-split (code fences, list items, headings,
 * or very short text unlikely to contain multiple sentences).
 */
function isAtomicParagraph(paragraph: string): boolean {
    const trimmed = paragraph.trimStart();

    // Fenced code block (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(trimmed)) return true;

    // Indented code block (4+ spaces or tab)
    if (/^( {4,}|\t)/.test(paragraph)) return true;

    // Markdown heading
    if (/^#{1,6}\s/.test(trimmed)) return true;

    // Unordered list item
    if (/^[-*+]\s/.test(trimmed)) return true;

    // Ordered list item
    if (/^\d+\.\s/.test(trimmed)) return true;

    // Block-quote
    if (/^>\s/.test(trimmed)) return true;

    // Very short — unlikely to contain multiple sentences
    if (trimmed.length < 20) return true;

    return false;
}

/**
 * `splitIntoParagraphs()` in `tts-utils` splits on any newline (`/\n+/`).
 * That means fenced code blocks get broken into multiple "paragraphs"
 * (opening fence, each inner line, closing fence).
 *
 * For sentence-mode segmentation we need fenced code blocks to stay whole.
 * This helper merges consecutive paragraphs that belong to a single fenced
 * code block back into one unit so `isAtomicParagraph()` can work.
 */
function mergeFencedCodeBlocks(paragraphs: string[]): string[] {
    const merged: string[] = [];
    let i = 0;

    while (i < paragraphs.length) {
        const current = paragraphs[i];
        const trimmed = current.trimStart();
        const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);

        if (!fenceMatch) {
            merged.push(current);
            i++;
            continue;
        }

        const openingFence = fenceMatch[1];
        const fenceChar = openingFence[0];
        const fenceLen = openingFence.length;

        // Merge until we find a closing fence with the same or longer length.
        let block = current;
        i++;
        while (i < paragraphs.length) {
            const next = paragraphs[i];
            const nextTrim = next.trimStart();
            const closeRegex = new RegExp('^' + fenceChar + '{' + fenceLen + ',}');

            if (closeRegex.test(nextTrim)) {
                block += '\n' + next;
                i++;
                break;
            }

            block += '\n' + next;
            i++;
        }

        merged.push(block);
    }

    return merged;
}

/**
 * Split a plain-text paragraph into sentence boundaries using
 * `Intl.Segmenter`. Falls back to a simple regex when the API is
 * unavailable (e.g. older Node versions in tests).
 */
function splitSentences(text: string, language: string): string[] {
    // Guard: if text is effectively empty, return as-is.
    if (!text.trim()) return [text];

    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
        try {
            const segmenter = new Intl.Segmenter(language, { granularity: 'sentence' });
            const segments = Array.from(segmenter.segment(text), s => s.segment);
            // Filter trailing whitespace-only segments
            return segments.filter(s => s.trim().length > 0);
        } catch {
            // Language not supported by Intl.Segmenter — fall through to regex
        }
    }

    // Regex fallback: split on sentence-ending punctuation followed by
    // whitespace or end-of-string, being careful with common abbreviations.
    const sentences = text.match(/[^.!?]*[.!?]+[\s]?|[^.!?]+$/g);
    if (!sentences) return [text];
    return sentences.filter(s => s.trim().length > 0);
}

/**
 * Map sentence boundaries detected on stripped plain text back onto
 * the original Markdown source so that formatting is preserved.
 *
 * Strategy: for each sentence in the plain-text version we find the
 * next occurrence of its leading word(s) in the remaining Markdown
 * and slice up to the end of that sentence.  This is a best-effort
 * heuristic — for the vast majority of natural-language paragraphs
 * the sentences align 1-to-1 because Markdown emphasis / links don't
 * change sentence boundaries.
 */
function mapSentencesToMarkdown(
    markdownParagraph: string,
    plainTextSentences: string[]
): string[] {
    // Fast path: single sentence ⇒ return the whole paragraph.
    if (plainTextSentences.length <= 1) return [markdownParagraph];

    const mdSegments: string[] = [];
    let remaining = markdownParagraph;

    for (let i = 0; i < plainTextSentences.length; i++) {
        const isLast = i === plainTextSentences.length - 1;

        if (isLast) {
            // Last sentence gets whatever is left.
            mdSegments.push(remaining);
            break;
        }

        // Use the first few non-whitespace chars of the *next* sentence
        // to locate where the current sentence ends in the Markdown.
        const nextSentence = plainTextSentences[i + 1];
        const nextLeadChars = nextSentence.trim().substring(0, 12);

        if (nextLeadChars.length === 0) {
            mdSegments.push(remaining);
            break;
        }

        // Find the next sentence's start in the remaining Markdown.
        const searchIdx = remaining.indexOf(nextLeadChars);

        if (searchIdx > 0) {
            mdSegments.push(remaining.substring(0, searchIdx).trimEnd());
            remaining = remaining.substring(searchIdx);
        } else {
            // Couldn't map — give the rest to this segment.
            mdSegments.push(remaining);
            remaining = '';
            break;
        }
    }

    return mdSegments.filter(s => s.trim().length > 0);
}

/**
 * Strip Markdown formatting to get plain text for sentence segmentation.
 * Lightweight version — only needs to remove syntax that could interfere
 * with sentence boundary detection.
 */
function stripMarkdownForSegmentation(md: string): string {
    let text = md;
    // Remove inline code
    text = text.replace(/`[^`]+`/g, match => match.replace(/`/g, ''));
    // Remove bold/italic markers
    text = text.replace(/\*{1,3}|_{1,3}/g, '');
    // Remove links but keep text: [text](url) → text
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Remove images: ![alt](url) → alt
    text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
    return text;
}

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Split message content into an ordered list of media segments.
 *
 * @param content  The full message content (may contain Markdown).
 * @param granularity  `'paragraph'` (one segment per paragraph), `'sentence'`
 *                     (one segment per sentence, with atomic blocks kept whole),
 *                     or `'smart'` as a synchronous paragraph fallback when
 *                     no persisted AI-directed segments are available yet.
 * @param language  BCP-47 language tag for `Intl.Segmenter` (default `'en'`).
 */
export function splitIntoMediaSegments(
    content: string,
    granularity: MediaGranularity,
    language: string = 'en'
): MediaSegment[] {
    const paragraphs = splitIntoParagraphs(content);
    const segments: MediaSegment[] = [];
    let segmentIndex = 0;

    // Preserve fenced code blocks as atomic units for sentence mode.
    const effectiveGranularity = granularity === 'smart' ? 'paragraph' : granularity;

    const sentenceParagraphs = effectiveGranularity === 'sentence'
        ? mergeFencedCodeBlocks(paragraphs)
        : paragraphs;

    for (let pIdx = 0; pIdx < sentenceParagraphs.length; pIdx++) {
        const paragraph = sentenceParagraphs[pIdx];

        if (effectiveGranularity === 'paragraph' || isAtomicParagraph(paragraph)) {
            // One segment per paragraph (or atomic block in sentence mode).
            segments.push({
                text: paragraph,
                segmentIndex,
                paragraphIndex: pIdx,
                sentenceIndex: 0,
            });
            segmentIndex++;
        } else {
            // Sentence mode on a non-atomic paragraph.
            const plainText = stripMarkdownForSegmentation(paragraph);
            const plainSentences = splitSentences(plainText, language);
            const mdSentences = mapSentencesToMarkdown(paragraph, plainSentences);

            for (let sIdx = 0; sIdx < mdSentences.length; sIdx++) {
                segments.push({
                    text: mdSentences[sIdx],
                    segmentIndex,
                    paragraphIndex: pIdx,
                    sentenceIndex: sIdx,
                });
                segmentIndex++;
            }
        }
    }

    return segments;
}

export function buildMarkedSmartMediaSegments(
    content: string,
    markedContent: string,
    marker = SMART_MEDIA_BREAK_MARKER
): MarkedMediaSegmentationResult {
    const breakOffsets: number[] = [];
    let responseIndex = 0;
    let sourceIndex = 0;
    let justSawMarker = false;

    while (responseIndex < markedContent.length) {
        if (markedContent.startsWith(marker, responseIndex)) {
            breakOffsets.push(sourceIndex);
            responseIndex += marker.length;
            justSawMarker = true;
            continue;
        }

        const responseChar = markedContent[responseIndex];
        const sourceChar = content[sourceIndex];

        if (responseChar === sourceChar) {
            responseIndex++;
            sourceIndex++;
            justSawMarker = false;
            continue;
        }

        if (/\s/.test(responseChar || '')) {
            const nextNonWhitespace = findNextNonWhitespaceIndex(markedContent, responseIndex);
            const whitespaceBeforeMarker = markedContent.startsWith(marker, nextNonWhitespace);
            const whitespaceAfterMarker = justSawMarker;

            if (whitespaceBeforeMarker || whitespaceAfterMarker) {
                responseIndex++;
                continue;
            }
        }

        return {
            segments: null,
            breakOffsets,
            mismatch: {
                reason: 'marker-text-mismatch',
                responseIndex,
                sourceIndex,
                responseContext: makeSegmentationContext(markedContent, responseIndex),
                sourceContext: makeSegmentationContext(content, sourceIndex),
            },
        };
    }

    if (sourceIndex !== content.length) {
        return {
            segments: null,
            breakOffsets,
            mismatch: {
                reason: 'marker-text-mismatch',
                responseIndex,
                sourceIndex,
                responseContext: makeSegmentationContext(markedContent, responseIndex),
                sourceContext: makeSegmentationContext(content, sourceIndex),
            },
        };
    }

    const uniqueBreakOffsets = Array.from(new Set(breakOffsets))
        .filter(offset => offset > 0 && offset < content.length)
        .sort((a, b) => a - b);

    const segments: MediaSegment[] = [];
    let segmentStart = 0;

    for (const breakOffset of uniqueBreakOffsets) {
        const text = content.slice(segmentStart, breakOffset);
        if (text.trim()) {
            segments.push({
                text,
                segmentIndex: segments.length,
                paragraphIndex: getParagraphIndexForOffset(content, segmentStart),
                sentenceIndex: 0,
            });
        }
        segmentStart = breakOffset;
    }

    const finalText = content.slice(segmentStart);
    if (finalText.trim()) {
        segments.push({
            text: finalText,
            segmentIndex: segments.length,
            paragraphIndex: getParagraphIndexForOffset(content, segmentStart),
            sentenceIndex: 0,
        });
    }

    return {
        segments: normalizeMediaSegments(segments),
        breakOffsets: uniqueBreakOffsets,
    };
}

export function createIndexedMediaSegmentationPrompt(content: string): IndexedMediaSegmentationPrompt {
    const tokens = tokenizeIndexedMediaText(content);
    let indexedText = '';
    let cursor = 0;

    for (const token of tokens) {
        indexedText += content.slice(cursor, token.startOffset);
        indexedText += `[${token.id}] ${token.text}`;
        cursor = token.endOffset;
    }

    indexedText += content.slice(cursor);

    return { tokens, indexedText };
}

export function buildIndexedSmartMediaSegments(
    content: string,
    tokens: IndexedMediaToken[],
    requestedBreakTokenIds: unknown[]
): IndexedMediaSegmentationResult {
    if (tokens.length === 0) {
        return { segments: [], breakOffsets: [], breakTokenIds: [] };
    }

    const invalidBreakTokenIds = requestedBreakTokenIds.filter((id) => {
        return typeof id !== 'number' || !Number.isInteger(id) || id < 1 || id > tokens.length;
    });

    if (invalidBreakTokenIds.length > 0) {
        return {
            segments: null,
            breakOffsets: [],
            breakTokenIds: [],
            mismatch: {
                reason: 'invalid-break-token-ids',
                invalidBreakTokenIds: invalidBreakTokenIds.map(id => sanitizeInvalidBreakTokenId(id)),
                tokenCount: tokens.length,
            },
        };
    }

    const breakTokenIds = Array.from(new Set(requestedBreakTokenIds as number[]))
        .filter(id => id < tokens.length)
        .sort((a, b) => a - b);
    const breakOffsets = breakTokenIds.map(id => getBreakOffsetAfterToken(tokens, id));
    const segments: MediaSegment[] = [];
    let segmentStart = 0;

    for (const breakOffset of breakOffsets) {
        const text = content.slice(segmentStart, breakOffset);
        if (text.trim()) {
            segments.push({
                text,
                segmentIndex: segments.length,
                paragraphIndex: getParagraphIndexForOffset(content, segmentStart),
                sentenceIndex: 0,
            });
        }
        segmentStart = breakOffset;
    }

    const finalText = content.slice(segmentStart);
    if (finalText.trim()) {
        segments.push({
            text: finalText,
            segmentIndex: segments.length,
            paragraphIndex: getParagraphIndexForOffset(content, segmentStart),
            sentenceIndex: 0,
        });
    }

    return {
        segments: normalizeMediaSegments(segments),
        breakOffsets,
        breakTokenIds,
    };
}

function tokenizeIndexedMediaText(content: string): IndexedMediaToken[] {
    const tokens: IndexedMediaToken[] = [];
    const tokenRegex = /\S+/gu;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(content)) !== null) {
        tokens.push({
            id: tokens.length + 1,
            text: match[0],
            startOffset: match.index,
            endOffset: match.index + match[0].length,
        });
    }

    return tokens;
}

function sanitizeInvalidBreakTokenId(id: unknown): string | number | boolean | null {
    if (typeof id === 'string' || typeof id === 'number' || typeof id === 'boolean' || id === null) {
        return id;
    }

    return String(id);
}

function getBreakOffsetAfterToken(tokens: IndexedMediaToken[], tokenId: number): number {
    const currentToken = tokens[tokenId - 1];
    const nextToken = tokens[tokenId];
    return nextToken ? nextToken.startOffset : currentToken.endOffset;
}

function findNextNonWhitespaceIndex(text: string, start: number): number {
    let index = start;
    while (index < text.length && /\s/.test(text[index])) {
        index++;
    }
    return index;
}

function makeSegmentationContext(text: string, index: number): string {
    const radius = 160;
    const start = Math.max(0, index - radius);
    const end = Math.min(text.length, index + radius);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';
    return `${prefix}${text.slice(start, end)}${suffix}`;
}

function getParagraphIndexForOffset(content: string, offset: number): number {
    const before = content.slice(0, Math.max(0, offset));
    return before.split(/\n+/).length - 1;
}

export function normalizeMediaSegments(segments: MediaSegment[]): MediaSegment[] {
    return segments
        .map((segment, index) => ({
            text: segment.text,
            segmentIndex: index,
            paragraphIndex: typeof segment.paragraphIndex === 'number' ? segment.paragraphIndex : index,
            sentenceIndex: typeof segment.sentenceIndex === 'number' ? segment.sentenceIndex : 0,
        }))
        .filter(segment => segment.text.trim().length > 0);
}

export function resolveMediaSegments(
    content: string,
    granularity: MediaGranularity,
    language: string = 'en',
    persistedSegments?: MediaSegment[] | null
): MediaSegment[] {
    if (granularity === 'smart' && Array.isArray(persistedSegments) && persistedSegments.length > 0) {
        return normalizeMediaSegments(persistedSegments);
    }

    return splitIntoMediaSegments(content, granularity, language);
}

/**
 * Safely read `mediaGranularity` from conversation / image-gen settings,
 * defaulting to `'paragraph'` for backward compatibility.
 */
export function getMediaGranularity(
    conversationData?: {
        imageGenSettings?: {
            enabled?: boolean;
            mediaGranularity?: MediaGranularity;
        };
    } | null
): MediaGranularity {
    if (!conversationData?.imageGenSettings?.enabled) return 'paragraph';
    return conversationData.imageGenSettings.mediaGranularity || 'paragraph';
}

/**
 * Replace prompt-template placeholders.
 * Supports both `{paragraph}` (legacy) and `{text}` (new).
 */
export function replacePromptPlaceholders(
    template: string,
    segmentText: string
): string {
    return template
        .replace(/\{paragraph\}/g, segmentText)
        .replace(/\{text\}/g, segmentText);
}
