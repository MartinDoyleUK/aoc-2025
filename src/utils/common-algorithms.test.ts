import { describe, expect, it } from 'vitest';

import { findTransition, getBinaryCandidate, memoize } from './common-algorithms.js';

describe('getBinaryCandidate()', () => {
  const testCases = [
    ['should find the mid-point of an odd-numbered range', 4, 6, 5],
    ['should go down to find the mid-point of an even-numbered range', 4, 7, 5],
    ['should return the start of range of length two', 4, 5, 4],
    ['should return the start of range of length one', 4, 4, 4],
  ];

  it.each(testCases)('%s', (_, start, end, expected) => {
    const actual = getBinaryCandidate(start as number, end as number);
    expect(actual).toBe(expected as number);
  });

  const errorTestCases = [
    ['should error if start is above end', 10, 5],
    ['should error if start is undefined', undefined, 5],
    ['should error if end is undefined', 10, undefined],
    ['should error if start and end are undefined', undefined, undefined],
  ];

  it.each(errorTestCases)('%s', (_, start, end) => {
    expect(() => getBinaryCandidate(start as number, end as number)).toThrow();
  });
});

describe('findTransition()', () => {
  const binaryTestCases: Array<[string, Array<0 | 1>, number | undefined]> = [
    ['should find transition from 0 to 1 in array', [0, 0, 0, 1, 1, 1], 3],
    ['should find transition at start of array', [1, 1, 1, 1], 0],
    ['should find transition at end of array', [0, 0, 0, 1], 3],
    ['should return undefined when no transition exists (all zeros)', [0, 0, 0, 0], undefined],
    ['should find transition in middle of array', [0, 0, 1, 1], 2],
    ['should handle single element array with 1', [1], 0],
    ['should handle single element array with 0', [0], undefined],
    ['should handle two element array with transition', [0, 1], 1],
  ];

  it.each(binaryTestCases)('%s', (_, array, expected) => {
    const actual = findTransition({ array, predicate: (value) => value === 1 });
    expect(actual).toBe(expected);
  });

  const derivedTestCases: Array<
    [string, readonly number[], (value: number, index: number, array: readonly number[]) => boolean, number]
  > = [
    ['should find transition using derived values', [1, 3, 5, 7, 9], (value) => value >= 5, 2],
    [
      'should find transition where the candidate jumps the transition point',
      Array.from({ length: 100 }, (_, index) => index + 1),
      (value) => value >= 75,
      74,
    ],
  ];

  it.each(derivedTestCases)('%s', (_, array, predicate, expected) => {
    const actual = findTransition({ array, predicate });
    expect(actual).toBe(expected);
  });

  it('should return undefined if there is no transition', () => {
    const predicate = () => false;
    const actual = findTransition({ array: [1, 2, 3, 4], predicate });
    expect(actual).toBeUndefined();
  });

  it('passes value, index and array to predicate', () => {
    const calls: Array<{ arrayLength: number; index: number; value: number }> = [];
    const actual = findTransition({
      array: [0, 0, 1],
      predicate: (value, index, array) => {
        calls.push({ arrayLength: array.length, index, value });
        return value === 1;
      },
    });

    expect(actual).toBe(2);
    expect(calls).toEqual([
      { arrayLength: 3, index: 1, value: 0 },
      { arrayLength: 3, index: 2, value: 1 },
    ]);
  });
});

describe('memoize()', () => {
  it('should memoize function results', () => {
    let callCount = 0;
    const fn = (args: { x: number }) => {
      callCount++;
      return args.x * 2;
    };

    const memoized = memoize(fn);

    expect(memoized({ x: 5 })).toBe(10);
    expect(memoized({ x: 5 })).toBe(10);
    expect(callCount).toBe(1); // Should only call original function once
  });

  it('should handle different arguments', () => {
    const fn = (args: { x: number }) => args.x * 2;
    const memoized = memoize(fn);

    expect(memoized({ x: 5 })).toBe(10);
    expect(memoized({ x: 10 })).toBe(20);
    expect(memoized({ x: 5 })).toBe(10);
  });

  it('should count executions when countExecutions is true', () => {
    const fn = (args: { x: number }) => args.x * 2;
    const memoized = memoize(fn, true) as typeof fn & { getCounts: () => Map<string, number> };

    memoized({ x: 5 });
    memoized({ x: 5 });
    memoized({ x: 10 });

    const counts = memoized.getCounts();
    expect(counts.get(JSON.stringify({ x: 5 }))).toBe(2);
    expect(counts.get(JSON.stringify({ x: 10 }))).toBe(1);
  });

  it('should not have getCounts when countExecutions is false', () => {
    const fn = (args: { x: number }) => args.x * 2;
    const memoized = memoize(fn, false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((memoized as any).getCounts).toBeUndefined();
  });

  it('should handle complex argument objects', () => {
    const fn = (args: { a: number; b: string }) => `${args.a}-${args.b}`;
    const memoized = memoize(fn);

    expect(memoized({ a: 1, b: 'test' })).toBe('1-test');
    expect(memoized({ a: 1, b: 'test' })).toBe('1-test');
  });
});
