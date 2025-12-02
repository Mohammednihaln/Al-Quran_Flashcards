# Implementation Plan

- [x] 1. Set up project structure and dependencies






  - Initialize Vite + React + TypeScript project
  - Install dependencies: html2canvas, jspdf, fast-check, vitest
  - Configure CSS modules and base styles
  - Create directory structure: components/, services/, types/, utils/
  - _Requirements: 7.1, 7.2_

- [x] 2. Implement core types and constants


  - [x] 2.1 Create TypeScript interfaces for Flashcard, AppState, ParsedReference


    - Define all type definitions in types/index.ts
    - _Requirements: 7.4_
  - [x] 2.2 Write property test for state shape invariant


    - **Property 8: State shape invariant**
    - **Validates: Requirements 7.4**
  - [x] 2.3 Create gradient palettes and surah name mapping constants


    - Define GRADIENT_PALETTES array with 6 vibrant gradients
    - Define SURAH_NAMES mapping for all 114 surahs
    - _Requirements: 3.1, 1.2_
  - [x] 2.4 Write property test for gradient cycling


    - **Property 6: Gradient index cycles through palettes**
    - **Validates: Requirements 3.1**

- [x] 3. Implement input parser service


  - [x] 3.1 Create parseAyahInput function


    - Parse "surah:ayah" format (e.g., "2:255")
    - Parse surah name + ayah format (e.g., "Al-Baqarah 255")
    - Return null for invalid formats
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.2 Write property test for surah:ayah parsing

    - **Property 1: Valid surah:ayah parsing preserves reference**
    - **Validates: Requirements 1.1**
  - [x] 3.3 Write property test for surah name parsing

    - **Property 2: Surah name parsing returns correct number**
    - **Validates: Requirements 1.2**
  - [x] 3.4 Write property test for malformed input rejection

    - **Property 4: Malformed references are rejected**
    - **Validates: Requirements 1.4**
  - [x] 3.5 Create validateInput function

    - Check for empty/whitespace-only input
    - Validate parsed reference is within valid ranges
    - Return validation result with error message
    - _Requirements: 1.3, 1.4_
  - [x] 3.6 Write property test for whitespace validation

    - **Property 3: Whitespace-only input is invalid**
    - **Validates: Requirements 1.3**

- [x] 4. Implement API service


  - [x] 4.1 Create fetchVerse function


    - Call Quran.com API v4 endpoint
    - Handle 404 and network errors
    - Return typed response
    - _Requirements: 1.1, 6.1, 6.2_
  - [x] 4.2 Create transformToFlashcards function

    - Map API words to Flashcard objects
    - Extract arabic, transliteration, meaning
    - Handle audio URL with verse-level fallback
    - _Requirements: 2.1, 4.3, 6.3_
  - [x] 4.3 Write property test for flashcard transformation


    - **Property 5: Flashcard count equals word count**
    - **Validates: Requirements 2.1**

  - [x] 4.4 Write property test for audio fallback
    - **Property 7: Audio URL fallback logic**
    - **Validates: Requirements 4.3**

- [x] 5. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement UI components


  - [x] 6.1 Create HeaderBar component


    - Display "Quran Vocab Flashcards" title
    - Apply styling with subtle background
    - _Requirements: 7.2_

  - [x] 6.2 Create AyahInput component

    - Full-width input with placeholder
    - Generate button with loading state
    - Error message display
    - _Requirements: 1.3, 1.4, 1.5_
  - [x] 6.3 Create Flashcard component


    - Display Arabic text prominently
    - Show transliteration and meaning
    - Apply gradient background based on index
    - Rounded corners and soft shadow styling
    - _Requirements: 2.2, 2.3, 2.4, 3.1, 3.2_
  - [x] 6.4 Create FlashcardList component


    - Responsive grid layout (single column mobile, multi-column desktop)
    - Fade-in animation on load
    - Empty state handling
    - _Requirements: 3.3, 3.4, 2.5, 6.3_

  - [x] 6.5 Implement audio playback in Flashcard
    - Add play button with icon
    - Use HTML5 Audio API
    - Visual feedback while playing
    - _Requirements: 4.1, 4.2, 4.4_

- [x] 7. Implement export service


  - [x] 7.1 Create exportToPng function


    - Use html2canvas to capture flashcard container
    - Trigger browser download
    - Handle errors gracefully
    - _Requirements: 5.2_

  - [x] 7.2 Create exportToPdf function
    - Use html2canvas + jsPDF
    - Generate PDF with proper dimensions
    - Trigger browser download
    - _Requirements: 5.3_
  - [x] 7.3 Create ExportBar component


    - Export PDF and Export PNG buttons
    - Disabled state when no flashcards
    - Loading state during export
    - _Requirements: 5.1, 5.4, 5.5_

- [x] 8. Integrate App component



  - [x] 8.1 Wire up state management in App

    - Initialize state with correct shape
    - Handle input changes
    - Manage loading and error states
    - _Requirements: 7.4_

  - [ ] 8.2 Implement generate flow
    - Validate input on submit
    - Call API service
    - Transform response to flashcards
    - Update state with results or errors

    - _Requirements: 1.1, 1.5, 6.1, 6.2, 6.4_
  - [ ] 8.3 Apply global styles
    - Light subtle background gradient
    - Clean typography
    - Proper spacing throughout
    - _Requirements: 3.5_

- [x] 9. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
