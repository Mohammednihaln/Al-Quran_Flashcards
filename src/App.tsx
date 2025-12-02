/**
 * Root application component for Quran Vocab Flashcards.
 * Orchestrates data flow between components and manages global state.
 * Designed for extensibility with features like review mode or spaced repetition.
 */

import { useState, useRef } from 'react';
import type { AppState } from './types';
import { HeaderBar } from './components/HeaderBar';
import { AyahInput } from './components/AyahInput';
import { AyahDisplay } from './components/AyahDisplay';
import { ExportBar } from './components/ExportBar';
import { parseAyahInput, validateInput } from './services/parser';
import { fetchVerse, ApiError } from './services/api';
import { SURAH_NAMES } from './utils/constants';
import './App.css';

/**
 * Get surah name from number (reverse lookup).
 */
function getSurahName(surahNumber: number): string {
  for (const [name, num] of Object.entries(SURAH_NAMES)) {
    if (num === surahNumber && name.startsWith('al-')) {
      // Capitalize properly: al-baqarah -> Al-Baqarah
      return name.split('-').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('-');
    }
  }
  return `Surah ${surahNumber}`;
}

/**
 * Initial application state with correct shape.
 */
const initialState: AppState = {
  inputValue: '',
  loading: false,
  error: null,
  flashcards: [],
  fullAyahArabic: null,
  fullAyahTranslation: null,
  ayahReference: null,
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [gradientIndex, setGradientIndex] = useState(0);
  const flashcardContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles input value changes.
   */
  const handleInputChange = (value: string) => {
    setState(prev => ({
      ...prev,
      inputValue: value,
      error: null, // Clear error when user types
    }));
  };

  /**
   * Handles the generate flow:
   * 1. Validates input
   * 2. Calls API service
   * 3. Transforms response to flashcards
   * 4. Updates state with results or errors
   */
  const handleGenerate = async () => {
    // Validate input
    const validation = validateInput(state.inputValue);
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Invalid input',
      }));
      return;
    }

    // Parse the input
    const parsed = parseAyahInput(state.inputValue);
    if (!parsed) {
      setState(prev => ({
        ...prev,
        error: 'Invalid format. Use surah:ayah (e.g., 2:255) or surah name + number',
      }));
      return;
    }

    // Set loading state
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      // Fetch verse data from API
      const response = await fetchVerse(parsed.surah, parsed.ayah);
      
      // Check if verse has words
      if (!response.verse?.words || response.verse.words.length === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'No vocabulary found for this ayah.',
          flashcards: [],
          fullAyahArabic: null,
          fullAyahTranslation: null,
          ayahReference: null,
        }));
        return;
      }

      // Build the ayah reference string
      const surahName = getSurahName(parsed.surah);
      const ayahReference = `${surahName} ${parsed.surah}:${parsed.ayah}`;

      // Get full ayah text from response
      const fullAyahArabic = response.verse.text_uthmani || null;
      
      // Get translation - try verse-level first, fallback to building from words
      let fullAyahTranslation = (response as { verse: { translations?: Array<{ text: string }> } })
        .verse.translations?.[0]?.text || null;
      
      // If no verse-level translation, build from word translations
      if (!fullAyahTranslation && response.verse.words) {
        const wordTranslations = response.verse.words
          .filter((w: { char_type_name: string }) => w.char_type_name === 'word')
          .map((w: { translation?: { text: string } }) => w.translation?.text || '')
          .join(' ')
          .trim();
        if (wordTranslations) {
          fullAyahTranslation = wordTranslations;
        }
      }

      // Change gradient on each successful load
      setGradientIndex(prev => prev + 1);

      // Update state with full ayah
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        flashcards: [],
        fullAyahArabic,
        fullAyahTranslation,
        ayahReference,
      }));
    } catch (error) {
      // Handle API errors
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Network error. Please check your connection and try again.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        flashcards: [],
        fullAyahArabic: null,
        fullAyahTranslation: null,
        ayahReference: null,
      }));
    }
  };

  return (
    <div className="app">
      <HeaderBar />
      
      <AyahInput
        value={state.inputValue}
        onChange={handleInputChange}
        onSubmit={handleGenerate}
        loading={state.loading}
        error={state.error}
      />
      
      <div ref={flashcardContainerRef} className="flashcard-container">
        {state.fullAyahArabic && (
          <AyahDisplay
            arabic={state.fullAyahArabic}
            translation={state.fullAyahTranslation ?? undefined}
            reference={state.ayahReference ?? undefined}
            gradientIndex={gradientIndex}
          />
        )}
      </div>
      
      {state.fullAyahArabic && (
        <ExportBar
          containerRef={flashcardContainerRef}
          hasContent={!!state.fullAyahArabic}
        />
      )}
    </div>
  );
}

export default App;
