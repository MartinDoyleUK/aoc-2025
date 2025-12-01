/* eslint-disable no-console */

import chalk from 'chalk';
import _ from 'lodash';
import numberToWords from 'number-to-words';

import { formatNum, timeSinceStarted } from './formatters.js';

type LogAnswerFunction = (args: {
  answer: unknown;
  expected?: unknown;
  partNum: PartNumber;
  taskStartedAt: number;
}) => void;

type PartNumber = 1 | 2;

/**
 * Log a nicely formatted heading for a given puzzle day.
 * @param day - The day number as a string, e.g. `"1"` or `"25"`.
 * @param isFirst - Whether this is the first day being logged in the current run.
 */
export const logPuzzleDay = (day: string, isFirst = true) => {
  const dayWords = numberToWords.toWordsOrdinal(day);

  if (!isFirst) {
    console.info('');
  }

  console.info(
    chalk.bold.green(`
Running ${dayWords} day of Advent of Code ...`),
  );
};

/**
 * Log the answer to a puzzle part along with timing information.
 * If `expected` is provided, the output will include a green check or red cross
 * depending on whether the answer matches. When `expected` is a function, it
 * is treated as a validation helper that returns `true` or `false`.
 * @param args - Details about the answer and how to validate and display it.
 * @param args.answer - The computed answer (number or any printable value).
 * @param args.expected - An expected value or a validation function.
 * @param args.partNum - The part number (1 or 2).
 * @param args.taskStartedAt - A timestamp from `performance.now()` taken before the work started.
 * @example
 * // Simple equality check
 * logAnswer({
 *   answer: 42,
 *   expected: 42,
 *   partNum: 1,
 *   taskStartedAt: performance.now(),
 * });
 * // Custom verification function
 * logAnswer({
 *   answer: 'abc',
 *   expected: (value) => typeof value === 'string' && value.length === 3,
 *   partNum: 2,
 *   taskStartedAt: performance.now(),
 * });
 */
export const logAnswer: LogAnswerFunction = ({ answer, expected: expectedParameter, partNum, taskStartedAt }) => {
  const timeTaken = timeSinceStarted(taskStartedAt);
  const partText = `${_.capitalize(numberToWords.toWordsOrdinal(partNum))} part took ${timeTaken}`;
  let answerText: string;
  if (typeof answer === 'number') {
    const formatted = formatNum(answer);
    const raw = `${answer}`;
    answerText = `Answer is ${formatted}`;
    if (formatted !== raw) {
      answerText += ` (${raw})`;
    }
  } else {
    answerText = `Answer is ${answer}`;
  }

  if (expectedParameter === undefined) {
    answerText += '❔';
  } else {
    let isExpected = answer === expectedParameter;
    if (typeof expectedParameter === 'function') {
      isExpected = expectedParameter(answer) === true;
    }

    let expectedDisplayValue = expectedParameter;
    if (typeof expectedParameter === 'function') {
      expectedDisplayValue = 'verify-function result';
    }

    const colourFunction = isExpected ? chalk.reset.green : chalk.reset.red;
    answerText += colourFunction(isExpected ? ' ✅' : ` ❌ (should equal ${JSON.stringify(expectedDisplayValue)})`);
  }

  const messageParts = [chalk.bold.cyan(partText), '➡️ ', chalk.bold.yellow(answerText)];
  console.info(messageParts.join(' '));
};

/**
 * Log the total time taken to run all tasks for a specific day.
 * @param before - A timestamp from `performance.now()` taken before the day started.
 * @param dayString - The day number as a string, used for human-readable output.
 */
export const logTime = (before: number, dayString: string) => {
  const timeTaken = timeSinceStarted(before);
  console.info(chalk.green(`Took ${timeTaken} to run all tasks for day ${numberToWords.toWords(dayString)}`));
};

/**
 * Log a summary line for the complete run across all puzzles.
 * @param before - A timestamp from `performance.now()` taken before the run started.
 */
export const logComplete = (before: number) => {
  const timeTaken = timeSinceStarted(before);
  const completedMessage = ` All completed in ${timeTaken}`;
  const message = `
=== ${completedMessage} ===
`;
  console.info(message);
};

/**
 * Log a simple banner indicating that puzzle execution is starting.
 */
export const logStart = () => {
  console.info(`
=== Starting puzzle run ===`);
};

/**
 * Log an error with an optional associated `Error` object.
 * @param label - A short description of the error.
 * @param error - The error instance, if available.
 */
export const logError = (label: string, error?: Error) => {
  console.info(chalk.bold.red(label), error);
};

/**
 * Convenience wrapper around `console.info`.
 * @param args - Arguments to forward to `console.info`.
 */
export const logInfo = (...args: any[]) => {
  console.info(...args);
};
