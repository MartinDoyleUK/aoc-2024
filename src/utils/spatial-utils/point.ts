import { type Vector } from './spatial-types.js';

const POINT_REGEX = /^(\d+),(\d+)$/u;

type ColRow = { col: number; row: number };

export class Point {
  public get col(): number {
    return this.#col;
  }

  public get id(): Symbol {
    return Symbol.for(this.toString());
  }

  public get row(): number {
    return this.#row;
  }

  #col: number;

  #row: number;

  public constructor(params: ColRow | string) {
    if (typeof params === 'string') {
      const match = POINT_REGEX.exec(params);
      if (match === null) {
        throw new SyntaxError(`Cannot convert "${params}" to Point`);
      }

      const [row, col] = match.slice(1, 3).map(Number) as [number, number];
      this.#row = row;
      this.#col = col;
      return;
    }

    this.#row = params.row;
    this.#col = params.col;
  }

  public static compare(a: Point, b: Point): number {
    if (a.col === b.col && a.row === b.row) {
      return 0;
    } else if (a.row < b.row) {
      return -1;
    } else if (a.row > b.row) {
      return 1;
    } else if (a.col < b.col) {
      return -1;
    } else {
      return 1;
    }
  }

  public applyVector(vector: Vector, reverse = false): Point {
    const newCol = reverse ? this.#col - vector.col : this.#col + vector.col;
    const newRow = reverse ? this.#row - vector.row : this.#row + vector.row;

    return new Point({ col: newCol, row: newRow });
  }

  public getDistanceTo(point: Point): number {
    const vector = this.getVectorTo(point);
    return Math.hypot(vector.col, vector.row);
  }

  public getVectorTo(point: Point): Vector {
    return {
      col: point.col - this.#col,
      row: point.row - this.#row,
    };
  }

  public toString(): string {
    return `${this.#row},${this.#col}`;
  }
}
