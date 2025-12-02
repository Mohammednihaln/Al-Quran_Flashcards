import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseAyahInput, validateInput } from './parser';
import { SURAH_NAMES } from '../utils/constants';

/**
 * **Feature: quran-flashcards, Property 1: Valid surah:ayah parsing preserves reference**
 * **Validates: Requirements 1.1**
 * 
 * For any valid surah number (1-114) and ayah number, formatting as "surah:ayah"
 * and parsing should return the same surah and ayah numbers.
 */
describe('Property 1: Valid surah:ayah parsing preserves reference', () => {
  it('parsing surah:ayah format returns correct surah and ayah', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 114 }),
        fc.integer({ min: 1, max: 300 }),
        (surah, ayah) => {
          const input = `${surah}:${ayah}`;
          const result = parseAyahInput(input);
          
          expect(result).not.toBeNull();
          expect(result?.surah).toBe(surah);
          expect(result?.ayah).toBe(ayah);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: quran-flashcards, Property 2: Surah name parsing returns correct number**
 * **Validates: Requirements 1.2**
 * 
 * For any known surah name from the mapping, parsing should return
 * the corresponding surah number.
 */
describe('Property 2: Surah name parsing returns correct number', () => {
  it('parsing surah name + ayah returns correct surah number', () => {
    const surahNames = Object.keys(SURAH_NAMES);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...surahNames),
        fc.integer({ min: 1, max: 300 }),
        (surahName, ayah) => {
          const input = `${surahName} ${ayah}`;
          const result = parseAyahInput(input);
          
          expect(result).not.toBeNull();
          expect(result?.surah).toBe(SURAH_NAMES[surahName]);
          expect(result?.ayah).toBe(ayah);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: quran-flashcards, Property 3: Whitespace-only input is invalid**
 * **Validates: Requirements 1.3**
 * 
 * For any string composed entirely of whitespace characters,
 * validation should return invalid with an error message.
 */
describe('Property 3: Whitespace-only input is invalid', () => {
  it('whitespace-only strings are rejected', () => {
    const whitespaceArb = fc.stringOf(
      fc.constantFrom(' ', '\t', '\n', '\r'),
      { minLength: 0, maxLength: 20 }
    );
    
    fc.assert(
      fc.property(whitespaceArb, (input) => {
        const result = validateInput(input);
        
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: quran-flashcards, Property 4: Malformed references are rejected**
 * **Validates: Requirements 1.4**
 * 
 * For any string that doesn't match valid patterns (surah:ayah, surah name + number),
 * parsing should return null.
 */
describe('Property 4: Malformed references are rejected', () => {
  it('random strings without valid patterns return null', () => {
    // Generate strings that are unlikely to match valid patterns
    const malformedArb = fc.oneof(
      // Just letters
      fc.stringOf(fc.char().filter(c => /[a-z]/i.test(c)), { minLength: 1, maxLength: 10 }),
      // Just numbers without colon
      fc.stringOf(fc.char().filter(c => /[0-9]/.test(c)), { minLength: 1, maxLength: 5 }),
      // Special characters
      fc.stringOf(fc.constantFrom('!', '@', '#', '$', '%'), { minLength: 1, maxLength: 5 }),
      // Invalid colon format (letters:letters)
      fc.tuple(
        fc.stringOf(fc.char().filter(c => /[a-z]/i.test(c)), { minLength: 1, maxLength: 5 }),
        fc.stringOf(fc.char().filter(c => /[a-z]/i.test(c)), { minLength: 1, maxLength: 5 })
      ).map(([a, b]) => `${a}:${b}`),
      // Out of range surah
      fc.tuple(
        fc.integer({ min: 115, max: 999 }),
        fc.integer({ min: 1, max: 100 })
      ).map(([s, a]) => `${s}:${a}`),
      // Zero surah
      fc.integer({ min: 1, max: 100 }).map(a => `0:${a}`),
      // Zero ayah
      fc.integer({ min: 1, max: 114 }).map(s => `${s}:0`)
    );
    
    fc.assert(
      fc.property(malformedArb, (input) => {
        const result = parseAyahInput(input);
        expect(result).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});
