/* eslint-disable unicorn/no-array-reduce */
import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const colOffsetLens: [number, number][] = [];
  const minLinLen = lines.reduce(
    (prev, next) => Math.min(prev, next.length),
    Number.MAX_SAFE_INTEGER,
  );
  let lastSpace = 0;
  for (let i = 0; i < minLinLen; i++) {
    if (lines.every((nextLine) => nextLine.at(i) === ' ')) {
      colOffsetLens.push([lastSpace, i]);
      lastSpace = i;
    }
  }

  const getEntry = (line: string, start: number, end?: number): string => {
    return line.slice(start, end).trim();
  };

  const operators = lines.pop()!;
  let resultsSum = 0;
  for (const [start, end] of colOffsetLens) {
    const operator = getEntry(operators, start, end);
    const isSum = operator === '+';
    const result = lines.reduce(
      (prev, next) => {
        const nextOperand = Number(getEntry(next, start, end));
        return isSum ? prev + nextOperand : prev * nextOperand;
      },
      isSum ? 0 : 1,
    );
    resultsSum += result;
  }

  const finalOperator = getEntry(operators, lastSpace);
  const isFinalSum = finalOperator === '+';
  const finalResult = lines.reduce(
    (prev, next) => {
      const nextOperand = Number(getEntry(next, lastSpace));
      return isFinalSum ? prev + nextOperand : prev * nextOperand;
    },
    isFinalSum ? 0 : 1,
  );
  resultsSum += finalResult;

  logAnswer({
    answer: resultsSum,
    expected: USE_TEST_DATA ? 4_277_556 : 5_322_004_718_681,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const colOffsetLens: [number, number][] = [];
  const minLinLen = lines.reduce(
    (prev, next) => Math.min(prev, next.length),
    Number.MAX_SAFE_INTEGER,
  );
  let lastSpace = -1;
  for (let i = 0; i < minLinLen; i++) {
    if (lines.every((nextLine) => nextLine.at(i) === ' ')) {
      colOffsetLens.push([lastSpace + 1, i]);
      lastSpace = i;
    }
  }

  const getEntry = (line: string, start: number, end?: number): string => {
    return line.slice(start, end);
  };

  const operators = lines.pop()!;
  let resultsSum = 0;
  for (const [start, end] of colOffsetLens) {
    const operator = getEntry(operators, start, end);
    const isSum = operator.trim() === '+';

    const constructedNums: number[][] = [];
    for (const line of lines) {
      const nextRow = getEntry(line, start, end);
      for (let i = 0; i < nextRow.length; i++) {
        const char = nextRow.at(i);
        if (char !== ' ') {
          const colNums = constructedNums[i] ?? [];
          colNums.push(Number(char));
          constructedNums[i] = colNums;
        }
      }
    }

    const result = constructedNums
      .map((nums) => Number(nums.join('')))
      .reduce(
        (prev, next) => (isSum ? prev + next : prev * next),
        isSum ? 0 : 1,
      );
    // console.log({ constructedNums, isSum, result });
    resultsSum += result;
  }

  console.log('nan?', Number.isInteger(' '));

  const finalOperator = getEntry(operators, lastSpace);
  const isFinalSum = finalOperator.trim() === '+';
  const finalConstructedNums: number[][] = [];
  for (const line of lines) {
    const nextRow = getEntry(line, lastSpace + 1);
    for (let i = 0; i < nextRow.length; i++) {
      const char = nextRow.at(i);
      if (char !== ' ') {
        const colNums = finalConstructedNums[i] ?? [];
        colNums.push(Number(char));
        finalConstructedNums[i] = colNums;
      }
    }
  }

  const finalResult = finalConstructedNums
    .map((nums) => Number(nums.join('')))
    .reduce(
      (prev, next) => (isFinalSum ? prev + next : prev * next),
      isFinalSum ? 0 : 1,
    );
  resultsSum += finalResult;

  logAnswer({
    answer: resultsSum,
    expected: USE_TEST_DATA ? 3_263_827 : 9_876_636_978_528,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
