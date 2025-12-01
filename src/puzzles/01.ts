import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const rotate = (start: number, dist: number, dir: 'left' | 'right'): { newPos: number; seenZero: number } => {
  const realDist = dist % 100;
  const fullRotations = (dist - realDist) / 100;

  let seenZero = fullRotations;
  let newPos = dir === 'left' ? start - realDist : start + realDist;
  if (newPos < 0) {
    if (start !== 0) {
      seenZero++;
    }

    newPos = 100 + newPos;
  } else if (newPos >= 100) {
    if (start !== 0) {
      seenZero++;
    }

    newPos -= 100;
  } else if (newPos === 0) {
    seenZero++;
  }

  // console.log(`rotate(${start}, ${dist}, ${dir}) = { newPos: ${newPos}, seenZero: ${seenZero} }`);

  return { newPos, seenZero };
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let dialPos = 50;
  let numZeroes = 0;
  for (const line of lines) {
    const dir = line.slice(0, 1) === 'L' ? 'left' : 'right';
    const dist = Number(line.slice(1));
    const { newPos } = rotate(dialPos, dist, dir);

    dialPos = newPos;
    if (dialPos === 0) {
      numZeroes++;
    }
  }

  logAnswer({
    answer: numZeroes,
    expected: USE_TEST_DATA ? 3 : 982,
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

  let dialPos = 50;
  let numZeroes = 0;
  for (const line of lines) {
    const dir = line.slice(0, 1) === 'L' ? 'left' : 'right';
    const dist = Number(line.slice(1));
    const { newPos, seenZero } = rotate(dialPos, dist, dir);

    dialPos = newPos;
    numZeroes += seenZero;
  }

  logAnswer({
    answer: numZeroes,
    expected: USE_TEST_DATA ? 6 : 6_106,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
