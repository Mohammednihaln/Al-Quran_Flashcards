import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { GRADIENT_PALETTES, getGradient } from './constants';

/**
 * **Feature: quran-flashcards, Property 6: Gradient index cycles through palettes**
 * **Validates: Requirements 3.1**
 * 
 * For any non-negative integer index, the gradient selection should return
 * a valid gradient from the palette array using modulo cycling.
 */

describe('Property 6: Gradient index cycles through palettes', () => {
  it('any non-negative index returns a valid gradient from the palette', () => {
    fc.assert(
      fc.property(fc.nat(), (index) => {
        const gradient = getGradient(index);
        expect(GRADIENT_PALETTES).toContain(gradient);
      }),
      { numRuns: 100 }
    );
  });

  it('gradient cycles correctly through palette length', () => {
    fc.assert(
      fc.property(fc.nat(), (index) => {
        const gradient = getGradient(index);
        const expectedGradient = GRADIENT_PALETTES[index % GRADIENT_PALETTES.length];
        expect(gradient).toBe(expectedGradient);
      }),
      { numRuns: 100 }
    );
  });

  it('same index always returns same gradient', () => {
    fc.assert(
      fc.property(fc.nat(), (index) => {
        const gradient1 = getGradient(index);
        const gradient2 = getGradient(index);
        expect(gradient1).toBe(gradient2);
      }),
      { numRuns: 100 }
    );
  });
});
