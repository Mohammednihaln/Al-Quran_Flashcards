/**
 * Flashcard component - displays a single vocabulary card.
 * Shows Arabic text, transliteration, meaning, and audio playback button.
 * Applies gradient background based on index for visual variety.
 */

import { useState, useRef } from 'react';
import { getGradient } from '../utils/constants';
import './Flashcard.css';

interface FlashcardProps {
  arabic: string;
  transliteration: string;
  meaning: string;
  audioUrl: string | null;
  gradientIndex: number;
}

export function Flashcard({ arabic, transliteration, meaning, audioUrl, gradientIndex }: FlashcardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    setIsPlaying(true);
    
    audio.play().catch(() => {
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
  };

  const gradient = getGradient(gradientIndex);

  return (
    <div className="flashcard" style={{ background: gradient }}>
      <div className="flashcard-content">
        <p className="arabic-text">{arabic}</p>
        <p className="transliteration">{transliteration}</p>
        <p className="meaning">{meaning}</p>
        
        {audioUrl && (
          <button
            className={`audio-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayAudio}
            disabled={isPlaying}
            aria-label={isPlaying ? 'Playing audio' : 'Play pronunciation'}
          >
            {isPlaying ? (
              <span className="audio-icon playing-icon">🔊</span>
            ) : (
              <span className="audio-icon">🔈</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
