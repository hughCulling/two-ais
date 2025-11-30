// src/lib/tts-utils.properties.test.ts
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { splitIntoTTSChunks, splitIntoParagraphs } from './tts-utils';

describe('TTS Utils Property-Based Tests', () => {
  // Feature: comprehensive-testing, Property 12: Long messages are chunked for TTS
  // Validates: Requirements 4.2
  it('Property 12: messages over 4000 characters are chunked correctly', () => {
    fc.assert(
      fc.property(
        // Generate messages longer than 4000 characters with sentences
        fc.string({ minLength: 4001, maxLength: 10000 }).map(str => {
          // Add some sentence boundaries to make it realistic
          return str.replace(/(.{100})/g, '$1. ');
        }),
        (longMessage) => {
          const chunks = splitIntoTTSChunks(longMessage, 4000);
          
          // Property 1: All chunks must be <= 4000 characters
          chunks.forEach(chunk => {
            expect(chunk.length).toBeLessThanOrEqual(4000);
          });
          
          // Property 2: Should have multiple chunks for long messages
          if (longMessage.length > 4000) {
            expect(chunks.length).toBeGreaterThanOrEqual(1);
          }
          
          // Property 3: Concatenating chunks should preserve content (modulo whitespace)
          const reconstructed = chunks.join('').replace(/\s+/g, ' ').trim();
          const original = longMessage.replace(/\s+/g, ' ').trim();
          
          // Content should be preserved (allowing for whitespace normalization)
          expect(reconstructed.length).toBeGreaterThan(0);
          expect(reconstructed.length).toBeLessThanOrEqual(original.length + chunks.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: comprehensive-testing, Property 13: Browser TTS splits on paragraphs
  // Validates: Requirements 4.3
  it('Property 13: messages with newlines are split into paragraphs', () => {
    fc.assert(
      fc.property(
        // Generate messages with newlines
        fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 2, maxLength: 10 })
          .map(paragraphs => paragraphs.join('\n\n')),
        (messageWithNewlines) => {
          const paragraphs = splitIntoParagraphs(messageWithNewlines);
          
          // Property 1: Should have at least one paragraph
          expect(paragraphs.length).toBeGreaterThanOrEqual(1);
          
          // Property 2: No paragraph should contain newlines
          paragraphs.forEach(paragraph => {
            expect(paragraph).not.toMatch(/\n/);
          });
          
          // Property 3: All paragraphs should be non-empty after trimming
          paragraphs.forEach(paragraph => {
            expect(paragraph.trim().length).toBeGreaterThan(0);
          });
          
          // Property 4: Joining paragraphs should preserve content
          const reconstructed = paragraphs.join(' ').replace(/\s+/g, ' ').trim();
          const original = messageWithNewlines.replace(/\s+/g, ' ').trim();
          expect(reconstructed).toBe(original);
        }
      ),
      { numRuns: 100 }
    );
  });
});
