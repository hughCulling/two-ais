export type ImageMediaProvider = 'invokeai' | 'pixabay';
export type PixabayMediaType = 'image' | 'video';
export type ImageSearchOrientation = 'any' | 'landscape' | 'portrait';
export type ImageSearchSize = 'small' | 'medium' | 'large';
export type ImageSearchType = 'photo' | 'illustration' | 'vector' | 'all';
export type VideoSearchType = 'film' | 'animation' | 'all';
export type VideoSearchDuration = 'short' | 'medium' | 'any';

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

export interface VideoSearchResult {
    videoUrl: string;
    posterUrl?: string;
    sourceUrl: string;
    width?: number;
    height?: number;
    duration?: number;
    sizeBytes?: number;
    alt?: string;
    source: ImageSourceMetadata;
}

export const DEFAULT_IMAGE_GENERATION_PROMPT =
    'Create a prompt to give to the image generation model based on this paragraph: {paragraph}';

export const DEFAULT_IMAGE_SEARCH_PROMPT =
    'Create a concise image search query for this text. Prefer concrete visual nouns, setting, mood, and era. Return only the search query. Text: {text}';

export const DEFAULT_VIDEO_SEARCH_PROMPT =
    'Create a concise stock video search query for this text. Prefer concrete visual nouns, setting, motion, mood, and era. Return only the search query. Text: {text}';

export const DEFAULT_SMART_MEDIA_SEGMENTATION_PROMPT = [
    'You will receive the original text with numbered token IDs inserted before each non-whitespace token, for example: [1] The [2] quiet [3] street.',
    'Choose where synchronized audio and visual media should change. Each resulting section will receive its own image or video.',
    'Return only JSON in this exact shape: {"breakAfterTokenIds":[3,12,27]}.',
    'Each number means: create a media break immediately after that token ID. You may create single-token sections when one word or very short phrase deserves its own media.',
    'Use as many breakpoints as the text calls for, including inside sentences when the visual subject, location, action, object of focus, time, mood, or scene changes.',
    'Do not copy the text. Do not return token words. Do not use Markdown fences, labels, commentary, or explanations.',
    'Return {"breakAfterTokenIds":[]} only if the whole text should use one media item.',
].join(' ');

export const IMAGE_SEARCH_SIZE_LABELS: Record<ImageSearchSize, string> = {
    small: 'Small / fast',
    medium: 'Medium',
    large: 'Large',
};

export const VIDEO_SEARCH_DURATION_LABELS: Record<VideoSearchDuration, string> = {
    short: 'Short, up to 10s',
    medium: 'Medium, up to 30s',
    any: 'Any length',
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

export function getVideoSearchMaxDuration(duration: VideoSearchDuration): number | null {
    if (duration === 'short') return 10;
    if (duration === 'medium') return 30;
    return null;
}
