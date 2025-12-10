/* eslint-disable no-bitwise */
import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type Machine = {
  buttons: number[];
  joltages: string;
  lights: number;
};

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

  // console.log('');

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

  // console.log('machines', machines);
  // console.log('');

  const MAX_DEPTH = 15;
  const minPressesPerMachine: number[] = machines.map(
    ({ buttons, lights: lightsTarget }, machineIdx) => {
      if (buttons.includes(lightsTarget)) {
        return 1;
      }

      const visited = new Set<number>();
      const queue: { count: number; state: number }[] = [
        { count: 0, state: 0 },
      ];

      while (queue.length > 0) {
        const { count, state } = queue.shift()!;
        if (visited.has(state)) {
          continue;
        }

        visited.add(state);
        if (state === lightsTarget) {
          return count;
        }

        if (count >= MAX_DEPTH) {
          continue;
        }

        for (const button of buttons) {
          queue.push({ count: count + 1, state: state ^ button });
        }
      }

      throw new Error(
        `Could not reach target for machine ${machineIdx} within depth ${MAX_DEPTH}`,
      );
    },
  );

  // console.log('minPressesPerMachine', minPressesPerMachine);

  const allMachinePresses = minPressesPerMachine.reduce(
    (prev, next) => prev + next,
    0,
  );

  // console.log('');

  logAnswer({
    answer: allMachinePresses,
    expected: USE_TEST_DATA ? 7 : 538,
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
