import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const firstCol: number[] = [];
  const secondCol: number[] = [];
  for (const nextLine of lines) {
    const [first, second] = nextLine.split(/ +/u);
    firstCol.push(Number.parseInt(first!, 10));
    secondCol.push(Number.parseInt(second!, 10));
  }

  firstCol.sort((a, b) => a - b);
  secondCol.sort((a, b) => a - b);

  let total = 0;
  for (let index = 0; index < firstCol.length; index++) {
    total += Math.abs(firstCol[index]! - secondCol[index]!);
  }

  logAnswer({
    answer: total,
    expected: USE_TEST_DATA ? 11 : 1_579_939,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let similarity = 0;
  const occurrenceCount = new Map<number, number>();

  const firstCol: number[] = [];
  for (const nextLine of lines) {
    const [first, second] = nextLine.split(/ +/u);
    firstCol.push(Number.parseInt(first!, 10));

    const secondNumber = Number.parseInt(second!, 10);
    const previousOccurrence = occurrenceCount.get(secondNumber) ?? 0;
    occurrenceCount.set(secondNumber, previousOccurrence + 1);
  }

  for (const nextNumber of firstCol) {
    similarity += nextNumber * (occurrenceCount.get(nextNumber) ?? 0);
  }

  logAnswer({
    answer: similarity,
    expected: USE_TEST_DATA ? 31 : 20_351_745,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
