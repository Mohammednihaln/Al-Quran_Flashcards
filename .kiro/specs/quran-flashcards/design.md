# Design: Quran Flashcards

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│                    (State Management)                        │
├─────────────────────────────────────────────────────────────┤
│  Components          │  Services           │  Utils          │
│  ─────────────       │  ────────           │  ─────          │
│  HeaderBar           │  api.ts             │  constants.ts   │
│  AyahInput           │  parser.ts          │                 │
│  AyahDisplay         │  export.ts          │                 │
│  Flashcard           │                     │                 │
│  FlashcardList       │                     │                 │
│  ExportBar           │                     │                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input → Parser → API → Transform → State → Render → Export
```

1. User enters ayah reference (e.g., "2:255")
2. Parser validates and extracts surah/ayah numbers
3. API service fetches verse data from Quran.com
4. Response transformed to Flashcard objects
5. State updated, triggering re-render
6. User can export displayed flashcards

## Component Design

### App.tsx (Root)
- Manages global `AppState`
- Orchestrates data flow between components
- Handles generate flow: validate → parse → fetch → update

### HeaderBar
- Static component displaying app title
- Styled with subtle background

### AyahInput
- Controlled input component
- Props: `value`, `onChange`, `onSubmit`, `loading`, `error`
- Displays error messages below input

### AyahDisplay
- Shows full ayah Arabic text with translation
- Accepts `gradientIndex` for background variety
- Displays reference (e.g., "Al-Baqarah 2:255")

### Flashcard
- Individual word card
- Displays: Arabic, transliteration, meaning
- Audio play button with visual feedback
- Gradient background based on index

### FlashcardList
- Responsive grid container
- Maps Flashcard[] to Flashcard components
- Handles empty state

### ExportBar
- PNG and PDF export buttons
- Disabled when no content
- Loading state during export

## Service Design

### parser.ts
```typescript
parseAyahInput(input: string): ParsedReference | null
validateInput(input: string): ValidationResult
```
- Regex-based parsing for both formats
- Surah name lookup via SURAH_NAMES constant

### api.ts
```typescript
fetchVerse(surah: number, ayah: number): Promise<QuranApiResponse>
transformToFlashcards(words: Word[], audioUrl?: string): Flashcard[]
```
- Calls Quran.com API v4
- Custom `ApiError` class for error handling
- Filters non-word characters from response

### export.ts
```typescript
exportToPng(element: HTMLElement, filename?: string): Promise<void>
exportToPdf(element: HTMLElement, filename?: string): Promise<void>
```
- html2canvas for DOM capture
- jsPDF for PDF generation
- 2x scale for high resolution

## State Shape

```typescript
interface AppState {
  inputValue: string;        // Current input field value
  loading: boolean;          // API call in progress
  error: string | null;      // Error message to display
  flashcards: Flashcard[];   // Generated flashcards
  fullAyahArabic: string | null;
  fullAyahTranslation: string | null;
  ayahReference: string | null;
}
```

## Type Definitions

```typescript
interface Flashcard {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  audioUrl: string | null;
}

interface ParsedReference {
  surah: number;
  ayah: number;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

## API Integration

### Endpoint
```
GET https://api.quran.com/api/v4/verses/by_key/{surah}:{ayah}
    ?words=true
    &translations=131
    &fields=text_uthmani,audio_url
    &word_fields=text_uthmani,audio
    &recitation=7
```

### Response Structure
```typescript
{
  verse: {
    text_uthmani: string;
    words: Array<{
      text_uthmani: string;
      translation: { text: string };
      transliteration: { text: string };
      audio?: { url: string };
      char_type_name: string;  // "word" | "end"
    }>;
  }
}
```

## Styling Approach

- CSS modules per component
- Gradient palettes in constants.ts
- Mobile-first responsive design
- CSS Grid for flashcard layout

## Testing Strategy

- Property-based tests with fast-check
- Unit tests for parser and transformer functions
- Test files co-located with source (*.test.ts)
