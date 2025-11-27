import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

type GetDataForPuzzleFn = (importUrl: string) => { REAL: string; TEST1: string; TEST2: string };

const INPUTS_ROOTDIR = path.resolve(import.meta.dirname, '../../inputs');
const PUZZLE_NUM_REGEX = /(\d{2}).js$/u;

/**
 * Load Advent of Code input files for a given puzzle module.
 * The function infers the day number from the calling module's file URL
 * (e.g. `.../puzzles/01.js`) and reads the corresponding input files from
 * the `inputs/<day>/` directory.
 * @param importUrl - Typically `import.meta.url` from a puzzle implementation.
 * @returns An object containing the real input and two test inputs.
 * @example
 * ```ts
 * // In src/puzzles/01.ts
 * import { getDataForPuzzle } from '../utils/index.js';
 *
 * const { REAL, TEST1, TEST2 } = getDataForPuzzle(import.meta.url);
 * ```
 */
export const getDataForPuzzle: GetDataForPuzzleFn = (importUrl) => {
  // Work out where to get the puzzle inputs
  const puzzleFilename = url.fileURLToPath(importUrl);
  const [, dayNum] = puzzleFilename.match(PUZZLE_NUM_REGEX) ?? [];
  if (!dayNum) {
    throw new Error(`Could not extract day number from puzzle filename: ${puzzleFilename}`);
  }

  const inputsFolder = path.join(INPUTS_ROOTDIR, dayNum);
  const paths = {
    DATA: path.join(inputsFolder, 'data.txt'),
    TEST_DATA_01: path.join(inputsFolder, 'test-data-01.txt'),
    TEST_DATA_02: path.join(inputsFolder, 'test-data-02.txt'),
  };

  return {
    REAL: fs.readFileSync(paths.DATA, 'utf8') as string,
    TEST1: fs.readFileSync(paths.TEST_DATA_01, 'utf8') as string,
    TEST2: fs.readFileSync(paths.TEST_DATA_02, 'utf8') as string,
  };
};
