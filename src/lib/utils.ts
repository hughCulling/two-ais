import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Removes emojis from text to prevent them from being read aloud by text-to-speech engines.
 * This regex covers all emoji ranges including:
 * - Basic emojis (😊, 🔥, etc.)
 * - Skin tone modifiers
 * - Zero-width joiners (for complex emojis like 👨‍👩‍👧)
 * - Regional indicators (flag emojis)
 * - Emoticons and pictographic symbols
 */
export function removeEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{200D}\u{FE0F}]/gu, '');
}

/**
 * Additional cleaning for TTS to remove markdown artifacts that remove-markdown might miss.
 * This handles edge cases like:
 * - Standalone asterisks
 * - Underscores used for emphasis
 * - Backticks
 * - Hash symbols
 * - Other markdown punctuation
 * 
 * IMPORTANT: Preserves newlines for paragraph detection in auto-scroll
 */
export function cleanTextForTTS(text: string): string {
  return text
    // Remove standalone asterisks (single or multiple)
    .replace(/\*+/g, '')
    // Remove underscores used for emphasis
    .replace(/_+/g, '')
    // Remove backticks
    .replace(/`+/g, '')
    // Remove hash symbols (headers)
    .replace(/#+\s*/g, '')
    // Remove markdown links that might have slipped through [text](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove reference-style links [text][ref]
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    // Remove HTML tags if any
    .replace(/<[^>]+>/g, '')
    // Clean up multiple spaces/tabs (but preserve newlines for paragraph detection)
    .replace(/[ \t]+/g, ' ')
    // Trim each line but preserve line breaks
    .split('\n').map(line => line.trim()).join('\n');
}

/**
 * Safe markdown removal for iOS 15 compatibility (avoids lookbehind regexes).
 * Replaces the 'remove-markdown' library which may contain incompatible regexes.
 */
export function removeMarkdownSafe(text: string): string {
  if (!text) return '';
  return text
    // Headers
    .replace(/^#+\s+/gm, '')
    // Bold/Italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Links
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Images
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    // Code blocks (remove content of code blocks for TTS?) 
    // Usually for TTS we might want to skip code or read it. 
    // remove-markdown usually keeps the text. Let's keep the text inside inline code, but maybe strip fences.
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks entirely? Or just fences? 
    // Let's remove code blocks entirely for TTS as reading code is annoying.
    // Wait, the original remove-markdown keeps the text?
    // "Fenced codeblocks with backticks ... code.trim()" -> it keeps the code.
    // Let's keep the code for now but remove fences.
    .replace(/```(?:.*)\n([\s\S]*?)```/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Blockquotes
    .replace(/^>\s+/gm, '')
    // Lists
    .replace(/^[\*\-\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Horizontal rules
    .replace(/^-{3,}\s*$/gm, '')
    // HTML tags
    .replace(/<[^>]+>/g, '');
}
