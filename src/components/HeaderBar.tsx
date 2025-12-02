/**
 * HeaderBar component - displays the application title.
 * Pure presentational component with subtle background styling.
 */

import './HeaderBar.css';

export function HeaderBar() {
  return (
    <header className="header-bar">
      <h1 className="header-title">Al-Quran Flashcards</h1>
    </header>
  );
}
