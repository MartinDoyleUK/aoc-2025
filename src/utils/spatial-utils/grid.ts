import { Point } from './point.js';
import { type Vector, VECTORS } from './vector.js';

type GridDataMap<TGridData> = Map<number, Map<number, TGridData>>;

type GridTraversalFn<TCustomContext, TGridData> = (
  startAt: Point,
  traversalType: 'bfs' | 'dfs',
  options: {
    customContext?: TCustomContext;
    debug?: boolean;
    directions?: Vector[];
    multipath: boolean;
    onVisit: (info: StandardTraversalContext & TCustomContext & VisitInfo<TGridData>) => VisitResult;
  },
) => StandardTraversalContext & TCustomContext;

type StandardTraversalContext = {
  directions: Vector[];
  globalVisited: Set<string>;
};

type VisitInfo<TGridData> = {
  path: VisitPointAndValue<TGridData>[];
  thisPathVisited: Set<string>;
  thisPointAndValue: VisitPointAndValue<TGridData>;
};

type VisitPointAndValue<TGridData> = {
  point: Point;
  value?: TGridData;
};

type VisitResult = { abort: boolean; visitNeighbours: boolean };

const pointAndValueToString = <TGridData>(pointAndValue: VisitPointAndValue<TGridData>): string => {
  const { point, value } = pointAndValue;
  return `${point.row},${point.col}=${value}`;
};

const pathToString = <TGridData>(path: VisitPointAndValue<TGridData>[]): string => {
  if (!path || path.length === 0) {
    return '<empty>';
  }

  return path.map(({ point: { col, row } }) => `${row},${col}`).join('=>');
};

export const visitInfoToString = <TGridData>(visitInfo: VisitInfo<TGridData>): string => {
  const { path, thisPointAndValue } = visitInfo;
  return `${pointAndValueToString(thisPointAndValue)} (path=${pathToString<TGridData>(path)})`;
};

/**
 * A sparse 2D grid wrapper with convenience helpers and traversal support.
 * The grid stores values by `{ row, col }` coordinates and exposes:
 * - random access via {@link Grid.at},
 * - bounds checks via {@link Grid.boundsContain},
 * - iteration via `for...of`,
 * - and BFS/DFS traversal via {@link Grid.traverse}.
 * @template TGridData - The type stored at each grid cell.
 * @template TTraversalContext - Additional context merged into traversal callbacks.
 */
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

  public at(point?: Point): TGridData | undefined {
    if (!point) {
      return undefined;
    }

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

  /**
   * Set the value at a given point.
   * If the point is outside the current bounds, the grid dimensions are expanded
   * unless `strictBounds` is `true`, in which case an error is thrown.
   * @param point - The point to set.
   * @param value - The value to store at that point.
   * @param strictBounds - If `true`, throw an error when the point is out of bounds (default: `false`).
   * @throws Error if `strictBounds` is `true` and the point is outside the grid bounds.
   */
  public set(point: Point, value: TGridData, strictBounds = false): void {
    if (strictBounds && !this.boundsContain(point)) {
      throw new Error(`Point ${point.toString()} is out of bounds (grid is ${this.#numRows}x${this.#numCols})`);
    }

    const rowMap = this.#data.get(point.row) ?? new Map<number, TGridData>();
    rowMap.set(point.col, value);
    this.#data.set(point.row, rowMap);

    // Expand bounds if necessary
    if (point.row >= this.#numRows) {
      this.#numRows = point.row + 1;
    }

    if (point.col >= this.#numCols) {
      this.#numCols = point.col + 1;
    }
  }

  // Make grid iterable (i.e. can use for...of)
  *[Symbol.iterator]() {
    for (const row of this.#data.keys()) {
      for (const [col, value] of this.#data.get(row)!.entries()) {
        yield { col, point: new Point({ col, row }), row, value };
      }
    }
  }

  /**
   * Render the grid as a multi-line string.
   * Missing cells (e.g. in ragged input) are rendered as `.` to make
   * irregular shapes visually obvious.
   * @param mapper - Optional transform for each stored value.
   * @returns A string representation of the grid, one row per line.
   * @example
   * const grid = new Grid([
   *   [1, 2],
   *   [3, 4],
   * ]);
   * grid.toString(); // "12\n34"
   * // Using a mapper
   * grid.toString((value) => (value === 1 ? '#' : '.')); // "#.\n.."
   */
  public toString(mapper?: (value: TGridData) => string): string {
    const rows: string[] = [];
    for (let row = 0; row < this.#numRows; row++) {
      let rowStr = '';
      for (let col = 0; col < this.#numCols; col++) {
        const value = this.#data.get(row)?.get(col);
        if (value === undefined) {
          rowStr += '.';
        } else {
          rowStr += mapper ? mapper(value) : String(value);
        }
      }

      rows.push(rowStr);
    }

    return rows.join('\n');
  }

  /**
   * Traverse the grid using BFS or DFS starting from a given point.
   * The traversal is driven entirely by the `onVisit` callback, which can:
   * - stop the traversal early (`abort: true`),
   * - or prevent visiting neighbours for a node (`visitNeighbours: false`).
   * In addition to the current point and value, your callback receives:
   * - `path` – the path of `(point, value)` pairs taken to reach this node,
   * - `thisPathVisited` – a set of points visited on this path (used when `multipath` is `true`),
   * - `globalVisited` – a set of all points visited so far,
   * - `directions` – the vectors used to explore neighbours.
   * @param startAt - The starting point for traversal.
   * @param traversalType - `'bfs'` for breadth-first search or `'dfs'` for depth-first search.
   * @param options - Additional traversal options.
   * @param options.customContext - Custom context to merge into traversal callbacks.
   * @param options.debug - Whether to log each visit for debugging.
   * @param options.directions - The directions to use when exploring neighbours.
   * @param options.multipath - When `true`, track per-path visited state instead of global only.
   * @param options.onVisit - Callback invoked for each visited node.
   * @example
   * // Count reachable cells from the top-left corner
   * const grid = linesToNumberGrid(['123', '456']);
   * let count = 0;
   * grid.traverse(new Point({ row: 0, col: 0 }), 'bfs', {
   *   multipath: false,
   *   onVisit: () => {
   *     count++;
   *     return { abort: false, visitNeighbours: true };
   *   },
   * });
   */
  public traverse: GridTraversalFn<TTraversalContext, TGridData> = (
    startAt,
    traversalType,
    {
      customContext = {} as TTraversalContext,
      debug = false,
      directions = [VECTORS.N, VECTORS.E, VECTORS.S, VECTORS.W],
      multipath,
      onVisit,
    },
  ) => {
    const globalVisited = new Set<string>();
    const standardContext: StandardTraversalContext = {
      directions,
      globalVisited,
    };
    const context: StandardTraversalContext & TTraversalContext = {
      ...customContext,
      ...standardContext,
    };

    const visit = (visitInfo: VisitInfo<TGridData>): VisitResult => {
      const visitResult = onVisit({
        ...context,
        ...visitInfo,
      });

      if (debug) {
        // eslint-disable-next-line no-console
        console.log(`Visiting ${visitInfoToString(visitInfo)} ... ${visitResult.visitNeighbours ? '✅' : '❌'}`);
      }

      return visitResult;
    };

    const toVisit: VisitInfo<TGridData>[] = [
      {
        path: [],
        thisPathVisited: new Set(),
        thisPointAndValue: { point: startAt, value: this.at(startAt) },
      },
    ];

    const getNextPoint = traversalType === 'bfs' ? () => toVisit.shift() : () => toVisit.pop();

    let thisVisit: undefined | VisitInfo<TGridData>;
    while ((thisVisit = getNextPoint()) !== undefined) {
      const {
        thisPathVisited,
        thisPointAndValue: { point },
      } = thisVisit;
      const canVisit = multipath ? !thisPathVisited.has(point.toString()) : !globalVisited.has(point.toString());
      if (canVisit) {
        globalVisited.add(point.toString());
        const { abort, visitNeighbours } = visit(thisVisit);
        if (abort) {
          break;
        } else if (visitNeighbours) {
          thisPathVisited.add(point.toString());
          for (const nextDir of directions) {
            const { path } = thisVisit;
            const nextNeighbour = point.applyVector(nextDir);
            const nextNeighbourValue = this.at(nextNeighbour);
            const newPath = [
              ...path,
              { point: thisVisit.thisPointAndValue.point, value: thisVisit.thisPointAndValue.value },
            ];
            if (!thisPathVisited.has(nextNeighbour.toString()) && this.boundsContain(nextNeighbour)) {
              toVisit.push({
                path: newPath,
                thisPathVisited: new Set(thisPathVisited),
                thisPointAndValue: { point: nextNeighbour, value: nextNeighbourValue },
              });
            }
          }
        }
      }
    }

    return context;
  };
}
