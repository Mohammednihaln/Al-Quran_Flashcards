/**
 * Type definitions for Quran Vocab Flashcards application.
 * Provides interfaces for flashcards, application state, and parsed references.
 * Designed for extensibility with features like review mode or spaced repetition.
 */

/**
 * Represents a single vocabulary flashcard with Arabic text, transliteration,
 * meaning, and optional audio URL.
 */
export interface Flashcard {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  audioUrl: string | null;
}

/**
 * Represents the global application state.
 * Contains input value, loading state, error messages, and generated flashcards.
 */
export interface AppState {
  inputValue: string;
  loading: boolean;
  error: string | null;
  flashcards: Flashcard[];
  fullAyahArabic: string | null;
  fullAyahTranslation: string | null;
  ayahReference: string | null;
}

/**
 * Represents a parsed ayah reference with surah and ayah numbers.
 */
export interface ParsedReference {
  surah: number;
  ayah: number;
}

/**
 * Validation result for user input.
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Word data from Quran.com API response.
 */
export interface Word {
  text_uthmani: string;
  translation: { text: string };
  transliteration: { text: string };
  audio?: { url: string };
}

/**
 * Quran.com API response structure for a verse.
 */
export interface QuranApiResponse {
  verse: {
    words: Word[];
    audio?: { url: string };
  };
}
