/**
 * API service for Quran Vocab Flashcards.
 * Handles fetching verse data from Quran.com API v4 and transforming to flashcards.
 */

import type { Flashcard } from '../types';

/**
 * API response structure from Quran.com API v4.
 */
interface QuranApiWord {
  id: number;
  text_uthmani: string;
  translation?: { text: string };
  transliteration?: { text: string };
  audio?: { url: string };
  char_type_name: string;
}

interface QuranApiVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  audio_url?: string;
  words: QuranApiWord[];
  audio?: { url: string };
}



interface QuranApiResponse {
  verse: QuranApiVerse;
}

/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetches verse data from Quran.com API v4.
 * 
 * @param surah - Surah number (1-114)
 * @param ayah - Ayah number
 * @returns Promise with verse data including words
 * @throws ApiError on 404 or network errors
 */
export async function fetchVerse(surah: number, ayah: number): Promise<QuranApiResponse> {
  const verseKey = `${surah}:${ayah}`;
  // Include audio recitation (recitation 7 = Mishari Rashid al-Afasy)
  const url = `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&translations=131&fields=text_uthmani,audio_url&word_fields=text_uthmani,audio&translation_fields=text&recitation=7`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      throw new ApiError('Ayah not found. Please check the reference.', 404);
    }

    if (!response.ok) {
      throw new ApiError('Network error. Please check your connection and try again.', response.status);
    }

    const data = await response.json();
    return data as QuranApiResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error. Please check your connection and try again.');
  }
}

/**
 * Transforms API response words to Flashcard objects.
 * Filters out non-word characters (like end markers) and extracts
 * arabic text, transliteration, meaning, and audio URL.
 * 
 * @param words - Array of words from API response
 * @param verseAudioUrl - Optional verse-level audio URL for fallback
 * @returns Array of Flashcard objects
 */
export function transformToFlashcards(
  words: QuranApiWord[],
  verseAudioUrl?: string
): Flashcard[] {
  // Filter to only include actual words (not end markers, etc.)
  const actualWords = words.filter(word => word.char_type_name === 'word');

  return actualWords.map((word, index) => ({
    id: `word-${word.id || index}`,
    arabic: word.text_uthmani || '',
    transliteration: word.transliteration?.text || '',
    meaning: word.translation?.text || '',
    // Use word-level audio if available, otherwise fall back to verse audio
    audioUrl: word.audio?.url || verseAudioUrl || null,
  }));
}
