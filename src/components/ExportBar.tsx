/**
 * ExportBar component - provides export buttons for PDF and PNG.
 * Disabled when no content is present.
 * Shows loading state during export operations.
 */

import { useState } from 'react';
import { exportToPng, exportToPdf } from '../services/export';
import './ExportBar.css';

interface ExportBarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  hasContent?: boolean;
}

export function ExportBar({ containerRef, hasContent = true }: ExportBarProps) {
  const [exportingPng, setExportingPng] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isExporting = exportingPng || exportingPdf;

  const handleExportPng = async () => {
    if (!containerRef.current || !hasContent) return;
    
    setExportingPng(true);
    setError(null);
    try {
      await exportToPng(containerRef.current);
    } catch (err) {
      console.error('PNG export failed:', err);
      setError('Failed to export PNG. Please try again.');
    } finally {
      setExportingPng(false);
    }
  };

  const handleExportPdf = async () => {
    if (!containerRef.current || !hasContent) return;
    
    setExportingPdf(true);
    setError(null);
    try {
      await exportToPdf(containerRef.current);
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="export-bar">
      {error && <div className="export-error">{error}</div>}
      <button
        className="export-button"
        onClick={handleExportPdf}
        disabled={!hasContent || isExporting}
        aria-label={exportingPdf ? 'Exporting PDF' : 'Export as PDF'}
      >
        {exportingPdf ? (
          <span className="export-spinner" aria-hidden="true" />
        ) : (
          '📄 Export PDF'
        )}
      </button>
      <button
        className="export-button"
        onClick={handleExportPng}
        disabled={!hasContent || isExporting}
        aria-label={exportingPng ? 'Exporting PNG' : 'Export as PNG'}
      >
        {exportingPng ? (
          <span className="export-spinner" aria-hidden="true" />
        ) : (
          '🖼️ Export PNG'
        )}
      </button>
    </div>
  );
}
