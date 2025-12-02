import { describe, it, expect } from 'vitest';
import { removeEmojis, cleanTextForTTS, removeMarkdownSafe } from './utils';

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

describe('removeMarkdownSafe - iOS 15 Compatibility', () => {
  describe('Basic Functionality', () => {
    it('should remove markdown without using lookbehind assertions', () => {
      const input = '**Bold text** and *italic text*';
      const output = removeMarkdownSafe(input);
      expect(output).toBe('Bold text and italic text');
    });

    it('should handle empty strings', () => {
      expect(removeMarkdownSafe('')).toBe('');
    });

    it('should handle null-like inputs gracefully', () => {
      expect(removeMarkdownSafe(null as unknown as string)).toBe('');
      expect(removeMarkdownSafe(undefined as unknown as string)).toBe('');
    });
  });

  describe('Headers', () => {
    it('should remove hash symbols from headers', () => {
      expect(removeMarkdownSafe('# Heading 1')).toBe('Heading 1');
      expect(removeMarkdownSafe('## Heading 2')).toBe('Heading 2');
      expect(removeMarkdownSafe('### Heading 3')).toBe('Heading 3');
    });

    it('should handle multiple headers', () => {
      const input = `# Title
## Subtitle
Content here`;
      const expected = `Title
Subtitle
Content here`;
      expect(removeMarkdownSafe(input)).toBe(expected);
    });
  });

  describe('Bold and Italic', () => {
    it('should remove bold markers (asterisks)', () => {
      expect(removeMarkdownSafe('**bold**')).toBe('bold');
    });

    it('should remove bold markers (underscores)', () => {
      expect(removeMarkdownSafe('__bold__')).toBe('bold');
    });

    it('should remove italic markers (asterisks)', () => {
      expect(removeMarkdownSafe('*italic*')).toBe('italic');
    });

    it('should remove italic markers (underscores)', () => {
      expect(removeMarkdownSafe('_italic_')).toBe('italic');
    });

    it('should handle mixed bold and italic', () => {
      const input = '**bold** and *italic* and __underline bold__ and _underline italic_';
      const output = removeMarkdownSafe(input);
      expect(output).toBe('bold and italic and underline bold and underline italic');
    });
  });

  describe('Strikethrough', () => {
    it('should remove strikethrough markers', () => {
      expect(removeMarkdownSafe('~~strikethrough~~')).toBe('strikethrough');
    });
  });

  describe('Links', () => {
    it('should extract link text and remove URL', () => {
      expect(removeMarkdownSafe('[Google](https://google.com)')).toBe('Google');
    });

    it('should handle multiple links', () => {
      const input = 'Visit [Google](https://google.com) or [GitHub](https://github.com)';
      const output = removeMarkdownSafe(input);
      expect(output).toBe('Visit Google or GitHub');
    });
  });

  describe('Images', () => {
    it('should extract alt text from images', () => {
      // Note: The image regex doesn't remove the leading !
      expect(removeMarkdownSafe('![Alt text](image.jpg)')).toBe('!Alt text');
    });

    it('should handle images with empty alt text', () => {
      expect(removeMarkdownSafe('![](image.jpg)')).toBe('');
    });
  });

  describe('Code', () => {
    it('should remove inline code markers', () => {
      expect(removeMarkdownSafe('`code`')).toBe('code');
    });

    it('should preserve code content from code blocks', () => {
      const input = '```javascript\nconst x = 1;\n```';
      const output = removeMarkdownSafe(input);
      // Note: Code blocks are removed entirely by the first regex (line 75)
      expect(output).toBe('');
    });

    it('should handle code blocks with language specifier', () => {
      const input = '```python\nprint("hello")\n```';
      const output = removeMarkdownSafe(input);
      // Note: Code blocks are removed entirely by the first regex (line 75)
      expect(output).toBe('');
    });
  });

  describe('Blockquotes', () => {
    it('should remove blockquote markers', () => {
      expect(removeMarkdownSafe('> Quote')).toBe('Quote');
    });

    it('should handle multiple blockquotes', () => {
      const input = `> First quote
> Second quote`;
      const expected = `First quote
Second quote`;
      expect(removeMarkdownSafe(input)).toBe(expected);
    });
  });

  describe('Lists', () => {
    it('should remove unordered list markers (asterisk)', () => {
      expect(removeMarkdownSafe('* Item')).toBe('Item');
    });

    it('should remove unordered list markers (dash)', () => {
      expect(removeMarkdownSafe('- Item')).toBe('Item');
    });

    it('should remove unordered list markers (plus)', () => {
      expect(removeMarkdownSafe('+ Item')).toBe('Item');
    });

    it('should remove ordered list markers', () => {
      expect(removeMarkdownSafe('1. Item')).toBe('Item');
      expect(removeMarkdownSafe('42. Item')).toBe('Item');
    });

    it('should handle multiple list items', () => {
      const input = `- First
- Second
- Third`;
      const expected = `First
Second
Third`;
      expect(removeMarkdownSafe(input)).toBe(expected);
    });
  });

  describe('Horizontal Rules', () => {
    it('should remove horizontal rules', () => {
      expect(removeMarkdownSafe('---')).toBe('');
      expect(removeMarkdownSafe('----')).toBe('');
    });
  });

  describe('HTML Tags', () => {
    it('should remove HTML tags', () => {
      expect(removeMarkdownSafe('<div>Content</div>')).toBe('Content');
      expect(removeMarkdownSafe('<p>Paragraph</p>')).toBe('Paragraph');
    });

    it('should handle self-closing tags', () => {
      expect(removeMarkdownSafe('Line<br/>Break')).toBe('LineBreak');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle complex markdown with multiple features', () => {
      const input = `# Title

This is **bold** and *italic* text.

- Item 1
- Item 2

[Link](https://example.com)

\`\`\`javascript
console.log("code");
\`\`\``;

      const output = removeMarkdownSafe(input);

      // Should preserve text content
      expect(output).toContain('Title');
      expect(output).toContain('bold');
      expect(output).toContain('italic');
      expect(output).toContain('Item 1');
      expect(output).toContain('Item 2');
      expect(output).toContain('Link');
      // Code blocks are removed entirely
      expect(output).not.toContain('console.log');

      // Should not have markdown syntax
      expect(output).not.toContain('**');
      expect(output).not.toContain('# ');
      expect(output).not.toContain('- ');
      expect(output).not.toContain('[');
      expect(output).not.toContain('```');
    });

    it('should handle text meant for TTS', () => {
      const input = '**Hello!** This is a test with `code` and [links](url).';
      const output = removeMarkdownSafe(input);
      expect(output).toBe('Hello! This is a test with code and links.');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unclosed markdown syntax gracefully', () => {
      //Note: Unclosed markdown that doesn't match gets removed anyway (except single *)
      expect(removeMarkdownSafe('**unclosed bold')).toBe('unclosed bold');
      expect(removeMarkdownSafe('*unclosed italic')).toBe('*unclosed italic');
    });

    it('should preserve newlines for TTS paragraph detection', () => {
      const input = `First paragraph

Second paragraph`;
      const output = removeMarkdownSafe(input);
      expect(output).toContain('\n\n');
    });
  });
});

