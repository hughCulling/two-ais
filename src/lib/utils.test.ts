import { describe, it, expect } from 'vitest';
import { removeEmojis, cleanTextForTTS } from './utils';

describe('removeEmojis', () => {
  it('should remove basic emojis', () => {
    const text = 'Hello 😊 World 🔥';
    const result = removeEmojis(text);
    expect(result).toBe('Hello  World ');
  });

  it('should remove multiple emoji types', () => {
    const text = '👨‍👩‍👧 Family 🌍 Earth 🚀 Rocket';
    const result = removeEmojis(text);
    expect(result).toBe(' Family  Earth  Rocket');
  });

  it('should remove flag emojis', () => {
    const text = 'USA 🇺🇸 UK 🇬🇧';
    const result = removeEmojis(text);
    expect(result).toBe('USA  UK ');
  });

  it('should preserve regular text without emojis', () => {
    const text = 'This is plain text with no emojis.';
    const result = removeEmojis(text);
    expect(result).toBe(text);
  });

  it('should handle empty string', () => {
    const result = removeEmojis('');
    expect(result).toBe('');
  });

  it('should handle text with only emojis', () => {
    const text = '😊🔥🌍🚀';
    const result = removeEmojis(text);
    expect(result).toBe('');
  });

  it('should remove skin tone modifiers', () => {
    const text = '👋🏻 👋🏿 Wave';
    const result = removeEmojis(text);
    expect(result).toBe('  Wave');
  });
});

describe('cleanTextForTTS', () => {
  it('should remove asterisks', () => {
    const text = 'This is *bold* text';
    const result = cleanTextForTTS(text);
    expect(result).toBe('This is bold text');
  });

  it('should remove underscores', () => {
    const text = 'This is _italic_ text';
    const result = cleanTextForTTS(text);
    expect(result).toBe('This is italic text');
  });

  it('should remove backticks', () => {
    const text = 'This is `code` text';
    const result = cleanTextForTTS(text);
    expect(result).toBe('This is code text');
  });

  it('should remove hash symbols', () => {
    const text = '# Header\n## Subheader';
    const result = cleanTextForTTS(text);
    expect(result).toBe('Header\nSubheader');
  });

  it('should remove markdown links', () => {
    const text = 'Check [this link](https://example.com) out';
    const result = cleanTextForTTS(text);
    expect(result).toBe('Check this link out');
  });

  it('should remove reference-style links', () => {
    const text = 'Check [this link][ref] out';
    const result = cleanTextForTTS(text);
    expect(result).toBe('Check this link out');
  });

  it('should remove HTML tags', () => {
    const text = 'This is <strong>bold</strong> text';
    const result = cleanTextForTTS(text);
    expect(result).toBe('This is bold text');
  });

  it('should clean up multiple spaces but preserve newlines', () => {
    const text = 'This  has   multiple    spaces\nAnd a newline';
    const result = cleanTextForTTS(text);
    expect(result).toBe('This has multiple spaces\nAnd a newline');
  });

  it('should trim each line but preserve line breaks', () => {
    const text = '  Line 1  \n  Line 2  \n  Line 3  ';
    const result = cleanTextForTTS(text);
    expect(result).toBe('Line 1\nLine 2\nLine 3');
  });

  it('should handle complex markdown with multiple special characters', () => {
    const text = '**Bold** _italic_ `code` # Header [link](url)';
    const result = cleanTextForTTS(text);
    expect(result).toBe('Bold italic code Header link');
  });

  it('should preserve newlines for paragraph detection', () => {
    const text = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
    const result = cleanTextForTTS(text);
    expect(result).toBe('Paragraph 1\n\nParagraph 2\n\nParagraph 3');
  });

  it('should handle empty string', () => {
    const result = cleanTextForTTS('');
    expect(result).toBe('');
  });
});
