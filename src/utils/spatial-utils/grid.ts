import { Point } from './point.js';

type GridData<T> = Map<number, Map<number, T>>;

export class Grid<T = string> {
  public get numCols() {
    return this.#numCols;
  }

  public get numRows() {
    return this.#numRows;
  }

  #data: GridData<T> = new Map();

  #numCols = 0;

  #numRows = 0;

  public constructor(gridData: T[][]) {
    this.#numRows = gridData.length;

    for (let row = 0; row < gridData.length; row++) {
      const nextRow = this.#data.get(row) ?? new Map<number, T>();

      for (let col = 0; col < gridData[row]!.length; col++) {
        if (col + 1 > this.#numCols) {
          this.#numCols = col + 1;
        }

        nextRow.set(col, gridData[row]![col]!);
      }

      this.#data.set(row, nextRow);
    }
  }

  public at(point: Point): T | undefined {
    return this.#data.get(point.row)?.get(point.col);
  }

  public exists(point: Point): boolean {
    return this.at(point) !== undefined;
  }

  public isWithinBounds(point: Point): boolean {
    const { col, row } = point;
    return row >= 0 && row < this.#numRows && col >= 0 && col < this.#numCols;
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
}
