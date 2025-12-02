/**
 * AyahInput component - input field for ayah reference with generate button.
 * Displays validation errors and loading state.
 */

import './AyahInput.css';

interface AyahInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function AyahInput({ value, onChange, onSubmit, loading, error }: AyahInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="ayah-input-container">
      <div className="input-row">
        <input
          type="text"
          className="ayah-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter ayah reference (e.g., 2:255 or Al-Baqarah 255)"
          disabled={loading}
          aria-label="Ayah reference input"
        />
        <button
          className="generate-button"
          onClick={onSubmit}
          disabled={loading}
          aria-label={loading ? 'Generating flashcards' : 'Generate flashcards'}
        >
          {loading ? (
            <span className="loading-spinner" aria-hidden="true" />
          ) : (
            'Generate'
          )}
        </button>
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
