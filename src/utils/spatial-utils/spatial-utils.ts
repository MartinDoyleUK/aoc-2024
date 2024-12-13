import { Grid } from './grid.js';

export const linesToNumberGrid = (lines: string[]): Grid<number> => {
  return new Grid<number>(lines.map((nextLine) => nextLine.split('').map(Number)));
};

export const linesToStringGrid = (lines: string[]): Grid<string> => {
  return new Grid<string>(lines.map((nextLine) => nextLine.split('')));
};
