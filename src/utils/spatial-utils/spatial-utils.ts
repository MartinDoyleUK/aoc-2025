import { Grid } from './grid.js';

export const POINT_REGEX = /^(\d+),(\d+)$/u;

export const linesToNumberGrid = (lines: string[]): Grid<number> => {
  return new Grid<number>(lines.map((nextLine) => nextLine.split('').map(Number)));
};

export const linesToStringGrid = (lines: string[]): Grid<string> => {
  return new Grid<string>(lines.map((nextLine) => nextLine.split('')));
};

export const linesToCustomGrid = <TGridData>(
  lines: string[],
  transform: (rawValue: string) => TGridData,
): Grid<TGridData> => {
  return new Grid<TGridData>(lines.map((nextLine) => nextLine.split('').map(transform)));
};
