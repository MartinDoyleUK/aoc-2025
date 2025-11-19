import { formatDuration, intervalToDuration } from 'date-fns';

export const NUMBER_FORMATTER = new Intl.NumberFormat('en-GB');

const ROUNDED_NUMBER_FORMATTER = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
});

const ONE_DP_FORMATTER = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 1,
});

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
