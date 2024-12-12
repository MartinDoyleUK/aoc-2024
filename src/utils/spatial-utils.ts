export type Grid<T = number | string> = T[][];

export type GridRef = {
  col: number;
  row: number;
};

export type Point = Symbol;

export type Vector = {
  col: number;
  row: number;
};

type IsWithinGridFn<T = number | string> = (pointOrGridRef: GridRef | Point, grid: Grid<T>) => boolean;

export const gridRefToPoint = ({ col, row }: GridRef): Point => {
  return Symbol.for(`${row},${col}`);
};

export const pointToGridRef = (pointSymbol: Point): GridRef => {
  const [row, col] = pointSymbol.description!.split(',').map(Number) as [number, number];
  return { col, row };
};

export const isWithinGrid: IsWithinGridFn = (pointOrGridRef, grid) => {
  const numRows = grid.length;
  const numCols = grid[0]!.length;
  const { col, row } =
    typeof pointOrGridRef === 'symbol' ? pointToGridRef(pointOrGridRef) : (pointOrGridRef as GridRef);
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
};
