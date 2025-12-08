import {
  ALL_VECTORS,
  getDataForPuzzle,
  type Grid,
  linesToStringGrid,
  logAnswer,
  type Point,
} from '../utils/index.js';

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

  const grid = linesToStringGrid(lines);
  let accessibleRolls = 0;
  for (const { point, value } of grid) {
    if (value === '.') {
      continue;
    }

    const neighbours = grid.getNeighbours(point, ALL_VECTORS);
    let paperNeighbours = 0;
    for (const nextNeighbour of neighbours) {
      if (nextNeighbour.value === '@') {
        paperNeighbours++;
      }
    }

    accessibleRolls += paperNeighbours < 4 ? 1 : 0;
  }

  logAnswer({
    answer: accessibleRolls,
    expected: USE_TEST_DATA ? 13 : 1_428,
    partNum: 1,
    taskStartedAt,
  });
};

const removeAccessibleRolls = (mutableGrid: Grid<string>): number => {
  const rollsToRemove: Point[] = [];
  for (const { point, value } of mutableGrid) {
    if (value === '.') {
      continue;
    }

    const neighbours = mutableGrid.getNeighbours(point, ALL_VECTORS);
    let paperNeighbours = 0;
    for (const nextNeighbour of neighbours) {
      if (nextNeighbour.value === '@') {
        paperNeighbours++;
      }
    }

    if (paperNeighbours < 4) {
      rollsToRemove.push(point);
    }
  }

  const numToRemove = rollsToRemove.length;
  for (const toRemove of rollsToRemove) {
    mutableGrid.set(toRemove, '.');
  }

  return numToRemove;
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const grid = linesToStringGrid(lines);
  let totalRemoved = 0;
  let keepRemoving = true;

  while (keepRemoving) {
    const numRemoved = removeAccessibleRolls(grid);
    totalRemoved += numRemoved;
    if (numRemoved === 0) {
      keepRemoving = false;
    }
  }

  logAnswer({
    answer: totalRemoved,
    expected: USE_TEST_DATA ? 43 : 8_936,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
