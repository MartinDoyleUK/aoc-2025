import { describe, expect, it } from 'vitest';

import { parseLines, reverseString } from './string-utils.js';

describe('reverseString()', () => {
  it('should reverse a simple string', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  it('should reverse a string with spaces', () => {
    expect(reverseString('hello world')).toBe('dlrow olleh');
  });

  it('should handle empty string', () => {
    expect(reverseString('')).toBe('');
  });

  it('should handle single character', () => {
    expect(reverseString('a')).toBe('a');
  });

  it('should handle palindrome', () => {
    expect(reverseString('racecar')).toBe('racecar');
  });
});

describe('parseLines()', () => {
  it('should trim and filter blank lines', () => {
    const input = '  foo  \n\n  bar\n   \n';
    expect(parseLines(input)).toEqual(['foo', 'bar']);
  });

  it('should return empty array for empty string', () => {
    expect(parseLines('')).toEqual([]);
  });

  it('should keep internal spacing while trimming ends', () => {
    expect(parseLines('  foo bar  \n baz   ')).toEqual(['foo bar', 'baz']);
  });
});
