import { describe, expect, it } from 'vitest';

import {
  findGreatestCommonDivisor,
  getLowestCommonMultiple,
} from './math-utils.js';

describe('findGreatestCommonDenominator()', () => {
  it('should find GCD of two numbers', () => {
    expect(findGreatestCommonDivisor(48, 18)).toBe(6);
  });

  it('should handle when second number is zero', () => {
    expect(findGreatestCommonDivisor(10, 0)).toBe(10);
  });

  it('should handle when first number is smaller', () => {
    expect(findGreatestCommonDivisor(18, 48)).toBe(6);
  });

  it('should handle equal numbers', () => {
    expect(findGreatestCommonDivisor(12, 12)).toBe(12);
  });

  it('should handle coprime numbers', () => {
    expect(findGreatestCommonDivisor(17, 19)).toBe(1);
  });

  it('should throw error for negative first number', () => {
    expect(() => findGreatestCommonDivisor(-5, 10)).toThrow(
      'findGreatestCommonDivisor requires non-negative numbers (got -5, 10)',
    );
  });

  it('should throw error for negative second number', () => {
    expect(() => findGreatestCommonDivisor(10, -5)).toThrow(
      'findGreatestCommonDivisor requires non-negative numbers (got 10, -5)',
    );
  });

  it('should throw error for both negative numbers', () => {
    expect(() => findGreatestCommonDivisor(-10, -5)).toThrow(
      'findGreatestCommonDivisor requires non-negative numbers (got -10, -5)',
    );
  });
});

describe('getLowestCommonMultiple()', () => {
  it('should find LCM of multiple numbers', () => {
    expect(getLowestCommonMultiple([12, 18, 24])).toBe(72);
  });

  it('should handle two numbers', () => {
    expect(getLowestCommonMultiple([12, 18])).toBe(36);
  });

  it('should handle single number', () => {
    expect(getLowestCommonMultiple([10])).toBe(10);
  });

  it('should handle empty array', () => {
    expect(getLowestCommonMultiple([])).toBe(1);
  });

  it('should handle array with one', () => {
    expect(getLowestCommonMultiple([1, 5, 10])).toBe(10);
  });

  it('should return 0 when array contains zero', () => {
    expect(getLowestCommonMultiple([0, 5, 10])).toBe(0);
  });

  it('should return 0 when array is only zero', () => {
    expect(getLowestCommonMultiple([0])).toBe(0);
  });
});
