// src/lib/segment-utils.ts
// Shared media segmentation utility.
// All systems (image gen, TTS gen, TTS playback, rendering, gallery)
// consume the same ordered segment list produced here.

import { splitIntoParagraphs } from './tts-utils';

// ── Public types ────────────────────────────────────────────────────────

export type MediaGranularity = 'paragraph' | 'sentence';

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
 * @param granularity  `'paragraph'` (one segment per paragraph, current
 *                     behaviour) or `'sentence'` (one segment per sentence,
 *                     with atomic blocks kept whole).
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
    const sentenceParagraphs = granularity === 'sentence'
        ? mergeFencedCodeBlocks(paragraphs)
        : paragraphs;

    for (let pIdx = 0; pIdx < sentenceParagraphs.length; pIdx++) {
        const paragraph = sentenceParagraphs[pIdx];

        if (granularity === 'paragraph' || isAtomicParagraph(paragraph)) {
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
