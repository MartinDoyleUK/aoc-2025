import { describe, expect, it } from 'vitest';

import { reverseString } from './string-utils.js';

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
