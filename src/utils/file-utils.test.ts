import fs from 'node:fs';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDataForPuzzle } from './file-utils.js';

vi.mock('node:fs');

describe('getDataForPuzzle()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read puzzle data files for a given day', () => {
    const mockReadFileSync = vi.mocked(fs.readFileSync);
    mockReadFileSync.mockReturnValueOnce('real data');
    mockReadFileSync.mockReturnValueOnce('test data 1');
    mockReadFileSync.mockReturnValueOnce('test data 2');

    const result = getDataForPuzzle('file:///path/to/puzzles/01.js');

    expect(result).toEqual({
      REAL: 'real data',
      TEST1: 'test data 1',
      TEST2: 'test data 2',
    });

    expect(mockReadFileSync).toHaveBeenCalledTimes(3);
    expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('01'), 'utf8');
    expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('data.txt'), 'utf8');
    expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('test-data-01.txt'), 'utf8');
    expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('test-data-02.txt'), 'utf8');
  });

  it('should handle different day numbers', () => {
    const mockReadFileSync = vi.mocked(fs.readFileSync);
    mockReadFileSync.mockReturnValue('data');

    getDataForPuzzle('file:///path/to/puzzles/25.js');

    expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('25'), 'utf8');
  });

  it('should extract day number from filename correctly', () => {
    const mockReadFileSync = vi.mocked(fs.readFileSync);
    mockReadFileSync.mockReturnValue('data');

    getDataForPuzzle('file:///different/path/with/numbers/123/puzzles/09.js');

    expect(mockReadFileSync).toHaveBeenCalledWith(expect.stringContaining('09'), 'utf8');
  });

  it('should throw if the filename does not contain a day number', () => {
    expect(() => getDataForPuzzle('file:///path/to/puzzles/not-a-day.js')).toThrow(
      'Could not extract day number from puzzle filename',
    );
  });
});
