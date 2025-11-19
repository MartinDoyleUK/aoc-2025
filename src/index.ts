import fs from 'node:fs/promises';
import path from 'node:path';

import { logComplete, logError, logPuzzleDay, logStart, logTime } from './utils/index.js';

const HERE = path.dirname(import.meta.url).slice('file:'.length);
const DAY_REGEX = /(\d{2})\.js$/u;

const sortStringsNumerically = (a: string, b: string) => {
  const aNumber = Number.parseInt(a, 10);
  const bNumber = Number.parseInt(b, 10);
  return aNumber - bNumber;
};

const run = async () => {
  const whichPuzzlesArg = process.argv.at(2)?.trim();
  const puzzlesArgAsNum = Number(whichPuzzlesArg);
  let puzzleArgIsNum = false;
  let whichPuzzles: 'all' | 'latest' | number;
  if (whichPuzzlesArg === undefined) {
    whichPuzzles = 'latest';
  } else if (Number.isNaN(puzzlesArgAsNum)) {
    if (whichPuzzlesArg !== 'all' && whichPuzzlesArg !== 'latest') {
      throw new Error(
        `Must supply one of "latest", "all" or valid puzzle number (was called with "${whichPuzzlesArg}")`,
      );
    }

    whichPuzzles = whichPuzzlesArg;
  } else {
    if (Math.round(puzzlesArgAsNum) !== puzzlesArgAsNum || puzzlesArgAsNum < 1 || puzzlesArgAsNum > 24) {
      throw new Error(
        `Must supply one of "latest", "all" or valid puzzle number (was called with "${whichPuzzlesArg}")`,
      );
    }

    puzzleArgIsNum = true;
    whichPuzzles = puzzlesArgAsNum;
  }

  // Get all of the puzzle days
  const puzzlesPath = path.join(HERE, 'puzzles');
  const puzzleDirContents = (await fs.readdir(puzzlesPath)).toSorted(sortStringsNumerically);

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
  const endIndex = puzzleArgIsNum ? (whichPuzzles as number) : allPuzzlePaths.length;
  const startIndex = whichPuzzles === 'all' ? 0 : endIndex - 1;
  for (let index = startIndex; index < endIndex; index++) {
    const nextPuzzlePath = allPuzzlePaths[index]!;
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
});
