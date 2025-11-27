import { formatDuration, intervalToDuration } from 'date-fns';

/**
 * Shared number formatter used for human-readable output (e.g. answers).
 * Uses the `en-GB` locale so thousands are separated with commas:
 * `1,000`, `1,000,000`, etc.
 */
export const NUMBER_FORMATTER = new Intl.NumberFormat('en-GB');

const ROUNDED_NUMBER_FORMATTER = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
});

const ONE_DP_FORMATTER = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 1,
});

/**
 * Format the time elapsed since a given start point into a friendly string.
 * The output automatically chooses the most appropriate unit:
 * - `< 1ms`  → microseconds (e.g. `"500µs"`)
 * - `< 5ms`  → milliseconds to 1dp (e.g. `"3.7ms"`)
 * - `< 2s`   → rounded milliseconds (e.g. `"1,135ms"`)
 * - `< 10s`  → seconds to 1dp (e.g. `"7.4secs"`)
 * - `>= 10s` → a humanised duration (e.g. `"1 minute"`).
 * @param timeStarted - A high-resolution timestamp, typically from `performance.now()`.
 * @returns A human-readable duration string.
 * @example
 * const started = performance.now();
 * // ... run some work ...
 * console.log(timeSinceStarted(started)); // "2.3ms", "711ms", "1.2secs", etc.
 */
export const timeSinceStarted = (timeStarted: number) => {
  const now = performance.now();

  // If less than 1ms then display in microseconds
  if (now - timeStarted < 1) {
    return ROUNDED_NUMBER_FORMATTER.format((now - timeStarted) * 1_000) + 'µs';
  }

  // If less than 5ms then display in milliseconds to 1DP
  if (now - timeStarted < 5) {
    return ONE_DP_FORMATTER.format(now - timeStarted) + 'ms';
  }

  // If less than 2s then display in milliseconds
  if (now - timeStarted < 1_000 * 2) {
    return ROUNDED_NUMBER_FORMATTER.format(now - timeStarted) + 'ms';
  }

  // If less than 10s then display in seconds to 1DP
  if (now - timeStarted < 1_000 * 10) {
    return ONE_DP_FORMATTER.format((now - timeStarted) / 1_000) + 'secs';
  }

  const startDate = new Date(timeStarted);
  const endDate = new Date(now);
  const duration = intervalToDuration({ end: endDate, start: startDate });

  return formatDuration(duration);
};
