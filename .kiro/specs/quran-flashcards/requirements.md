# Requirements: Quran Flashcards

## 1. Input Handling

### 1.1 Numeric Reference Format
- Users can enter ayah references in `surah:ayah` format (e.g., `2:255`)
- Surah numbers must be between 1-114
- Ayah numbers must be positive integers

### 1.2 Surah Name Format
- Users can enter references using surah names (e.g., `al-baqarah 255`)
- Support common transliteration variations (al-fatiha, fatiha, al-fatihah)
- Case-insensitive matching

### 1.3 Input Validation
- Empty or whitespace-only input shows error message
- Display clear error for invalid formats

### 1.4 Malformed Input Rejection
- Reject inputs that don't match expected formats
- Show user-friendly error messages

### 1.5 Submit Behavior
- Generate button triggers verse fetch
- Show loading state during API call

## 2. Flashcard Display

### 2.1 Word-by-Word Breakdown
- Each word from the verse becomes a flashcard
- Filter out non-word characters (end markers, etc.)

### 2.2 Arabic Text
- Display Arabic text prominently using Uthmani script
- Large, readable font size

### 2.3 Transliteration
- Show transliteration for pronunciation guidance

### 2.4 Meaning
- Display English translation/meaning for each word

### 2.5 Empty State
- Handle verses with no vocabulary gracefully

## 3. Visual Design

### 3.1 Gradient Backgrounds
- Apply vibrant gradient backgrounds to flashcards
- Cycle through 6 different gradient palettes

### 3.2 Card Styling
- Rounded corners on flashcards
- Soft shadow for depth

### 3.3 Responsive Grid
- Single column on mobile devices
- Multi-column grid on desktop

### 3.4 Animations
- Fade-in animation when flashcards load

### 3.5 Global Styling
- Light subtle background gradient for app
- Clean typography throughout

## 4. Audio Playback

### 4.1 Play Button
- Each flashcard has a play button for audio

### 4.2 HTML5 Audio
- Use native HTML5 Audio API for playback

### 4.3 Audio Fallback
- Use word-level audio if available
- Fall back to verse-level audio if word audio unavailable

### 4.4 Visual Feedback
- Show visual indicator while audio is playing

## 5. Export Functionality

### 5.1 Export Bar
- Display export options when flashcards are present

### 5.2 PNG Export
- Export flashcard container as PNG image
- Use html2canvas for capture
- 2x scale for high resolution

### 5.3 PDF Export
- Export flashcard container as PDF document
- Use html2canvas + jsPDF
- Proper A4 sizing

### 5.4 Disabled State
- Disable export buttons when no flashcards present

### 5.5 Loading State
- Show loading indicator during export process

## 6. API Integration

### 6.1 Quran.com API v4
- Fetch verse data from `api.quran.com/api/v4`
- Request word-by-word data with translations

### 6.2 Error Handling
- Handle 404 errors (ayah not found)
- Handle network errors gracefully
- Display user-friendly error messages

### 6.3 Response Transformation
- Transform API response to Flashcard objects
- Extract text_uthmani, transliteration, translation

### 6.4 Loading State
- Show loading indicator during API calls

## 7. Technical Requirements

### 7.1 Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Vitest for testing

### 7.2 Project Structure
- Organized into components/, services/, types/, utils/
- CSS modules for styling

### 7.3 Dependencies
- html2canvas for image capture
- jsPDF for PDF generation
- fast-check for property-based testing

### 7.4 Type Safety
- TypeScript interfaces for all data structures
- Strict type checking enabled
