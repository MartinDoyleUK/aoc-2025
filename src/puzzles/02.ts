import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const firstLine = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  const ranges = firstLine!.split(',').map((range) => range.split('-').map(Number) as [number, number]);
  const invalidIds: number[] = [];
  for (const range of ranges) {
    for (let idNum = range[0]; idNum <= range[1]; idNum++) {
      const idStr = String(idNum);
      const len = idStr.length;
      if (len % 2 === 0 && idStr.slice(0, len / 2) === idStr.slice(len / 2)) {
        invalidIds.push(idNum);
      }
    }
  }

  const sumInvalidIds = invalidIds.reduce((prev, next) => prev + next, 0);

  logAnswer({
    answer: sumInvalidIds,
    expected: USE_TEST_DATA ? 1_227_775_554 : 38_310_256_125,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const firstLine = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  const isInvalid = (idNum: number): boolean => {
    const idStr = String(idNum);
    const len = idStr.length;

    let isRepeated = false;
    for (let numRepeats = 2; numRepeats <= len; numRepeats++) {
      if (len % numRepeats === 0) {
        const repeatStr = idStr.slice(0, len / numRepeats);
        const candidate = Array.from({ length: numRepeats }).fill(repeatStr).join('');
        // console.log({ candidate, idNum, numRepeats, repeatStr });
        if (candidate === idStr) {
          isRepeated = true;
          break;
        }
      }
    }

    // console.log(`${idNum} ${isRepeated ? 'IS' : 'is NOT'} repeated`);

    return isRepeated;
  };

  const ranges = firstLine!.split(',').map((range) => range.split('-').map(Number) as [number, number]);
  const invalidIds: number[] = [];
  for (const range of ranges) {
    for (let idNum = range[0]; idNum <= range[1]; idNum++) {
      if (isInvalid(idNum)) {
        invalidIds.push(idNum);
      }
    }
  }

  const sumInvalidIds = invalidIds.reduce((prev, next) => prev + next, 0);

  logAnswer({
    answer: sumInvalidIds,
    expected: USE_TEST_DATA ? 4_174_379_265 : 58_961_152_806,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
