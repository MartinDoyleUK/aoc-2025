import { beforeEach, describe, expect, it, vi } from 'vitest';

import { formatNum, timeSinceStarted } from './formatters.js';

describe('formatNum()', () => {
  it('formats numbers with en-GB defaults', () => {
    expect(formatNum(1_000)).toBe('1,000');
    expect(formatNum(1_000_000)).toBe('1,000,000');
  });

  it('formats using presets', () => {
    expect(formatNum(1_234.56, 'rounded')).toBe('1,235');
    expect(formatNum(1_234.56, 'oneDP')).toBe('1,234.6');
  });

  it('formats using custom options', () => {
    expect(formatNum(12.345, { maximumFractionDigits: 2, minimumFractionDigits: 2 })).toBe('12.35');
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
    vi.spyOn(performance, 'now').mockReturnValue(1_234.5);
    expect(timeSinceStarted(100)).toBe('1,135ms');
  });

  it('should display seconds with 1DP for durations under 10s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(7_500);
    expect(timeSinceStarted(100)).toBe('7.4secs');
  });

  it('should use formatDuration for longer durations', () => {
    // 65 seconds
    vi.spyOn(performance, 'now').mockReturnValue(65_100);
    const result = timeSinceStarted(100);
    expect(result).toContain('minute');
  });

  it('should handle exactly 1ms', () => {
    vi.spyOn(performance, 'now').mockReturnValue(101);
    expect(timeSinceStarted(100)).toBe('1ms');
  });

  it('should handle exactly 2s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(2_100);
    expect(timeSinceStarted(100)).toBe('2secs');
  });

  it('should handle exactly 10s', () => {
    vi.spyOn(performance, 'now').mockReturnValue(10_100);
    const result = timeSinceStarted(100);
    expect(result).toContain('second');
  });
});
