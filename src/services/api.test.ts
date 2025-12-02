import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { transformToFlashcards } from './api';

/**
 * Arbitrary for generating mock API word objects.
 */
const apiWordArb = fc.record({
  id: fc.nat(),
  text_uthmani: fc.string({ minLength: 1 }),
  translation: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
  transliteration: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
  audio: fc.option(fc.record({ url: fc.webUrl() }), { nil: undefined }),
  char_type_name: fc.constantFrom('word', 'end', 'pause'),
});

/**
 * **Feature: quran-flashcards, Property 5: Flashcard count equals word count**
 * **Validates: Requirements 2.1**
 * 
 * For any API response with N words (char_type_name === 'word'),
 * transformation should produce exactly N flashcards.
 */
describe('Property 5: Flashcard count equals word count', () => {
  it('flashcard count equals actual word count (excluding non-word chars)', () => {
    fc.assert(
      fc.property(fc.array(apiWordArb, { minLength: 0, maxLength: 20 }), (words) => {
        const flashcards = transformToFlashcards(words);
        const actualWordCount = words.filter(w => w.char_type_name === 'word').length;
        
        expect(flashcards.length).toBe(actualWordCount);
      }),
      { numRuns: 100 }
    );
  });

  it('each flashcard contains arabic, transliteration, and meaning fields', () => {
    fc.assert(
      fc.property(fc.array(apiWordArb, { minLength: 1, maxLength: 20 }), (words) => {
        const flashcards = transformToFlashcards(words);
        
        for (const card of flashcards) {
          expect(card).toHaveProperty('id');
          expect(card).toHaveProperty('arabic');
          expect(card).toHaveProperty('transliteration');
          expect(card).toHaveProperty('meaning');
          expect(card).toHaveProperty('audioUrl');
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: quran-flashcards, Property 7: Audio URL fallback logic**
 * **Validates: Requirements 4.3**
 * 
 * For any flashcard data where word audio is null/undefined,
 * the audio URL should fall back to verse-level audio if available.
 */
describe('Property 7: Audio URL fallback logic', () => {
  it('uses word audio when available', () => {
    const wordWithAudio = fc.record({
      id: fc.nat(),
      text_uthmani: fc.string({ minLength: 1 }),
      translation: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
      transliteration: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
      audio: fc.record({ url: fc.webUrl() }),
      char_type_name: fc.constant('word' as const),
    });

    fc.assert(
      fc.property(
        fc.array(wordWithAudio, { minLength: 1, maxLength: 10 }),
        fc.webUrl(),
        (words, verseAudioUrl) => {
          const flashcards = transformToFlashcards(words, verseAudioUrl);
          
          for (let i = 0; i < flashcards.length; i++) {
            // Word audio should be used, not verse audio
            expect(flashcards[i].audioUrl).toBe(words[i].audio?.url);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('falls back to verse audio when word audio is missing', () => {
    const wordWithoutAudio = fc.record({
      id: fc.nat(),
      text_uthmani: fc.string({ minLength: 1 }),
      translation: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
      transliteration: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
      audio: fc.constant(undefined),
      char_type_name: fc.constant('word' as const),
    });

    fc.assert(
      fc.property(
        fc.array(wordWithoutAudio, { minLength: 1, maxLength: 10 }),
        fc.webUrl(),
        (words, verseAudioUrl) => {
          const flashcards = transformToFlashcards(words, verseAudioUrl);
          
          for (const card of flashcards) {
            expect(card.audioUrl).toBe(verseAudioUrl);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns null when both word and verse audio are missing', () => {
    const wordWithoutAudio = fc.record({
      id: fc.nat(),
      text_uthmani: fc.string({ minLength: 1 }),
      translation: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
      transliteration: fc.option(fc.record({ text: fc.string() }), { nil: undefined }),
      audio: fc.constant(undefined),
      char_type_name: fc.constant('word' as const),
    });

    fc.assert(
      fc.property(
        fc.array(wordWithoutAudio, { minLength: 1, maxLength: 10 }),
        (words) => {
          const flashcards = transformToFlashcards(words, undefined);
          
          for (const card of flashcards) {
            expect(card.audioUrl).toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
