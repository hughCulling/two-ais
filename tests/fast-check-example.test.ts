import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Fast-check Integration', () => {
  it('should have fast-check available', () => {
    expect(fc).toBeDefined();
    expect(fc.assert).toBeDefined();
    expect(fc.property).toBeDefined();
  });

  // Feature: comprehensive-testing, Property 0: String concatenation
  // Validates: Testing infrastructure
  it('Property 0: string concatenation length', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        const result = a + b;
        expect(result.length).toBe(a.length + b.length);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: comprehensive-testing, Property 0: Array reverse
  // Validates: Testing infrastructure
  it('Property 0: reversing array twice returns original', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const reversed = arr.slice().reverse().reverse();
        expect(reversed).toEqual(arr);
      }),
      { numRuns: 100 }
    );
  });
});
