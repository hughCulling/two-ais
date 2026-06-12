import { describe, expect, it } from 'vitest';

import {
    getPixabaySearchQueryCandidates,
    isDefaultPixabaySearchPrompt,
    LEGACY_DEFAULT_IMAGE_SEARCH_PROMPT,
    normalizeImageSearchQuery,
} from '@/lib/image-media';

describe('normalizeImageSearchQuery', () => {
    it('removes labels, punctuation, and extra whitespace', () => {
        expect(normalizeImageSearchQuery('Search query: "quiet city street, night!"')).toBe('quiet city street night');
    });

    it('keeps queries within Pixabay length limits', () => {
        const query = normalizeImageSearchQuery('a '.repeat(80));
        expect(query.length).toBeLessThanOrEqual(100);
    });
});

describe('getPixabaySearchQueryCandidates', () => {
    it('falls back from specific phrases to shorter stock-search phrases', () => {
        expect(getPixabaySearchQueryCandidates('young diverse team laughing laptop office')).toEqual([
            'young diverse team laughing laptop office',
            'young diverse team laughing',
            'young diverse team',
            'young diverse',
        ]);
    });

    it('does not duplicate already short queries', () => {
        expect(getPixabaySearchQueryCandidates('forest sunrise')).toEqual(['forest sunrise']);
    });
});

describe('isDefaultPixabaySearchPrompt', () => {
    it('recognizes legacy Pixabay defaults so presets can upgrade', () => {
        expect(isDefaultPixabaySearchPrompt(LEGACY_DEFAULT_IMAGE_SEARCH_PROMPT)).toBe(true);
    });
});
