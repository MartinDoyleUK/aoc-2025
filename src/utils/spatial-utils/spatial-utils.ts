import { Grid } from './grid.js';

/**
 * Regular expression for coordinates in `"row,col"` format.
 * Accepts optional leading `+`/`-` signs for both row and column, e.g.:
 * `"0,0"`, `"-1,+2"`, `"+3,-4"`.
 */
export const POINT_REGEX = /^([+-]?\d+),([+-]?\d+)$/u;

/**
 * Convert an array of strings into a grid of numbers.
 * Each character in the input lines is parsed with `Number`, so this works
 * best with digit-only inputs.
 * @param lines - Lines of text representing the grid rows.
 * @returns A `Grid<number>` instance.
 * @example
 * const lines = ['123', '456'];
 * const grid = linesToNumberGrid(lines);
 * grid.at(new Point({ row: 0, col: 1 })); // => 2
 */
export const linesToNumberGrid = (lines: string[]): Grid<number> => {
  return new Grid<number>(
    lines.map((nextLine) => nextLine.split('').map(Number)),
  );
};

/**
 * Convert an array of strings into a grid of single-character strings.
 * @param lines - Lines of text representing the grid rows.
 * @returns A `Grid<string>` instance.
 * @example
 * const lines = ['abc', 'def'];
 * const grid = linesToStringGrid(lines);
 * grid.at(new Point({ row: 1, col: 0 })); // => 'd'
 */
export const linesToStringGrid = (lines: string[]): Grid<string> => {
  return new Grid<string>(lines.map((nextLine) => nextLine.split('')));
};

/**
 * Convert an array of strings into a grid of custom values using a transform function.
 * @template TGridData - The type of the grid values after transformation.
 * @param lines - Lines of text representing the grid rows.
 * @param transform - A function applied to each raw character.
 * @returns A `Grid<TGridData>` instance.
 * @example
 * // Mark trees vs. empty spaces
 * const lines = ['.#.', '##.'];
 * const grid = linesToCustomGrid(lines, (char) => char === '#');
 * grid.at(new Point({ row: 0, col: 1 })); // => true
 */
export const linesToCustomGrid = <TGridData>(
  lines: string[],
  transform: (rawValue: string) => TGridData,
): Grid<TGridData> => {
  return new Grid<TGridData>(
    lines.map((nextLine) => nextLine.split('').map(transform)),
  );
};
