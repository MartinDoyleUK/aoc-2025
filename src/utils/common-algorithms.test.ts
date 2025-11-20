import { describe, expect, it } from 'vitest';

import { findTransitionByIndex, findTransitionPoint, getBinaryCandidate, memoize } from './common-algorithms.js';

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

describe('findTransitionByIndex()', () => {
  const testCases = [
    ['should find the transition point in an odd range', 1, 3, 2],
    ['should find the transition point in an even range', 1, 4, 3],
    ['should find the transition point where the candidate jumps the transition point', 1, 100, 74],
  ];

  it.each(testCases)('%s', (_, lower, upper, expected) => {
    const predicate = (input: number) => input >= (expected as number);
    const actual = findTransitionByIndex({
      lower: lower as number,
      predicate,
      upper: upper as number,
    });
    expect(actual).toBe(expected as number);
  });

  it('should return undefined if there is no transition', () => {
    const predicate = () => false;
    const actual = findTransitionByIndex({ lower: 1, predicate, upper: 10 });
    expect(actual).toBeUndefined();
  });
});

describe('findTransitionPoint()', () => {
  it('should find transition from 0 to 1 in array', () => {
    const array: Array<0 | 1> = [0, 0, 0, 1, 1, 1];
    expect(findTransitionPoint(array, array.length)).toBe(3);
  });

  it('should find transition at start of array', () => {
    const array: Array<0 | 1> = [1, 1, 1, 1];
    expect(findTransitionPoint(array, array.length)).toBe(0);
  });

  it('should find transition at end of array', () => {
    const array: Array<0 | 1> = [0, 0, 0, 1];
    expect(findTransitionPoint(array, array.length)).toBe(3);
  });

  it('should return -1 when no transition exists (all zeros)', () => {
    const array: Array<0 | 1> = [0, 0, 0, 0];
    expect(findTransitionPoint(array, array.length)).toBe(-1);
  });

  it('should find transition in middle of array', () => {
    const array: Array<0 | 1> = [0, 0, 1, 1];
    expect(findTransitionPoint(array, array.length)).toBe(2);
  });

  it('should handle single element array with 1', () => {
    const array: Array<0 | 1> = [1];
    expect(findTransitionPoint(array, array.length)).toBe(0);
  });

  it('should handle single element array with 0', () => {
    const array: Array<0 | 1> = [0];
    expect(findTransitionPoint(array, array.length)).toBe(-1);
  });

  it('should handle two element array with transition', () => {
    const array: Array<0 | 1> = [0, 1];
    expect(findTransitionPoint(array, array.length)).toBe(1);
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
