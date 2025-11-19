import { type ColRow } from './spatial-types.js';
import { POINT_REGEX } from './spatial-utils.js';
import { Vector } from './vector.js';

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

  public constructor(params: ColRow | string | Symbol) {
    let vectorStr: string | undefined;
    if (typeof params === 'string') {
      vectorStr = params;
    } else if (typeof params === 'symbol') {
      if (params.description === undefined) {
        throw new SyntaxError(`Supplied Symbol has no description`);
      }

      vectorStr = params.description;
    }

    if (vectorStr !== undefined) {
      const match = POINT_REGEX.exec(vectorStr);
      if (match === null) {
        throw new SyntaxError(`Cannot convert "${vectorStr}" to Point`);
      }

      const [row, col] = match.slice(1, 3).map(Number) as [number, number];
      this.#row = row;
      this.#col = col;
      return;
    }

    const objParams = params as ColRow;
    this.#row = objParams.row;
    this.#col = objParams.col;
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
    return new Vector({
      col: point.col - this.#col,
      row: point.row - this.#row,
    });
  }

  public toJSON(): string {
    return `Point(${this.toString()})`;
  }

  public toString(): string {
    return `${this.#row},${this.#col}`;
  }
}
