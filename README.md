# Al-Quran Flashcards

A React application for generating beautiful flashcards from Quran verses. Enter any ayah reference and get a visually appealing display of the Arabic text with translation, ready to export as an image or PDF. Created by the use of "kiro" ide.

## Features

- 📖 Fetch any Quran verse by surah:ayah reference (e.g., `2:255` or `al-baqarah 255`)
- 🎨 Beautiful gradient backgrounds that change with each verse
- 📤 Export flashcards as PNG images or PDF documents
- 🔤 Supports both numeric and surah name inputs
- ⚡ Fast and responsive UI built with React + TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quran-flashcards

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Enter an ayah reference in the input field:
   - Numeric format: `2:255` (Surah 2, Ayah 255)
   - Name format: `al-baqarah 255`
2. Click "Generate" to fetch and display the verse with English meaning as colourful Flashcards
3. Use the export buttons to save as PNG or PDF

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **html2canvas** - Image export
- **jsPDF** - PDF export
- **Vitest** - Testing framework

## Project Structure

```
src/
├── components/     # React components (AyahInput, AyahDisplay, ExportBar, etc.)
├── services/       # API calls and business logic
├── types/          # TypeScript interfaces
├── utils/          # Constants and helpers
└── App.tsx         # Root component
```

## API

This app uses the [Quran.com API](https://quran.com) to fetch verse data including Arabic text, translations, and word-by-word breakdowns.

## Thankyou all , put a star for this wonderful creative project.

