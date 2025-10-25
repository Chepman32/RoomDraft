/**
 * Formatters Tests
 */

import {
  formatMeters,
  formatSquareMeters,
  formatCentimeters,
  formatDegrees,
  formatFileSize,
  truncate,
  capitalize,
} from '../formatters';

describe('Formatters', () => {
  describe('formatMeters', () => {
    it('should format meters with 2 decimals', () => {
      expect(formatMeters(1.234)).toBe('1.23m');
    });

    it('should format meters with custom decimals', () => {
      expect(formatMeters(1.23456, 3)).toBe('1.235m');
    });
  });

  describe('formatSquareMeters', () => {
    it('should format square meters', () => {
      expect(formatSquareMeters(10.567)).toBe('10.57m²');
    });
  });

  describe('formatCentimeters', () => {
    it('should convert meters to centimeters', () => {
      expect(formatCentimeters(1.5)).toBe('150cm');
    });
  });

  describe('formatDegrees', () => {
    it('should format degrees', () => {
      expect(formatDegrees(45.67)).toBe('46°');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1500)).toBe('1.5KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1500000)).toBe('1.4MB');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text';
      expect(truncate(text, 10)).toBe('This is...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncate(text, 10)).toBe('Short');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalize('h')).toBe('H');
    });
  });
});
