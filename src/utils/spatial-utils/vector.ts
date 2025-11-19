import { type ColRow } from './spatial-types.js';
import { POINT_REGEX } from './spatial-utils.js';

export class Vector {
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

  public eq(other: Vector): boolean {
    return this.#col === other.#col && this.#row === other.#row;
  }

  public invert(): Vector {
    return new Vector({ col: -this.#col, row: -this.#row });
  }

  public toJSON(): string {
    return `Vector(${this.toString()})`;
  }

  public toString(): string {
    return `${this.#row > 0 ? `+${this.#row}` : this.#row},${this.#col > 0 ? `+${this.#col}` : this.#col}`;
  }
}

export const VECTORS = {
  E: new Vector({ col: 1, row: 0 }),
  N: new Vector({ col: 0, row: -1 }),
  NE: new Vector({ col: 1, row: -1 }),
  NW: new Vector({ col: -1, row: -1 }),
  S: new Vector({ col: 0, row: 1 }),
  SE: new Vector({ col: 1, row: 1 }),
  SW: new Vector({ col: -1, row: 1 }),
  W: new Vector({ col: -1, row: 0 }),
};
