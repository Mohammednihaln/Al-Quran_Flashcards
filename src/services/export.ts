/**
 * Export service for Quran Vocab Flashcards.
 * Handles exporting flashcards to PNG and PDF formats.
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Custom error class for export errors.
 */
export class ExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportError';
  }
}

/**
 * Exports the given HTML element as a PNG image.
 * Uses html2canvas to capture the element and triggers a download.
 * 
 * @param element - The HTML element to capture
 * @param filename - Optional filename (defaults to 'quran-flashcards.png')
 * @throws ExportError if capture fails
 */
export async function exportToPng(
  element: HTMLElement,
  filename: string = 'quran-flashcards.png'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#f5f7fa',
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    throw new ExportError('Failed to capture flashcards. Please try again.');
  }
}

/**
 * Exports the given HTML element as a PDF document.
 * Uses html2canvas to capture and jsPDF to generate the PDF.
 * 
 * @param element - The HTML element to capture
 * @param filename - Optional filename (defaults to 'quran-flashcards.pdf')
 * @throws ExportError if generation fails
 */
export async function exportToPdf(
  element: HTMLElement,
  filename: string = 'quran-flashcards.pdf'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#f5f7fa',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit the content
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Create PDF with appropriate dimensions
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
    
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    throw new ExportError('Failed to generate PDF. Please try again.');
  }
}
