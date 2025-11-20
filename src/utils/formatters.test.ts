import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NUMBER_FORMATTER, timeSinceStarted } from './formatters.js';

describe('NUMBER_FORMATTER', () => {
  it('should format numbers with commas', () => {
    expect(NUMBER_FORMATTER.format(1000)).toBe('1,000');
    expect(NUMBER_FORMATTER.format(1000000)).toBe('1,000,000');
  });
});

describe('timeSinceStarted()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display microseconds for sub-millisecond durations', () => {
    vi.spyOn(performance, 'now').mockReturnValue(100.5);
    expect(timeSinceStarted(100)).toBe('500µs');
  });

  it('should display milliseconds with 1DP for durations under 5ms', () => {
    vi.spyOn(performance, 'now').mockReturnValue(103.7);
    expect(timeSinceStarted(100)).toBe('3.7ms');
  });

  it('should display rounded milliseconds for durations under 2s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(1234.5);
    expect(timeSinceStarted(100)).toBe('1,135ms');
  });

  it('should display seconds with 1DP for durations under 10s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(7500);
    expect(timeSinceStarted(100)).toBe('7.4secs');
  });

  it('should use formatDuration for longer durations', () => {
    // 65 seconds
    vi.spyOn(performance, 'now').mockReturnValue(65100);
    const result = timeSinceStarted(100);
    expect(result).toContain('minute');
  });

  it('should handle exactly 1ms', () => {
    vi.spyOn(performance, 'now').mockReturnValue(101);
    expect(timeSinceStarted(100)).toBe('1ms');
  });

  it('should handle exactly 2s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(2100);
    expect(timeSinceStarted(100)).toBe('2secs');
  });

  it('should handle exactly 10s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(10100);
    const result = timeSinceStarted(100);
    expect(result).toContain('second');
  });
});
