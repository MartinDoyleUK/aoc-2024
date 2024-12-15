import { Point } from './point.js';
import { type Vector, VECTORS } from './vector.js';

type GridDataMap<TGridData> = Map<number, Map<number, TGridData>>;

type GridTraversalFn<TCustomContext, TGridData> = (
  startAt: Point,
  traversalType: 'bfs' | 'dfs',
  options?: {
    customContext?: TCustomContext;
    directions?: Vector[];
    onVisit?: (context: StandardTraversalContext<TGridData> & TCustomContext) => boolean;
    shouldVisit?: (context: StandardTraversalContext<TGridData> & TCustomContext) => boolean;
  },
) => StandardTraversalContext<TGridData> & TCustomContext;

type StandardTraversalContext<TGridData> = {
  currentPosition?: Point;
  currentValue?: TGridData;
  lastVisitedPosition?: Point;
  lastVisitedValue?: TGridData;
  visitedPoints: Set<string>;
};

export class Grid<TGridData, TTraversalContext extends Record<string, unknown> = {}> {
  public get numCols() {
    return this.#numCols;
  }

  public get numRows() {
    return this.#numRows;
  }

  #data: GridDataMap<TGridData> = new Map();

  #numCols = 0;

  #numRows = 0;

  public constructor(gridData: TGridData[][]) {
    this.#numRows = gridData.length;

    for (let row = 0; row < gridData.length; row++) {
      const nextRow = this.#data.get(row) ?? new Map<number, TGridData>();

      for (let col = 0; col < gridData[row]!.length; col++) {
        if (col + 1 > this.#numCols) {
          this.#numCols = col + 1;
        }

        nextRow.set(col, gridData[row]![col]!);
      }

      this.#data.set(row, nextRow);
    }
  }

  public at(point: Point): TGridData | undefined {
    return this.#data.get(point.row)?.get(point.col);
  }

  public boundsContain(point: Point): boolean {
    const { col, row } = point;
    return row >= 0 && row < this.#numRows && col >= 0 && col < this.#numCols;
  }

  public exists(point: Point): boolean {
    const rowExists = this.#data.has(point.row);
    return rowExists && this.#data.get(point.row)!.has(point.col);
  }

  // Make grid iterable (i.e. can use for...of)
  *[Symbol.iterator]() {
    for (const row of this.#data.keys()) {
      for (const [col, value] of this.#data.get(row)!.entries()) {
        yield { col, point: new Point({ col, row }), row, value };
      }
    }
  }

  public toString(): string {
    return this.#data
      .values()
      .map((nextRow) => {
        return `[${nextRow.values().toArray().join(', ')}]`;
      })
      .toArray()
      .join('\n');
  }

  public traverse: GridTraversalFn<TTraversalContext, TGridData> = (
    startAt,
    traversalType,
    {
      customContext = {} as TTraversalContext,
      directions = [VECTORS.N, VECTORS.E, VECTORS.S, VECTORS.W],
      onVisit = () => true,
      shouldVisit = () => true,
    } = {},
  ) => {
    const visitedPoints = new Set<string>();
    const standardContext: StandardTraversalContext<TGridData> = {
      visitedPoints,
    };
    const context: StandardTraversalContext<TGridData> & TTraversalContext = {
      ...customContext,
      ...standardContext,
    };
    const addToVisited = (point: Point) => {
      visitedPoints.add(point.toString());
    };

    const hasVisited = (point: Point) => {
      return visitedPoints.has(point.toString());
    };

    const visit = (point: Point): boolean => {
      context.lastVisitedPosition = context.currentPosition;
      context.lastVisitedValue = context.currentValue;
      context.currentPosition = point;
      context.currentValue = this.at(point);

      if (!shouldVisit(context)) {
        return true;
      }

      return onVisit(context);
    };

    const toVisit: Point[] = [startAt];
    addToVisited(startAt);

    const getNextPoint = traversalType === 'bfs' ? () => toVisit.shift() : () => toVisit.pop();

    let nextPointToVisit: Point | undefined;
    while ((nextPointToVisit = getNextPoint()) !== undefined) {
      const shouldContinue = visit(nextPointToVisit);
      if (shouldContinue) {
        for (const nextDir of directions) {
          const nextNeighbour = nextPointToVisit.applyVector(nextDir);
          if (!hasVisited(nextNeighbour) && this.boundsContain(nextNeighbour)) {
            toVisit.push(nextNeighbour);
            addToVisited(nextNeighbour);
          }
        }
      }
    }

    return context;
  };
}
