import { describe, it, expect } from 'vitest';
import {
  calculatePaginationRange,
  calculateTotalPages,
  formatPaginationRange,
  formatPaginationInfo,
  normalizePage,
  isValidPageChange,
} from '@/shared/utils/pagination';

describe('pagination helpers', () => {
  describe('calculatePaginationRange', () => {
    it('calculates first page range correctly', () => {
      const result = calculatePaginationRange(1, 10, 50);
      expect(result).toEqual({ startItem: 1, endItem: 10 });
    });

    it('calculates middle page range correctly', () => {
      const result = calculatePaginationRange(3, 10, 50);
      expect(result).toEqual({ startItem: 21, endItem: 30 });
    });

    it('calculates last page range correctly', () => {
      const result = calculatePaginationRange(5, 10, 50);
      expect(result).toEqual({ startItem: 41, endItem: 50 });
    });

    it('handles partial last page', () => {
      const result = calculatePaginationRange(3, 10, 25);
      expect(result).toEqual({ startItem: 21, endItem: 25 });
    });

    it('handles empty result', () => {
      const result = calculatePaginationRange(1, 10, 0);
      expect(result).toEqual({ startItem: 1, endItem: 0 });
    });
  });

  describe('calculateTotalPages', () => {
    it('calculates exact division', () => {
      expect(calculateTotalPages(100, 10)).toBe(10);
    });

    it('calculates partial last page', () => {
      expect(calculateTotalPages(105, 10)).toBe(11);
    });

    it('returns 0 for empty results', () => {
      expect(calculateTotalPages(0, 10)).toBe(0);
    });
  });

  describe('formatPaginationRange', () => {
    it('formats first page correctly', () => {
      expect(formatPaginationRange(1, 10, 50)).toBe('1–10 de 50');
    });

    it('formats middle page correctly', () => {
      expect(formatPaginationRange(3, 10, 50)).toBe('21–30 de 50');
    });

    it('formats last page correctly', () => {
      expect(formatPaginationRange(5, 10, 50)).toBe('41–50 de 50');
    });

    it('formats empty results correctly', () => {
      expect(formatPaginationRange(1, 10, 0)).toBe('1–0 de 0');
    });
  });

  describe('formatPaginationInfo', () => {
    it('formats full info correctly', () => {
      expect(formatPaginationInfo(2, 5, 10, 50)).toBe('Página 2 de 5 (11–20 de 50)');
    });

    it('formats first page info correctly', () => {
      expect(formatPaginationInfo(1, 10, 10, 100)).toBe('Página 1 de 10 (1–10 de 100)');
    });
  });

  describe('normalizePage', () => {
    it('normalizes valid page', () => {
      expect(normalizePage(3, 10)).toBe(3);
    });

    it('normalizes page below minimum', () => {
      expect(normalizePage(0, 10)).toBe(1);
    });

    it('normalizes page above maximum', () => {
      expect(normalizePage(15, 10)).toBe(10);
    });

    it('handles zero total pages', () => {
      expect(normalizePage(5, 0)).toBe(1);
    });
  });

  describe('isValidPageChange', () => {
    it('returns false for same page', () => {
      expect(isValidPageChange(3, 3, 10)).toBe(false);
    });

    it('returns true for valid page change', () => {
      expect(isValidPageChange(3, 4, 10)).toBe(true);
    });

    it('returns false for page below minimum', () => {
      expect(isValidPageChange(3, 0, 10)).toBe(false);
    });

    it('returns false for page above maximum', () => {
      expect(isValidPageChange(3, 11, 10)).toBe(false);
    });
  });
});
