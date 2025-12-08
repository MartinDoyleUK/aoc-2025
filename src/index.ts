import fs from 'node:fs/promises';
import path from 'node:path';

import {
  logComplete,
  logError,
  logInfo,
  logPuzzleDay,
  logStart,
  logTime,
} from './utils/index.js';

const HERE = import.meta.dirname;
const DAY_REGEX = /(\d{2})\.js$/u;

const sortStringsNumerically = (a: string, b: string) => {
  const aNumber = Number.parseInt(a, 10);
  const bNumber = Number.parseInt(b, 10);
  return aNumber - bNumber;
};

const run = async () => {
  const whichPuzzlesArg = process.argv.at(2)?.trim();

  if (!whichPuzzlesArg) {
    throw new Error(
      'Must supply one of "latest", "all" or a valid puzzle number',
    );
  }

  let puzzleArgIsNum = false;
  let whichPuzzles: 'all' | 'latest' | number;
  if (whichPuzzlesArg === 'all' || whichPuzzlesArg === 'latest') {
    whichPuzzles = whichPuzzlesArg;
  } else {
    const puzzlesArgAsNum = Number(whichPuzzlesArg);
    if (
      !Number.isSafeInteger(puzzlesArgAsNum) ||
      puzzlesArgAsNum < 1 ||
      puzzlesArgAsNum > 12
    ) {
      throw new Error(
        `Must supply one of "latest", "all" or valid puzzle number (was called with "${whichPuzzlesArg}")`,
      );
    }

    puzzleArgIsNum = true;
    whichPuzzles = puzzlesArgAsNum;
  }

  // Get all of the puzzle days
  const puzzlesPath = path.join(HERE, 'puzzles');
  const puzzleDirContents = (await fs.readdir(puzzlesPath)).toSorted(
    sortStringsNumerically,
  );

  // Get the paths to the puzzles
  const allPuzzlePaths = [];
  for (const nextItem of puzzleDirContents) {
    if (!DAY_REGEX.test(nextItem)) {
      continue;
    }

    const nextDayPath = path.join(puzzlesPath, nextItem);
    allPuzzlePaths.push(nextDayPath);
  }

  if (puzzleArgIsNum && (whichPuzzles as number) > allPuzzlePaths.length) {
    throw new Error(`Puzzle ${whichPuzzles} not found!`);
  }

  // Run through puzzles
  logStart();
  const beforeAll = performance.now();
  if (allPuzzlePaths.length === 0) {
    logInfo(
      'No puzzles found. Add files like "01.ts" to src/puzzles and rebuild.',
    );
    logComplete(beforeAll);
    return;
  }

  const endIndex = puzzleArgIsNum
    ? (whichPuzzles as number)
    : allPuzzlePaths.length;
  const startIndex = whichPuzzles === 'all' ? 0 : endIndex - 1;
  for (let index = startIndex; index < endIndex; index++) {
    const nextPuzzlePath = allPuzzlePaths[index];
    if (!nextPuzzlePath) {
      logError(`Puzzle at index ${index} not found`);
      continue;
    }

    const [, day] = DAY_REGEX.exec(nextPuzzlePath) ?? [];
    if (!day) {
      logError(`Could not determine day from path "${nextPuzzlePath}"`);
      continue;
    }

    const { runTasks } = await import(nextPuzzlePath);
    logPuzzleDay(day, index === startIndex);
    const before = performance.now();
    await runTasks();
    logTime(before, day);
  }

  // Finish up with nice message
  logComplete(beforeAll);
};

run().catch((error) => {
  logError('Error running program', error);
  process.exitCode = 1;
});
