import { getDataForPuzzle, logAnswer, Point } from '../utils/index.js';

type Edge = [Point, Point];

type Rect = {
  area: number;
  corners: [Point, Point];
  edges: Edge[];
};

// Toggle this to use test or real data
const USE_TEST_DATA = true;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const getAreaIncludingCorners = (
  { col: colA, row: rowA }: Point,
  { col: colB, row: rowB }: Point,
): number => {
  return (Math.abs(colA - colB) + 1) * (Math.abs(rowA - rowB) + 1);
};

const getEdges = (
  { col: colA, row: rowA }: Point,
  { col: colB, row: rowB }: Point,
): [Edge, Edge, Edge, Edge] => {
  const p1 = Point.fromColRow({ col: colA, row: rowA });
  const p2 = Point.fromColRow({ col: colA, row: rowB });
  const p3 = Point.fromColRow({ col: colB, row: rowB });
  const p4 = Point.fromColRow({ col: colB, row: rowA });

  return [
    [p1, p2],
    [p2, p3],
    [p3, p4],
    [p4, p1],
  ];
};

const doEdgesCross = ([a1, a2]: Edge, [b1, b2]: Edge): boolean => {
  const aIsVert = a1.col === a2.col;
  const bIsVert = b1.col === b2.col;
  if (aIsVert === bIsVert) {
    return false;
  }

  const vert = aIsVert ? [a1, a2] : [b1, b2];
  const horiz = aIsVert ? [b1, b2] : [a1, a2];

  const vertCol = vert[0]!.col;
  const horizRow = horiz[0]!.row;

  const colBetween =
    vertCol >= Math.min(horiz[0]!.col, horiz[1]!.col) &&
    vertCol <= Math.max(horiz[0]!.col, horiz[1]!.col);
  const rowBetween =
    horizRow >= Math.min(vert[0]!.row, vert[1]!.row) &&
    horizRow <= Math.max(vert[0]!.row, vert[1]!.row);

  if (!colBetween || !rowBetween) {
    return false;
  }

  const intersectionCol = vertCol;
  const intersectionRow = horizRow;
  const isEndpoint =
    (intersectionCol === a1.col && intersectionRow === a1.row) ||
    (intersectionCol === a2.col && intersectionRow === a2.row) ||
    (intersectionCol === b1.col && intersectionRow === b1.row) ||
    (intersectionCol === b2.col && intersectionRow === b2.row);

  return !isEndpoint;
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const points = lines
    .map((line) => line.split(',').map(Number))
    .map((colRow) => {
      const [col, row] = colRow as unknown as [number, number];
      return Point.fromColRow({ col, row });
    });

  let greatestArea = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const pointA = points[i]!;
    for (let j = i + 1; j < points.length; j++) {
      const pointB = points[j]!;
      if (pointA === pointB) {
        continue;
      }

      const area = getAreaIncludingCorners(pointA, pointB);
      if (area > greatestArea) {
        greatestArea = area;
      }
    }
  }

  logAnswer({
    answer: greatestArea,
    expected: USE_TEST_DATA ? 50 : 4_745_816_424,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log('');

  let minCol = Number.MAX_SAFE_INTEGER;
  let maxCol = 0;
  const redTiles = lines
    .map((line) => line.split(',').map(Number))
    .map((colRow) => {
      const [col, row] = colRow as unknown as [number, number];
      if (col < minCol) {
        minCol = col;
      }

      if (col > maxCol) {
        maxCol = col;
      }

      return Point.fromColRow({ col, row });
    });

  const tilesPolyEdges: [Point, Point][] = [
    [redTiles.at(-1)!, redTiles.at(0)!],
  ];
  for (let i = 1; i < redTiles.length; i++) {
    tilesPolyEdges.push([redTiles.at(i - 1)!, redTiles.at(i)!]);
  }

  const possibleRects: Rect[] = [];
  for (let i = 0; i < redTiles.length - 1; i++) {
    const pointA = redTiles[i]!;
    for (let j = i + 1; j < redTiles.length; j++) {
      const pointB = redTiles[j]!;
      if (pointA === pointB) {
        continue;
      }

      possibleRects.push({
        area: getAreaIncludingCorners(pointA, pointB),
        corners: [pointA, pointB],
        edges: getEdges(pointA, pointB),
      });
    }
  }

  const largestRects = possibleRects.toSorted(
    ({ area: a }, { area: b }) => b - a,
  );

  let nextLargestRect: Rect | undefined;
  while ((nextLargestRect = largestRects.shift())) {
    const { corners, edges } = nextLargestRect;
    const rectCrossesTilesPoly = tilesPolyEdges.some((nextPolyEdge) => {
      return edges.some((nextRectEdge) =>
        doEdgesCross(nextRectEdge, nextPolyEdge),
      );
    });

    // Cannot be fully within tiles poly ... reject this one
    if (rectCrossesTilesPoly) {
      continue;
    }

    // Is this rect inside or outside the tiles poly (inclusive)
    const middleOfRect = Point.fromColRow({
      col: (corners[0].col + corners[1].col) / 2,
      row: (corners[0].row + corners[1].row) / 2,
    });
    const lineToBoundary: Edge = [
      Point.fromColRow({ col: minCol - 1, row: middleOfRect.row + 0.5 }),
      middleOfRect,
    ];
    let numTimesLineCrossPoly = 0;
    for (const nextPolyEdge of tilesPolyEdges) {
      if (doEdgesCross(lineToBoundary, nextPolyEdge)) {
        numTimesLineCrossPoly++;
      }
    }

    // This rectangle is within the tiles if it crosses an odd number of times
    if (numTimesLineCrossPoly % 2 === 1) {
      break;
    }
  }

  if (!nextLargestRect) {
    throw new Error('Largest rect not defined!');
  }

  console.log('');

  logAnswer({
    answer: nextLargestRect.area,
    expected: USE_TEST_DATA ? 24 : undefined,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
