import { type Point } from '../types/index.js';

type IsPointWithinGridFn = (params: { grid: string[]; point: Point }) => boolean;

export const pointToString = ({ col, row }: Point): string => {
  return `${row},${col}`;
};

export const stringToPoint = (point: string): Point => {
  const [row, col] = point.split(',').map((rowOrCol) => Number.parseInt(rowOrCol, 10)) as [number, number];
  return { col, row };
};

export const isPointWithinGrid: IsPointWithinGridFn = ({ grid, point }) => {
  const numRows = grid.length;
  const numCols = grid[0]!.length;
  const { col, row } = point;
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
};
