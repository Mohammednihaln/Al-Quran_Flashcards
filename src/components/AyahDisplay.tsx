/**
 * AyahDisplay component - displays the full ayah as a single box.
 * Shows the complete Arabic text, optional translation, and reference badge.
 * Background gradient changes on each load for visual variety.
 */

import './AyahDisplay.css';

/**
 * Vibrant gradient palettes for the ayah display background.
 */
const AYAH_GRADIENTS = [
  'linear-gradient(135deg, #1a2b6d 0%, #4b1c7f 50%, #8b2bbf 100%)', // Royal Purple
  'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #3282b8 100%)', // Ocean Blue
  'linear-gradient(135deg, #2d132c 0%, #801336 50%, #c72c41 100%)', // Deep Rose
  'linear-gradient(135deg, #134e5e 0%, #1a6b5c 50%, #71b280 100%)', // Forest Teal
  'linear-gradient(135deg, #232526 0%, #414345 50%, #5c5c5c 100%)', // Elegant Gray
  'linear-gradient(135deg, #4a1942 0%, #7b2d5b 50%, #a64d79 100%)', // Plum
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3a7bd5 100%)', // Sky Blue
  'linear-gradient(135deg, #2c3e50 0%, #4a6572 50%, #6b8e9f 100%)', // Slate
];

interface AyahDisplayProps {
  arabic: string;
  translation?: string;
  reference?: string;
  gradientIndex?: number;
}

export function AyahDisplay({ 
  arabic, 
  translation, 
  reference, 
  gradientIndex = 0
}: AyahDisplayProps) {
  const gradient = AYAH_GRADIENTS[gradientIndex % AYAH_GRADIENTS.length];

  return (
    <div className="ayah-display" style={{ background: gradient }}>
      {reference && (
        <span className="ayah-reference-badge">{reference}</span>
      )}
      
      <p className="ayah-arabic-text">{arabic}</p>
      
      {translation && (
        <p className="ayah-translation">{translation}</p>
      )}
    </div>
  );
}
