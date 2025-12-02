/**
 * Input parser service for Quran Vocab Flashcards.
 * Parses ayah references in various formats and validates user input.
 */

import type { ParsedReference, ValidationResult } from '../types';
import { SURAH_NAMES } from '../utils/constants';

/**
 * Parses user input to extract surah and ayah numbers.
 * Supports formats:
 * - "surah:ayah" (e.g., "2:255")
 * - "surah name ayah" (e.g., "Al-Baqarah 255")
 * 
 * @param input - User input string
 * @returns ParsedReference if valid, null if invalid format
 */
export function parseAyahInput(input: string): ParsedReference | null {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return null;
  }

  // Try surah:ayah format (e.g., "2:255")
  const colonMatch = trimmed.match(/^(\d+):(\d+)$/);
  if (colonMatch) {
    const surah = parseInt(colonMatch[1], 10);
    const ayah = parseInt(colonMatch[2], 10);
    
    if (surah >= 1 && surah <= 114 && ayah >= 1) {
      return { surah, ayah };
    }
    return null;
  }

  // Try surah name + ayah format (e.g., "Al-Baqarah 255")
  const nameMatch = trimmed.match(/^(.+?)\s+(\d+)$/);
  if (nameMatch) {
    const surahName = nameMatch[1].toLowerCase().trim();
    const ayah = parseInt(nameMatch[2], 10);
    
    const surah = SURAH_NAMES[surahName];
    if (surah && ayah >= 1) {
      return { surah, ayah };
    }
    return null;
  }

  return null;
}

/**
 * Validates user input for ayah reference.
 * Checks for empty/whitespace-only input and validates parsed reference.
 * 
 * @param input - User input string
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateInput(input: string): ValidationResult {
  // Check for empty or whitespace-only input
  if (!input || input.trim().length === 0) {
    return {
      valid: false,
      error: 'Please enter an ayah reference',
    };
  }

  // Try to parse the input
  const parsed = parseAyahInput(input);
  
  if (!parsed) {
    return {
      valid: false,
      error: 'Invalid format. Use surah:ayah (e.g., 2:255) or surah name + number',
    };
  }

  // Validate surah range
  if (parsed.surah < 1 || parsed.surah > 114) {
    return {
      valid: false,
      error: 'Surah must be between 1 and 114',
    };
  }

  return { valid: true };
}
