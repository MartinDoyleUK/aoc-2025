import { describe, expect, it } from 'vitest';

import { noop } from './function-utils.js';

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
