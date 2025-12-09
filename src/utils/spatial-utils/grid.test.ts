import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Grid, visitInfoToString } from './grid.js';
import { Point } from './point.js';
import { VECTORS } from './vector.js';

describe('Grid', () => {
  let grid: Grid<number>;

  beforeEach(() => {
    grid = new Grid([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  describe('constructor', () => {
    it('should create grid from 2D array', () => {
      expect(grid.numRows).toBe(3);
      expect(grid.numCols).toBe(3);
    });

    it('should handle empty grid', () => {
      const emptyGrid = new Grid<number>([]);
      expect(emptyGrid.numRows).toBe(0);
      expect(emptyGrid.numCols).toBe(0);
    });

    it('should handle irregular grid', () => {
      const irregularGrid = new Grid([[1, 2], [3, 4, 5, 6], [7]]);
      expect(irregularGrid.numRows).toBe(3);
      expect(irregularGrid.numCols).toBe(4);
    });
  });

  describe('at()', () => {
    it('should get value at point', () => {
      const point = new Point({ col: 1, row: 1 });
      expect(grid.at(point)).toBe(5);
    });

    it('should return undefined for out of bounds point', () => {
      const point = new Point({ col: 10, row: 10 });
      expect(grid.at(point)).toBeUndefined();
    });

    it('should return undefined for undefined point', () => {
      expect(grid.at(undefined)).toBeUndefined();
    });
  });

  describe('boundsContain()', () => {
    it('should return true for point within bounds', () => {
      const point = new Point({ col: 1, row: 1 });
      expect(grid.boundsContain(point)).toBe(true);
    });

    it('should return false for point outside bounds', () => {
      const point = new Point({ col: 10, row: 10 });
      expect(grid.boundsContain(point)).toBe(false);
    });

    it('should return false for negative coordinates', () => {
      const point = new Point({ col: -1, row: 0 });
      expect(grid.boundsContain(point)).toBe(false);
    });

    it('should return true for edge points', () => {
      expect(grid.boundsContain(new Point({ col: 0, row: 0 }))).toBe(true);
      expect(grid.boundsContain(new Point({ col: 2, row: 2 }))).toBe(true);
    });
  });

  describe('exists()', () => {
    it('should return true for existing point', () => {
      const point = new Point({ col: 1, row: 1 });
      expect(grid.exists(point)).toBe(true);
    });

    it('should return false for non-existing point', () => {
      const point = new Point({ col: 10, row: 10 });
      expect(grid.exists(point)).toBe(false);
    });
  });

  describe('getNeighbours()', () => {
    it('should return all cardinal neighbours for center point', () => {
      const point = new Point({ col: 1, row: 1 });
      const neighbours = grid.getNeighbours(point, [
        VECTORS.N,
        VECTORS.E,
        VECTORS.S,
        VECTORS.W,
      ]);

      expect(neighbours).toHaveLength(4);
      expect(neighbours.map((n) => n.value)).toEqual([2, 6, 8, 4]);
    });

    it('should filter out-of-bounds neighbours for corner point', () => {
      const point = new Point({ col: 0, row: 0 });
      const neighbours = grid.getNeighbours(point, [
        VECTORS.N,
        VECTORS.E,
        VECTORS.S,
        VECTORS.W,
      ]);

      expect(neighbours).toHaveLength(2);
      expect(neighbours.map((n) => n.value)).toEqual([2, 4]);
    });

    it('should filter out-of-bounds neighbours for edge point', () => {
      const point = new Point({ col: 1, row: 0 });
      const neighbours = grid.getNeighbours(point, [
        VECTORS.N,
        VECTORS.E,
        VECTORS.S,
        VECTORS.W,
      ]);

      expect(neighbours).toHaveLength(3);
      expect(neighbours.map((n) => n.value)).toEqual([3, 5, 1]);
    });

    it('should work with diagonal directions', () => {
      const point = new Point({ col: 1, row: 1 });
      const neighbours = grid.getNeighbours(point, [
        VECTORS.NE,
        VECTORS.SE,
        VECTORS.SW,
        VECTORS.NW,
      ]);

      expect(neighbours).toHaveLength(4);
      expect(neighbours.map((n) => n.value)).toEqual([3, 9, 7, 1]);
    });

    it('should work with single direction', () => {
      const point = new Point({ col: 1, row: 1 });
      const neighbours = grid.getNeighbours(point, [VECTORS.N]);

      expect(neighbours).toHaveLength(1);
      expect(neighbours[0]!.value).toBe(2);
      expect(neighbours[0]!.point.row).toBe(0);
      expect(neighbours[0]!.point.col).toBe(1);
    });

    it('should return empty array when all neighbours are out of bounds', () => {
      const smallGrid = new Grid([[1]]);
      const point = new Point({ col: 0, row: 0 });
      const neighbours = smallGrid.getNeighbours(point, [
        VECTORS.N,
        VECTORS.E,
        VECTORS.S,
        VECTORS.W,
      ]);

      expect(neighbours).toHaveLength(0);
    });

    it('should include point and value in returned neighbours', () => {
      const point = new Point({ col: 1, row: 1 });
      const neighbours = grid.getNeighbours(point, [VECTORS.N]);

      expect(neighbours[0]).toEqual({
        point: expect.any(Point),
        value: 2,
      });
      expect(neighbours[0]!.point.row).toBe(0);
      expect(neighbours[0]!.point.col).toBe(1);
    });
  });

  describe('iterator', () => {
    it('should iterate over all grid points', () => {
      const values: number[] = [];
      for (const { value } of grid) {
        values.push(value);
      }

      expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should provide point, row, and col in iteration', () => {
      const iterator = grid[Symbol.iterator]();
      const first = iterator.next().value;
      expect(first).toEqual({
        col: 0,
        point: expect.any(Point),
        row: 0,
        value: 1,
      });
    });
  });

  describe('toString()', () => {
    it('should convert grid to string', () => {
      const result = grid.toString();
      expect(result).toContain('123');
      expect(result).toContain('456');
      expect(result).toContain('789');
    });

    it('should include placeholders for missing values', () => {
      const ragged = new Grid([[1, 2], [3]]);

      const result = ragged.toString();
      expect(result).toContain('12');
      expect(result).toContain('3.');
    });

    it('should use a mapper when provided', () => {
      const result = grid.toString((value) => `(${value})`);
      expect(result).toContain('(1)(2)(3)');
    });
  });

  describe('traverse()', () => {
    it('should perform BFS traversal', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: false, visitNeighbours: true };
        },
      });
      expect(visited.length).toBeGreaterThan(0);
      expect(visited[0]!.row).toBe(0);
      expect(visited[0]!.col).toBe(0);
    });

    it('should perform DFS traversal', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 0, row: 0 }), 'dfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: false, visitNeighbours: true };
        },
      });
      expect(visited.length).toBeGreaterThan(0);
    });

    it('should abort traversal when requested', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: true, visitNeighbours: false };
        },
      });
      expect(visited.length).toBe(1);
    });

    it('should not visit neighbours when visitNeighbours is false', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: false, visitNeighbours: false };
        },
      });
      expect(visited.length).toBe(1);
    });

    it('should use custom directions', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 1, row: 1 }), 'bfs', {
        directions: [VECTORS.N, VECTORS.S],
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: false, visitNeighbours: true };
        },
      });
      expect(visited.length).toBe(3); // center, north, south
    });

    it('should handle multipath traversal', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: true,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: visited.length >= 5, visitNeighbours: true };
        },
      });
      expect(visited.length).toBe(5);
    });

    it('should provide path information in visit', () => {
      let pathLength = 0;
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ path }) => {
          pathLength = Math.max(pathLength, path.length);
          return { abort: false, visitNeighbours: true };
        },
      });
      expect(pathLength).toBeGreaterThan(0);
    });

    it('should track global visited in context', () => {
      const context = grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: () => ({ abort: false, visitNeighbours: true }),
      });
      expect(context.globalVisited.size).toBeGreaterThan(0);
    });

    it('should skip empty cells when skipEmpty is true', () => {
      const ragged = new Grid([[1, 2], [3]]);
      const visitedWithSkip: string[] = [];
      const visitedWithoutSkip: string[] = [];

      ragged.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visitedWithSkip.push(thisPointAndValue.point.toStr());
          return { abort: false, visitNeighbours: true };
        },
        skipEmpty: true,
      });

      ragged.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visitedWithoutSkip.push(thisPointAndValue.point.toStr());
          return { abort: false, visitNeighbours: true };
        },
        skipEmpty: false,
      });

      expect(visitedWithSkip).not.toContain('1,1');
      expect(visitedWithoutSkip).toContain('1,1');
    });

    it('should not visit anything when skipEmpty is true and start point is empty', () => {
      const ragged = new Grid([[1, 2], [3]]);
      let visitCount = 0;

      // Start at an empty cell (row 1, col 1 doesn't exist)
      ragged.traverse(new Point({ col: 1, row: 1 }), 'bfs', {
        multipath: false,
        onVisit: () => {
          visitCount++;
          return { abort: false, visitNeighbours: true };
        },
        skipEmpty: true,
      });

      expect(visitCount).toBe(0);
    });

    it('should include custom context in returned context', () => {
      type CustomContext = { customValue: string };
      const customGrid = new Grid<number, CustomContext>([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      const context = customGrid.traverse(
        new Point({ col: 0, row: 0 }),
        'bfs',
        {
          customContext: { customValue: 'test' },
          multipath: false,
          onVisit: () => ({ abort: true, visitNeighbours: false }),
        },
      );
      expect(context.customValue).toBe('test');
      expect(context.globalVisited).toBeDefined();
      expect(context.directions).toBeDefined();
    });

    it('should log debug info when debug is true and visitNeighbours is false', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        debug: true,
        multipath: false,
        onVisit: () => ({ abort: true, visitNeighbours: false }),
      });
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌'));
      consoleSpy.mockRestore();
    });

    it('should log debug info when debug is true and visitNeighbours is true', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        debug: true,
        multipath: false,
        onVisit: () => ({ abort: true, visitNeighbours: true }),
      });
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅'));
      consoleSpy.mockRestore();
    });

    it('should not revisit points in non-multipath mode', () => {
      const visitCounts = new Map<string, number>();
      grid.traverse(new Point({ col: 1, row: 1 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          const key = thisPointAndValue.point.toStr();
          visitCounts.set(key, (visitCounts.get(key) ?? 0) + 1);
          return { abort: false, visitNeighbours: true };
        },
      });
      for (const count of visitCounts.values()) {
        expect(count).toBe(1);
      }
    });

    it('should respect bounds when visiting neighbours', () => {
      const visited: Point[] = [];
      grid.traverse(new Point({ col: 0, row: 0 }), 'bfs', {
        multipath: false,
        onVisit: ({ thisPointAndValue }) => {
          visited.push(thisPointAndValue.point);
          return { abort: false, visitNeighbours: true };
        },
      });
      for (const point of visited) {
        expect(grid.boundsContain(point)).toBe(true);
      }
    });
  });
});

describe('visitInfoToString()', () => {
  it('should format visit info to string', () => {
    const visitInfo = {
      path: [
        { point: new Point({ col: 0, row: 0 }), value: 1 },
        { point: new Point({ col: 1, row: 0 }), value: 2 },
      ],
      thisPathVisited: new Set<string>(),
      thisPointAndValue: { point: new Point({ col: 2, row: 0 }), value: 3 },
    };
    const result = visitInfoToString(visitInfo);
    expect(result).toContain('0,2=3');
    expect(result).toContain('path=');
  });

  it('should handle empty path', () => {
    const visitInfo = {
      path: [],
      thisPathVisited: new Set<string>(),
      thisPointAndValue: { point: new Point({ col: 0, row: 0 }), value: 1 },
    };
    const result = visitInfoToString(visitInfo);
    expect(result).toContain('<empty>');
  });
});

describe('set()', () => {
  let grid: Grid<number>;

  beforeEach(() => {
    grid = new Grid([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  it('should set value at a point within bounds', () => {
    const point = new Point({ col: 1, row: 1 });
    grid.set(point, 99);
    expect(grid.at(point)).toBe(99);
  });

  it('should expand bounds when setting value outside bounds', () => {
    const point = new Point({ col: 5, row: 5 });
    grid.set(point, 42);
    expect(grid.at(point)).toBe(42);
    expect(grid.numRows).toBe(6);
    expect(grid.numCols).toBe(6);
  });

  it('should throw when strictBounds is true and point is outside bounds', () => {
    const point = new Point({ col: 10, row: 10 });
    expect(() => grid.set(point, 42, true)).toThrow(
      'Point 10,10 is out of bounds (grid is 3x3)',
    );
  });

  it('should not throw when strictBounds is true and point is inside bounds', () => {
    const point = new Point({ col: 1, row: 1 });
    expect(() => grid.set(point, 42, true)).not.toThrow();
    expect(grid.at(point)).toBe(42);
  });

  it('should expand bounds when strictBounds is false (default)', () => {
    const point = new Point({ col: 10, row: 10 });
    grid.set(point, 42);
    expect(grid.at(point)).toBe(42);
    expect(grid.numRows).toBe(11);
    expect(grid.numCols).toBe(11);
  });
});
