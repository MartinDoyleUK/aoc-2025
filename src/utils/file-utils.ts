import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

type GetDataForPuzzleFn = (importUrl: string) => { REAL: string; TEST1: string; TEST2: string };

// import.meta.dirname is dist/utils, so go up to dist/, then up to project root, then to inputs/
const INPUTS_ROOTDIR = path.resolve(import.meta.dirname, '../../inputs');
const PUZZLE_NUM_REGEX = /(\d{2}).js$/u;

export const getDataForPuzzle: GetDataForPuzzleFn = (importUrl) => {
  // Work out where to get the puzzle inputs
  const puzzleFilename = url.fileURLToPath(importUrl);
  const [, dayNum] = puzzleFilename.match(PUZZLE_NUM_REGEX)!;
  const inputsFolder = path.join(INPUTS_ROOTDIR, dayNum!);
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
