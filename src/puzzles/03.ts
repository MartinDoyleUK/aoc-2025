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

  let totalJoltage = 0;
  for (const line of lines) {
    const nums = line.split('').map(Number);
    let highestTen = nums.at(-1)!;
    let highestUnit = nums.at(-2)!;

    const sorted = nums.toSorted();
    const highestNum = sorted.at(-1)!;
    const highestNumPos = nums.lastIndexOf(highestNum);
    if (highestNumPos === nums.length - 1) {
      highestTen = sorted.at(-2)!;
      highestUnit = highestNum;
    } else {
      highestTen = highestNum;
      if (sorted.at(-2) === highestNum) {
        highestUnit = highestNum;
      } else {
        highestUnit = nums
          .slice(highestNumPos + 1)
          .toSorted()
          .at(-1)!;
      }
    }

    //     console.log(`${line}
    // highestPossible = ${sorted.slice(-2).toReversed().join('')}
    // highestNum = ${highestTen}${highestUnit}`);

    totalJoltage += highestTen * 10 + highestUnit;
  }

  logAnswer({
    answer: totalJoltage,
    expected: USE_TEST_DATA ? 357 : 17_158,
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

  let totalJoltage = 0;
  for (const line of lines) {
    // console.log('');
    // console.log(line);

    const nums = line.split('').map(Number);
    const finalVals = nums.slice(-12);

    let minPos = 0;
    for (let i = 12; i > 0; i--) {
      let iPos = nums.length - i;
      let iVal = nums.at(-i)!;
      // console.log('next i', { iPos, iVal, minPos });
      for (let j = iPos; j >= minPos; j--) {
        // console.log({ j, 'nums[j]': nums[j] });
        if (nums[j]! >= iVal) {
          iVal = nums[j]!;
          iPos = j;
        }
      }

      // console.log({ iPos, iVal });

      finalVals[12 - i] = iVal;
      minPos = iPos + 1;
    }

    //     console.log(`${line}
    // highestPossible = ${sorted.slice(-2).toReversed().join('')}
    // highestNum = ${highestTen}${highestUnit}`);

    const highestVal = Number(finalVals.join(''));

    // console.log({ highestVal });

    totalJoltage += highestVal;
  }

  logAnswer({
    answer: totalJoltage,
    expected: USE_TEST_DATA ? 3_121_910_778_619 : 170_449_335_646_486,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
