// tests/generators/messages.ts
// Property-based test generators for messages

import * as fc from 'fast-check';
import { Timestamp } from 'firebase/firestore';

/**
 * Interface matching Message from the application
 */
export interface Message {
  id: string;
  role: 'agentA' | 'agentB' | 'user' | 'system';
  content: string;
  timestamp: Timestamp | null;
  audioUrl?: string;
  ttsWasSplit?: boolean;
  isStreaming?: boolean;
  imageUrl?: string | null;
  imageGenError?: string | null;
}

/**
 * Arbitrary for generating Unicode strings including emoji and special characters
 */
const unicodeStringArbitrary = (minLength: number, maxLength: number): fc.Arbitrary<string> => {
  return fc.oneof(
    // Regular ASCII text
    fc.string({ minLength, maxLength }),
    // Text with emoji
    fc.string({ minLength, maxLength }).map(s => s + ' 😀🎉✨'),
    // CJK characters (Chinese, Japanese, Korean)
    fc.array(
      fc.integer({ min: 0x4E00, max: 0x9FFF }).map(code => String.fromCodePoint(code)),
      { minLength: Math.min(minLength, 10), maxLength: Math.min(maxLength, 100) }
    ).map(chars => chars.join('')),
    // Arabic text
    fc.array(
      fc.integer({ min: 0x0600, max: 0x06FF }).map(code => String.fromCodePoint(code)),
      { minLength: Math.min(minLength, 10), maxLength: Math.min(maxLength, 100) }
    ).map(chars => chars.join('')),
    // Mixed Unicode with special characters
    fc.string({ minLength, maxLength }).map(s => `${s} • ™ © ® € £ ¥`),
    // Newlines and whitespace variations
    fc.string({ minLength, maxLength }).map(s => s.replace(/ /g, '\n'))
  );
};

/**
 * Arbitrary for generating random valid messages
 * Generates messages with various roles, content lengths (1-4000 chars), and Unicode
 */
export const messageArbitrary = (): fc.Arbitrary<Message> => {
  return fc.record({
    id: fc.uuid(),
    role: fc.constantFrom('agentA' as const, 'agentB' as const, 'user' as const, 'system' as const),
    content: unicodeStringArbitrary(1, 4000),
    timestamp: fc.oneof(
      fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).map(d => Timestamp.fromDate(d)),
      fc.constant(null)
    ),
    audioUrl: fc.option(fc.webUrl(), { nil: undefined }),
    ttsWasSplit: fc.option(fc.boolean(), { nil: undefined }),
    isStreaming: fc.option(fc.boolean(), { nil: undefined }),
    imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
    imageGenError: fc.option(fc.string({ minLength: 10, maxLength: 200 }), { nil: undefined })
  });
};

/**
 * Arbitrary for generating messages with specific role
 */
export const messageWithRoleArbitrary = (
  role: 'agentA' | 'agentB' | 'user' | 'system'
): fc.Arbitrary<Message> => {
  return messageArbitrary().map(msg => ({
    ...msg,
    role
  }));
};

/**
 * Arbitrary for generating agent messages (agentA or agentB)
 */
export const agentMessageArbitrary = (): fc.Arbitrary<Message> => {
  return messageArbitrary().map(msg => ({
    ...msg,
    role: fc.sample(fc.constantFrom('agentA' as const, 'agentB' as const), 1)[0]
  }));
};

/**
 * Arbitrary for generating messages with long content (for TTS chunking tests)
 */
export const longMessageArbitrary = (): fc.Arbitrary<Message> => {
  return messageArbitrary().map(msg => ({
    ...msg,
    content: fc.sample(unicodeStringArbitrary(4001, 10000), 1)[0]
  }));
};

/**
 * Arbitrary for generating streaming messages
 */
export const streamingMessageArbitrary = (): fc.Arbitrary<Message> => {
  return messageArbitrary().map(msg => ({
    ...msg,
    isStreaming: true,
    timestamp: null // Streaming messages don't have timestamp yet
  }));
};

/**
 * Arbitrary for generating messages with audio URL
 */
export const messageWithAudioArbitrary = (): fc.Arbitrary<Message> => {
  return messageArbitrary().map(msg => ({
    ...msg,
    role: fc.sample(fc.constantFrom('agentA' as const, 'agentB' as const), 1)[0],
    audioUrl: fc.sample(fc.webUrl(), 1)[0]
  }));
};

/**
 * Arbitrary for generating an array of messages ordered by timestamp
 */
export const orderedMessagesArbitrary = (
  minLength: number = 1,
  maxLength: number = 20
): fc.Arbitrary<Message[]> => {
  return fc.array(messageArbitrary(), { minLength, maxLength }).map(messages => {
    // Sort by timestamp (handle null timestamps)
    return messages
      .map((msg, index) => ({
        ...msg,
        timestamp: msg.timestamp || Timestamp.fromMillis(Date.now() + index * 1000)
      }))
      .sort((a, b) => {
        const aTime = a.timestamp?.toMillis() || 0;
        const bTime = b.timestamp?.toMillis() || 0;
        return aTime - bTime;
      });
  });
};

/**
 * Arbitrary for generating messages with newlines (for paragraph splitting tests)
 */
export const messageWithNewlinesArbitrary = (): fc.Arbitrary<Message> => {
  return messageArbitrary().map(msg => ({
    ...msg,
    content: fc.sample(
      fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 2, maxLength: 10 })
        .map(paragraphs => paragraphs.join('\n\n')),
      1
    )[0]
  }));
};
