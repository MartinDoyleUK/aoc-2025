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
  /**
   * Column index for this point.
   */
  public get col(): number {
    return this.#col;
  }

  /**
   * Stable symbol identifier based on the point string representation.
   */
  public get id(): Symbol {
    return Symbol.for(this.toStr());
  }

  /**
   * Row index for this point.
   */
  public get row(): number {
    return this.#row;
  }

  #col: number;

  #row: number;

  /**
   * Create a point from `{ row, col }`, a `"row,col"` string, or `Symbol.for('row,col')`.
   * @param params - Coordinates as an object, string, or symbol.
   * @throws SyntaxError when a string/symbol cannot be parsed.
   * @example
   * new Point({ row: 1, col: 2 });
   * new Point('1,2');
   * new Point(Symbol.for('1,2'));
   */
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

  public static fromColRow({ col, row }: ColRow): Point {
    return new Point({ col, row });
  }

  public static fromId(id: Symbol): Point {
    return new Point(id);
  }

  public static fromString(id: string): Point {
    return new Point(id);
  }

  /**
   * Move the point by a vector.
   * @param vector - The vector to apply.
   * @param reverse - When `true`, subtract the vector instead.
   * @returns A new translated `Point`.
   * @example
   * new Point({ row: 1, col: 1 }).applyVector(new Vector({ row: 0, col: 2 })); // => Point(1,3)
   */
  public applyVector(vector: Vector, reverse = false): Point {
    const newCol = reverse ? this.#col - vector.col : this.#col + vector.col;
    const newRow = reverse ? this.#row - vector.row : this.#row + vector.row;

    return new Point({ col: newCol, row: newRow });
  }

  public equals(other: Point): boolean {
    return Point.compare(this, other) === 0;
  }

  /**
   * Calculate the Euclidean distance to another point.
   * @param point - The destination point.
   * @returns The straight-line distance.
   * @example
   * new Point({ row: 0, col: 0 }).getDistanceTo(new Point({ row: 3, col: 4 })); // => 5
   */
  public getDistanceTo(point: Point): number {
    const vector = this.getVectorTo(point);
    return Math.hypot(vector.col, vector.row);
  }

  /**
   * Get the vector needed to travel from this point to another point.
   * @param point - The destination point.
   * @returns A `Vector` representing the delta.
   */
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

  /**
   * String representation suitable for JSON logging.
   * @returns `"Point(row,col)"`.
   */
  public toJSON(): string {
    return `Point(${this.toStr()})`;
  }

  /**
   * Convert the point to `"row,col"` form.
   * @returns The coordinate string.
   */
  public toStr(): string {
    return `${this.#row},${this.#col}`;
  }
}
