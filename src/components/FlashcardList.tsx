/**
 * FlashcardList component - displays a responsive grid of flashcards.
 * Single column on mobile, multi-column on desktop.
 * Applies fade-in animation on load.
 */

import type { Flashcard as FlashcardType } from '../types';
import { Flashcard } from './Flashcard';
import './FlashcardList.css';

interface FlashcardListProps {
  flashcards: FlashcardType[];
}

export function FlashcardList({ flashcards }: FlashcardListProps) {
  if (flashcards.length === 0) {
    return (
      <div className="flashcard-list-empty">
        <p>Enter an ayah reference above to generate vocabulary flashcards.</p>
      </div>
    );
  }

  return (
    <div className="flashcard-list">
      {flashcards.map((card, index) => (
        <div 
          key={card.id} 
          className="flashcard-item"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Flashcard
            arabic={card.arabic}
            transliteration={card.transliteration}
            meaning={card.meaning}
            audioUrl={card.audioUrl}
            gradientIndex={index}
          />
        </div>
      ))}
    </div>
  );
}
