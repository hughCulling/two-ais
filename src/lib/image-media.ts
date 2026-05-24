export type ImageMediaProvider = 'invokeai' | 'pixabay';
export type ImageSearchOrientation = 'any' | 'landscape' | 'portrait';
export type ImageSearchSize = 'small' | 'medium' | 'large';
export type ImageSearchType = 'photo' | 'illustration' | 'vector' | 'all';

export interface ImageSourceMetadata {
    provider: 'pixabay';
    providerName: string;
    sourceUrl: string;
    authorName?: string;
    authorUrl?: string;
    licenseName?: string;
    licenseUrl?: string;
}

export interface ImageSearchResult {
    imageUrl: string;
    thumbnailUrl?: string;
    sourceUrl: string;
    width?: number;
    height?: number;
    alt?: string;
    source: ImageSourceMetadata;
}

export const DEFAULT_IMAGE_GENERATION_PROMPT =
    'Create a prompt to give to the image generation model based on this paragraph: {paragraph}';

export const DEFAULT_IMAGE_SEARCH_PROMPT =
    'Create a concise image search query for this text. Prefer concrete visual nouns, setting, mood, and era. Return only the search query. Text: {text}';

export const IMAGE_SEARCH_SIZE_LABELS: Record<ImageSearchSize, string> = {
    small: 'Small / fast',
    medium: 'Medium',
    large: 'Large',
};

export function normalizeImageSearchQuery(query: string): string {
    const normalized = query
        .trim()
        .split('\n')[0]
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
        .replace(/^(image\s+)?search\s+(query|term)\s*:\s*/i, '')
        .trim();

    if (normalized.length <= 100) return normalized;

    const truncated = normalized.slice(0, 100);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated).trim();
}

export function getImageSearchMinDimensions(
    size: ImageSearchSize,
    orientation: ImageSearchOrientation
): { minWidth: number; minHeight: number } {
    const presets: Record<ImageSearchSize, { shortEdge: number; longEdge: number }> = {
        small: { shortEdge: 480, longEdge: 640 },
        medium: { shortEdge: 720, longEdge: 1280 },
        large: { shortEdge: 1080, longEdge: 1920 },
    };

    const preset = presets[size] || presets.medium;
    if (orientation === 'portrait') {
        return { minWidth: preset.shortEdge, minHeight: preset.longEdge };
    }
    if (orientation === 'landscape') {
        return { minWidth: preset.longEdge, minHeight: preset.shortEdge };
    }
    return { minWidth: preset.shortEdge, minHeight: preset.shortEdge };
}
