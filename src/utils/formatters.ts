import { formatDuration, intervalToDuration } from 'date-fns';

type FormatOptions = FormatPreset | Intl.NumberFormatOptions;
type FormatPreset = 'oneDP' | 'rounded';

const LOCALE = 'en-GB';
const PRESETS: Record<
  Extract<FormatPreset, FormatPreset>,
  Intl.NumberFormatOptions
> = {
  oneDP: { maximumFractionDigits: 1 },
  rounded: { maximumFractionDigits: 0 },
};

const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (
  options?: Intl.NumberFormatOptions,
): Intl.NumberFormat => {
  const cacheKey = JSON.stringify(options ?? {});
  const cached = formatterCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.NumberFormat(LOCALE, options);
  formatterCache.set(cacheKey, formatter);
  return formatter;
};

const resolveOptions = (
  formatOptions?: FormatOptions,
): Intl.NumberFormatOptions | undefined => {
  if (formatOptions === undefined) {
    return undefined;
  }

  if (typeof formatOptions === 'string') {
    return PRESETS[formatOptions];
  }

  return formatOptions;
};

/**
 * Format a number using an `en-GB` `Intl.NumberFormat`.
 * @param value - The number to format.
 * @param formatOptions - Either a preset (`'rounded'` or `'oneDP'`) or options passed to `Intl.NumberFormat`.
 * @returns The formatted number string.
 * @example
 * formatNum(1234); // "1,234"
 * formatNum(1234.56, 'rounded'); // "1,235"
 * formatNum(12.34, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // "12.34"
 */
export const formatNum = (
  value: number,
  formatOptions?: FormatOptions,
): string => {
  const formatter = getFormatter(resolveOptions(formatOptions));
  return formatter.format(value);
};

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
    return formatNum((now - timeStarted) * 1_000, 'rounded') + 'µs';
  }

  // If less than 5ms then display in milliseconds to 1DP
  if (now - timeStarted < 5) {
    return formatNum(now - timeStarted, 'oneDP') + 'ms';
  }

  // If less than 2s then display in milliseconds
  if (now - timeStarted < 1_000 * 2) {
    return formatNum(now - timeStarted, 'rounded') + 'ms';
  }

  // If less than 10s then display in seconds to 1DP
  if (now - timeStarted < 1_000 * 10) {
    return formatNum((now - timeStarted) / 1_000, 'oneDP') + 'secs';
  }

  // Calculate duration from milliseconds difference
  const durationMs = now - timeStarted;
  const duration = intervalToDuration({ end: durationMs, start: 0 });

  return formatDuration(duration);
};
