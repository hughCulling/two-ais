// src/lib/segment-utils.test.ts

import {
    splitIntoMediaSegments,
    getMediaGranularity,
    replacePromptPlaceholders,
    type MediaSegment,
    type MediaGranularity,
} from './segment-utils';

describe('splitIntoMediaSegments', () => {
    // ── Paragraph mode ─────────────────────────────────────────────

    describe('paragraph mode', () => {
        it('splits by newlines identically to splitIntoParagraphs', () => {
            const content = 'Hello world.\n\nSecond paragraph.\n\nThird paragraph.';
            const segments = splitIntoMediaSegments(content, 'paragraph');

            expect(segments).toHaveLength(3);
            expect(segments[0].text).toBe('Hello world.');
            expect(segments[1].text).toBe('Second paragraph.');
            expect(segments[2].text).toBe('Third paragraph.');

            // Each segment is its own paragraph
            segments.forEach((seg, i) => {
                expect(seg.segmentIndex).toBe(i);
                expect(seg.paragraphIndex).toBe(i);
                expect(seg.sentenceIndex).toBe(0);
            });
        });

        it('filters out empty paragraphs', () => {
            const content = 'One.\n\n\n\nTwo.';
            const segments = splitIntoMediaSegments(content, 'paragraph');
            expect(segments).toHaveLength(2);
        });

        it('returns empty array for empty content', () => {
            expect(splitIntoMediaSegments('', 'paragraph')).toEqual([]);
        });

        it('handles single paragraph content', () => {
            const segments = splitIntoMediaSegments('Just one paragraph.', 'paragraph');
            expect(segments).toHaveLength(1);
            expect(segments[0].segmentIndex).toBe(0);
        });
    });

    // ── Sentence mode ──────────────────────────────────────────────

    describe('sentence mode', () => {
        it('splits multi-sentence paragraphs into separate segments', () => {
            const content = 'First sentence. Second sentence. Third sentence.';
            const segments = splitIntoMediaSegments(content, 'sentence');

            expect(segments.length).toBeGreaterThanOrEqual(3);
            // All should share paragraphIndex 0
            segments.forEach(seg => {
                expect(seg.paragraphIndex).toBe(0);
            });

            // segmentIndex should be contiguous
            segments.forEach((seg, i) => {
                expect(seg.segmentIndex).toBe(i);
            });
        });

        it('handles multi-paragraph content with sentence splitting', () => {
            const content = 'Para one, sentence A. Sentence B.\n\nPara two, sentence C. Sentence D.';
            const segments = splitIntoMediaSegments(content, 'sentence');

            // Should have at least 4 segments (2 sentences × 2 paragraphs)
            expect(segments.length).toBeGreaterThanOrEqual(4);

            // segmentIndex should be contiguous across paragraph boundaries
            segments.forEach((seg, i) => {
                expect(seg.segmentIndex).toBe(i);
            });

            // Verify paragraph indices
            const paraIndices = segments.map(s => s.paragraphIndex);
            expect(paraIndices.filter(p => p === 0).length).toBeGreaterThanOrEqual(2);
            expect(paraIndices.filter(p => p === 1).length).toBeGreaterThanOrEqual(2);
        });

        it('keeps code blocks atomic', () => {
            const content = '```\nconst x = 1;\nconst y = 2;\n```';
            const segments = splitIntoMediaSegments(content, 'sentence');

            // Code block should be a single segment
            expect(segments).toHaveLength(1);
            expect(segments[0].sentenceIndex).toBe(0);
        });

        it('keeps list items atomic', () => {
            const content = '- First item. Has two sentences.\n- Second item. Also two sentences.';
            const segments = splitIntoMediaSegments(content, 'sentence');

            // Each list item should be atomic (not split by sentence)
            expect(segments).toHaveLength(2);
        });

        it('keeps headings atomic', () => {
            const content = '## My Heading. Is. Great.\n\nSome body text. Two sentences here.';
            const segments = splitIntoMediaSegments(content, 'sentence');

            // Heading = 1 segment, body = 2+ segments
            expect(segments[0].text).toContain('My Heading');
            expect(segments[0].sentenceIndex).toBe(0);
        });

        it('keeps block-quotes atomic', () => {
            const content = '> A quote. With multiple sentences. And more.';
            const segments = splitIntoMediaSegments(content, 'sentence');
            expect(segments).toHaveLength(1);
        });

        it('keeps very short paragraphs atomic', () => {
            const content = 'OK.\n\nA longer paragraph with sentences. It has two sentences at least.';
            const segments = splitIntoMediaSegments(content, 'sentence');

            // "OK." is short → atomic
            expect(segments[0].text).toBe('OK.');
            expect(segments[0].sentenceIndex).toBe(0);
        });

        it('returns empty array for empty content', () => {
            expect(splitIntoMediaSegments('', 'sentence')).toEqual([]);
        });

        it('handles single-sentence paragraph without splitting', () => {
            const content = 'This is just one sentence with enough characters to pass the length check and not be atomic.';
            const segments = splitIntoMediaSegments(content, 'sentence');
            expect(segments).toHaveLength(1);
        });

        it('preserves Markdown formatting in segment text', () => {
            const content = 'This **bold sentence** is first. This *italic sentence* is second.';
            const segments = splitIntoMediaSegments(content, 'sentence');

            if (segments.length >= 2) {
                expect(segments[0].text).toContain('**bold sentence**');
                expect(segments[1].text).toContain('*italic sentence*');
            }
        });
    });
});

describe('getMediaGranularity', () => {
    it('returns paragraph for null data', () => {
        expect(getMediaGranularity(null)).toBe('paragraph');
    });

    it('returns paragraph for undefined data', () => {
        expect(getMediaGranularity(undefined)).toBe('paragraph');
    });

    it('returns paragraph when imageGen is disabled', () => {
        expect(getMediaGranularity({
            imageGenSettings: { enabled: false, mediaGranularity: 'sentence' }
        })).toBe('paragraph');
    });

    it('returns paragraph when mediaGranularity is not set', () => {
        expect(getMediaGranularity({
            imageGenSettings: { enabled: true }
        })).toBe('paragraph');
    });

    it('returns sentence when configured', () => {
        expect(getMediaGranularity({
            imageGenSettings: { enabled: true, mediaGranularity: 'sentence' }
        })).toBe('sentence');
    });
});

describe('replacePromptPlaceholders', () => {
    it('replaces {paragraph} placeholder', () => {
        const result = replacePromptPlaceholders(
            'Describe this: {paragraph}',
            'The sunset was beautiful.'
        );
        expect(result).toBe('Describe this: The sunset was beautiful.');
    });

    it('replaces {text} placeholder', () => {
        const result = replacePromptPlaceholders(
            'Describe this: {text}',
            'The sunset was beautiful.'
        );
        expect(result).toBe('Describe this: The sunset was beautiful.');
    });

    it('replaces both placeholders', () => {
        const result = replacePromptPlaceholders(
            '{text} -- also: {paragraph}',
            'Hello'
        );
        expect(result).toBe('Hello -- also: Hello');
    });

    it('handles templates with no placeholders', () => {
        expect(replacePromptPlaceholders('No placeholders here', 'test')).toBe('No placeholders here');
    });
});
