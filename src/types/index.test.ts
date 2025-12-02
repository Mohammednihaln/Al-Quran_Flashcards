import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { AppState, Flashcard } from './index';

/**
 * **Feature: quran-flashcards, Property 8: State shape invariant**
 * **Validates: Requirements 7.4**
 * 
 * For any state update operation, the resulting state should always contain
 * inputValue (string), loading (boolean), error (string|null), and flashcards (array).
 */

// Arbitrary for generating valid Flashcard objects
const flashcardArb = fc.record({
  id: fc.string({ minLength: 1 }),
  arabic: fc.string(),
  transliteration: fc.string(),
  meaning: fc.string(),
  audioUrl: fc.option(fc.webUrl(), { nil: null }),
});

// Arbitrary for generating valid AppState objects
const appStateArb = fc.record({
  inputValue: fc.string(),
  loading: fc.boolean(),
  error: fc.option(fc.string(), { nil: null }),
  flashcards: fc.array(flashcardArb),
});

/**
 * Helper function to validate that an object conforms to AppState shape.
 */
function isValidAppState(state: unknown): state is AppState {
  if (typeof state !== 'object' || state === null) return false;
  
  const s = state as Record<string, unknown>;
  
  return (
    typeof s.inputValue === 'string' &&
    typeof s.loading === 'boolean' &&
    (s.error === null || typeof s.error === 'string') &&
    Array.isArray(s.flashcards)
  );
}

/**
 * Helper function to validate that an object conforms to Flashcard shape.
 */
function isValidFlashcard(card: unknown): card is Flashcard {
  if (typeof card !== 'object' || card === null) return false;
  
  const c = card as Record<string, unknown>;
  
  return (
    typeof c.id === 'string' &&
    typeof c.arabic === 'string' &&
    typeof c.transliteration === 'string' &&
    typeof c.meaning === 'string' &&
    (c.audioUrl === null || typeof c.audioUrl === 'string')
  );
}

describe('Property 8: State shape invariant', () => {
  it('any generated AppState should have correct shape', () => {
    fc.assert(
      fc.property(appStateArb, (state) => {
        expect(isValidAppState(state)).toBe(true);
        expect(typeof state.inputValue).toBe('string');
        expect(typeof state.loading).toBe('boolean');
        expect(state.error === null || typeof state.error === 'string').toBe(true);
        expect(Array.isArray(state.flashcards)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('all flashcards in state should have correct shape', () => {
    fc.assert(
      fc.property(appStateArb, (state) => {
        for (const card of state.flashcards) {
          expect(isValidFlashcard(card)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});
