// src/lib/segment-utils.test.ts

import {
    splitIntoMediaSegments,
    getMediaGranularity,
    resolveMediaSegments,
    replacePromptPlaceholders,
    buildMarkedSmartMediaSegments,
    buildIndexedSmartMediaSegments,
    createIndexedMediaSegmentationPrompt,
    SMART_MEDIA_BREAK_MARKER,
    type MediaSegment,
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

    it('returns smart when configured', () => {
        expect(getMediaGranularity({
            imageGenSettings: { enabled: true, mediaGranularity: 'smart' }
        })).toBe('smart');
    });
});

describe('resolveMediaSegments', () => {
    it('uses persisted smart segments when available', () => {
        const persisted: MediaSegment[] = [
            { text: 'A gate opens', segmentIndex: 7, paragraphIndex: 2, sentenceIndex: 0 },
            { text: 'A garden appears', segmentIndex: 8, paragraphIndex: 2, sentenceIndex: 0 },
        ];

        const segments = resolveMediaSegments('A gate opens and a garden appears.', 'smart', 'en', persisted);

        expect(segments).toEqual([
            { text: 'A gate opens', segmentIndex: 0, paragraphIndex: 2, sentenceIndex: 0 },
            { text: 'A garden appears', segmentIndex: 1, paragraphIndex: 2, sentenceIndex: 0 },
        ]);
    });

    it('falls back to paragraph mode for smart without persisted segments', () => {
        const segments = resolveMediaSegments('One.\n\nTwo.', 'smart');

        expect(segments).toHaveLength(2);
        expect(segments[0].text).toBe('One.');
        expect(segments[1].text).toBe('Two.');
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

describe('buildMarkedSmartMediaSegments', () => {
    it('builds exact media segments from inserted break markers', () => {
        const content = 'The camera opens on a city street. A train rushes past.';
        const marked = `The camera opens on a city street.${SMART_MEDIA_BREAK_MARKER} A train rushes past.`;

        const result = buildMarkedSmartMediaSegments(content, marked);

        expect(result.mismatch).toBeUndefined();
        expect(result.breakOffsets).toEqual(['The camera opens on a city street.'.length]);
        expect(result.segments?.map(segment => segment.text)).toEqual([
            'The camera opens on a city street.',
            ' A train rushes past.',
        ]);
    });

    it('allows marker-only whitespace that the model adds around a marker', () => {
        const content = 'First scene.\n\nSecond scene.';
        const marked = `First scene.\n\n${SMART_MEDIA_BREAK_MARKER}\n\nSecond scene.`;

        const result = buildMarkedSmartMediaSegments(content, marked);

        expect(result.mismatch).toBeUndefined();
        expect(result.segments?.map(segment => segment.text)).toEqual([
            'First scene.\n\n',
            'Second scene.',
        ]);
    });

    it('rejects output that rewrites the original text', () => {
        const content = 'A small boat crosses the lake.';
        const marked = `A tiny boat${SMART_MEDIA_BREAK_MARKER} crosses the lake.`;

        const result = buildMarkedSmartMediaSegments(content, marked);

        expect(result.segments).toBeNull();
        expect(result.mismatch?.reason).toBe('marker-text-mismatch');
    });
});

describe('indexed smart media segmentation', () => {
    it('creates indexed text while preserving exact token offsets', () => {
        const content = 'Jean-Luc smiles.\n\nA train arrives.';
        const prompt = createIndexedMediaSegmentationPrompt(content);

        expect(prompt.indexedText).toBe('[1] Jean-Luc [2] smiles.\n\n[3] A [4] train [5] arrives.');
        expect(prompt.tokens.map(token => content.slice(token.startOffset, token.endOffset))).toEqual([
            'Jean-Luc',
            'smiles.',
            'A',
            'train',
            'arrives.',
        ]);
    });

    it('builds segments from valid break token ids without copying LLM text', () => {
        const content = 'The camera opens on a city street. A train rushes past.';
        const { tokens } = createIndexedMediaSegmentationPrompt(content);
        const result = buildIndexedSmartMediaSegments(content, tokens, [7]);

        expect(result.mismatch).toBeUndefined();
        expect(result.breakTokenIds).toEqual([7]);
        expect(result.segments?.map(segment => segment.text)).toEqual([
            'The camera opens on a city street. ',
            'A train rushes past.',
        ]);
    });

    it('allows a single-token first segment', () => {
        const content = 'Boom. Smoke fills the room.';
        const { tokens } = createIndexedMediaSegmentationPrompt(content);
        const result = buildIndexedSmartMediaSegments(content, tokens, [1]);

        expect(result.mismatch).toBeUndefined();
        expect(result.segments?.map(segment => segment.text)).toEqual([
            'Boom. ',
            'Smoke fills the room.',
        ]);
    });

    it('rejects invalid break token ids', () => {
        const content = 'One two three.';
        const { tokens } = createIndexedMediaSegmentationPrompt(content);
        const result = buildIndexedSmartMediaSegments(content, tokens, [2, 99, 'bad']);

        expect(result.segments).toBeNull();
        expect(result.mismatch?.reason).toBe('invalid-break-token-ids');
    });
});
