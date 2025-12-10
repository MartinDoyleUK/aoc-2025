/* eslint-disable no-bitwise */
import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type Machine = {
  buttons: number[];
  joltages: string;
  lights: number;
};

// Toggle this to use test or real data
const USE_TEST_DATA = true;

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

  const machines: Machine[] = lines.map((line) => {
    const lightsStr = line.slice(1, line.indexOf(']'));
    const lights = Number.parseInt(
      lightsStr
        .split('')
        .map((char) => (char === '.' ? 0 : 1))
        .toReversed()
        .join(''),
      2,
    );
    const buttons = line
      .slice(line.indexOf(']') + 2, line.indexOf('{') - 1)
      .split(' ')
      .map((buttonStr) => {
        const buttonIndices = buttonStr
          .slice(1, -1)
          .split(',')
          .map((numStr) => {
            const asNum = Number(numStr);
            const binaryChars = Array.from(
              { length: lightsStr.length },
              (_, idx) => (idx === asNum ? '1' : '0'),
            );

            return Number.parseInt(binaryChars.toReversed().join(''), 2);
          });
        // console.log('buttonIndices', buttonIndices);
        return buttonIndices.reduce((prev, next) => prev | next, 0);
      });
    const joltages = line.slice(line.indexOf('{') + 1, -1);

    return {
      buttons,
      joltages,
      lights,
    };
  });

  console.log('machines', machines);

  const minPressesPerMachine: number[] = machines.map(({ buttons, lights }) => {
    if (buttons.includes(lights)) {
      return 1;
    }

    // Need shortest path on a cyclic graph!!

    return 100;
  });

  console.log('minPressesPerMachine', minPressesPerMachine);

  const allMachinePresses = minPressesPerMachine.reduce(
    (prev, next) => prev + next,
    0,
  );

  logAnswer({
    answer: allMachinePresses,
    expected: USE_TEST_DATA ? 7 : undefined,
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

  logAnswer({
    answer: lines.length,
    expected: USE_TEST_DATA ? undefined : undefined,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
