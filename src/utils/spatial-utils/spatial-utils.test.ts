import { describe, expect, it } from 'vitest';

import { Grid } from './grid.js';
import {
  linesToCustomGrid,
  linesToNumberGrid,
  linesToStringGrid,
  POINT_REGEX,
} from './spatial-utils.js';

describe('POINT_REGEX', () => {
  it('should match valid point format', () => {
    expect(POINT_REGEX.test('10,5')).toBe(true);
  });

  it('should match signed point format', () => {
    expect(POINT_REGEX.test('-10,+5')).toBe(true);
    expect(POINT_REGEX.test('+3,-2')).toBe(true);
  });

  it('should not match invalid formats', () => {
    expect(POINT_REGEX.test('invalid')).toBe(false);
    expect(POINT_REGEX.test('10')).toBe(false);
    expect(POINT_REGEX.test('10,5,3')).toBe(false);
  });
});

describe('linesToNumberGrid()', () => {
  it('should convert lines to number grid', () => {
    const lines = ['123', '456', '789'];
    const grid = linesToNumberGrid(lines);
    expect(grid).toBeInstanceOf(Grid);
    expect(grid.numRows).toBe(3);
    expect(grid.numCols).toBe(3);
  });
});

describe('linesToStringGrid()', () => {
  it('should convert lines to string grid', () => {
    const lines = ['abc', 'def', 'ghi'];
    const grid = linesToStringGrid(lines);
    expect(grid).toBeInstanceOf(Grid);
    expect(grid.numRows).toBe(3);
    expect(grid.numCols).toBe(3);
  });
});

describe('linesToCustomGrid()', () => {
  it('should convert lines with custom transform', () => {
    const lines = ['123', '456'];
    const transform = (val: string) => Number.parseInt(val, 10) * 2;
    const grid = linesToCustomGrid(lines, transform);
    expect(grid).toBeInstanceOf(Grid);
    expect(grid.numRows).toBe(2);
  });
});
