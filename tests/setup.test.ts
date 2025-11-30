import { describe, it, expect } from 'vitest';

describe('Testing Infrastructure Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have access to test globals', () => {
    expect(expect).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
  });

  it('should have mocked window.speechSynthesis', () => {
    expect(window.speechSynthesis).toBeDefined();
    expect(window.speechSynthesis.speak).toBeDefined();
    expect(window.speechSynthesis.getVoices).toBeDefined();
  });

  it('should have mocked Audio API', () => {
    const audio = new Audio();
    expect(audio).toBeDefined();
    expect(audio.play).toBeDefined();
    expect(audio.pause).toBeDefined();
  });

  it('should have mocked IntersectionObserver', () => {
    const observer = new IntersectionObserver(() => {});
    expect(observer).toBeDefined();
    expect(observer.observe).toBeDefined();
  });
});
