import { describe, expect, it } from 'vitest';

import { memoize, noop } from './function-utils.js';

describe('noop()', () => {
  it('should be a function', () => {
    expect(typeof noop).toBe('function');
  });

  it('should not throw when called', () => {
    expect(() => noop()).not.toThrow();
  });

  it('should return undefined', () => {
    expect(noop()).toBeUndefined();
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
