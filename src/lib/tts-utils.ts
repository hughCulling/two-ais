// src/lib/tts-utils.ts

/**
 * Split text into paragraphs for TTS auto-scroll
 */
export function splitIntoParagraphs(text: string): string[] {
    // Split by ANY newlines (single or double) for fine-grained auto-scroll
    // This creates more frequent scroll points so text doesn't go out of view
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    return paragraphs;
}

/**
 * Split text into TTS-safe chunks
 */
export function splitIntoTTSChunks(text: string, maxLength: number = 4000): string[] {
    if (text.length <= maxLength) {
        return [text];
    }

    const chunks: string[] = [];
    // Split by sentences (periods, exclamation marks, question marks followed by space or end)
    const sentences = text.match(/[^.!?]+[.!?]+[\s]?|[^.!?]+$/g) || [text];
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
        // If adding this sentence would exceed the limit
        if (currentChunk.length + sentence.length > maxLength) {
            // If current chunk has content, save it
            if (currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // If the sentence itself is too long, split it by words
            if (sentence.length > maxLength) {
                const words = sentence.split(/\s+/);
                for (const word of words) {
                    if (currentChunk.length + word.length + 1 > maxLength) {
                        if (currentChunk.length > 0) {
                            chunks.push(currentChunk.trim());
                            currentChunk = '';
                        }
                    }
                    currentChunk += (currentChunk.length > 0 ? ' ' : '') + word;
                }
            } else {
                currentChunk = sentence;
            }
        } else {
            currentChunk += sentence;
        }
    }
    
    // Add any remaining content
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
}

/**
 * Prepare TTS chunks with paragraph mapping for auto-scroll
 */
export function prepareTTSChunksWithParagraphs(text: string, maxChunkLength: number = 4000): {
    chunks: string[];
    paragraphIndices: number[];
} {
    const paragraphs = splitIntoParagraphs(text);
    const chunks: string[] = [];
    const paragraphIndices: number[] = [];
    
    paragraphs.forEach((paragraph, paragraphIndex) => {
        const paragraphChunks = splitIntoTTSChunks(paragraph, maxChunkLength);
        paragraphChunks.forEach(chunk => {
            chunks.push(chunk);
            paragraphIndices.push(paragraphIndex);
        });
    });
    
    return { chunks, paragraphIndices };
}
