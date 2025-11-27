import { type ColRow } from './spatial-types.js';
import { POINT_REGEX } from './spatial-utils.js';
import { CARDINAL_VECTORS, Vector } from './vector.js';

/**
 * Immutable 2D point, addressed by `{ row, col }`.
 *
 * A `Point` can be constructed from:
 * - a `{ row, col }` object,
 * - a `"row,col"` string (e.g. `"3,5"`),
 * - or a `Symbol.for('row,col')`.
 */
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

  /**
   * Get all neighbouring points in the given directions.
   * @param directions - The directions to check (defaults to cardinal directions).
   * @returns An array of adjacent points.
   * @example
   * const p = new Point({ row: 1, col: 1 });
   * p.neighbours(); // => [Point(0,1), Point(1,2), Point(2,1), Point(1,0)]
   */
  public neighbours(directions: Vector[] = CARDINAL_VECTORS): Point[] {
    return directions.map((dir) => this.applyVector(dir));
  }

  public toJSON(): string {
    return `Point(${this.toString()})`;
  }

  public toString(): string {
    return `${this.#row},${this.#col}`;
  }
}
