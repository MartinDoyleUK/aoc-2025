import {
  getDataForPuzzle,
  linesToStringGrid,
  logAnswer,
  Point,
} from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.length > 0);

  const manifold = linesToStringGrid(lines);

  const beamColsMap = new Map<number, boolean>(
    Array.from({ length: manifold.numCols }, (_, idx) => [idx, false]),
  );
  const getBeamCols = () =>
    [...beamColsMap.entries()]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_col, hasBeam]) => hasBeam)
      .map<number>(([col]) => col);

  let numTimesSplit = 0;
  for (let row = 0; row < manifold.numRows; row++) {
    // Get starting beam
    if (row === 0) {
      for (let col = 0; col < manifold.numCols; col++) {
        const nextPoint = manifold.at(new Point({ col, row }));
        if (nextPoint === 'S') {
          beamColsMap.set(col, true);
          break;
        }
      }

      continue;
    }

    // Check beamcols for splitters
    const beamCols = getBeamCols();
    for (const beamCol of beamCols) {
      const candidate = new Point({ col: beamCol, row });
      if (manifold.at(candidate) === '^') {
        beamColsMap.set(beamCol, false);
        beamColsMap.set(beamCol - 1, true);
        beamColsMap.set(beamCol + 1, true);
        numTimesSplit++;
      }
    }
  }

  logAnswer({
    answer: numTimesSplit,
    expected: USE_TEST_DATA ? 21 : 1_630,
    partNum: 1,
    taskStartedAt,
  });
};

// const runTwoOLD = () => {
//   const taskStartedAt = performance.now();
//   const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
//   const lines = dataToUse.split('\n').filter((line) => {
//     const isEmpty = line.length === 0;
//     const isAllSpaces = line.split('').every((char) => char === '.');
//     return !isEmpty && !isAllSpaces;
//     // return !isEmpty;
//   });

//   // Draw the tree
//   const drawTree = false;
//   if (drawTree) {
//     console.log('');
//     console.log(
//       lines.map((nextLine, lineIdx) => (lineIdx % 2 === 0 ? chalk.green(nextLine) : chalk.red(nextLine))).join('\n'),
//     );
//     console.log('');
//   }

//   const manifold = linesToStringGrid(lines);

//   const beamsByCol = new Map<number, boolean>(Array.from({ length: manifold.numCols }, (_, idx) => [idx, false]));
//   const getColsWithBeams = () => [...beamsByCol.entries()].filter(([, hasBeam]) => hasBeam);

//   let start: Point;
//   for (let col = 0; col < manifold.numCols; col++) {
//     const nextPoint = manifold.at(new Point({ col, row: 0 }));
//     if (nextPoint === 'S') {
//       start = new Point({ col, row: 0 });
//       beamsByCol.set(col, true);
//       break;
//     }
//   }

//   const beamsGraph = new Graph(start!.toString());
//   let beamCols = getColsWithBeams();
//   for (let row = 1; row < manifold.numRows; row++) {
//     // console.log({ row });
//     beamCols = getColsWithBeams();
//     for (const [col] of beamCols) {
//       // console.log({ col });
//       let parent: Point | undefined;
//       let parentRow = row;
//       while (!parent) {
//         parentRow--;
//         const possibleParent = new Point({ col, row: parentRow });
//         if (beamsGraph.nodesById.get(possibleParent.toString())) {
//           parent = possibleParent;
//         }
//       }

//       const candidate = new Point({ col, row });
//       if (manifold.at(candidate) === '^') {
//         const leftBeam = new Point({ col: col - 1, row });
//         const rightBeam = new Point({ col: col + 1, row });
//         for (const eachBeam of [leftBeam, rightBeam]) {
//           if (eachBeam.col >= 0 && eachBeam.col < manifold.numCols) {
//             beamsGraph.add(eachBeam.toString(), parent.toString());
//             // console.log(`Added ${eachBeam.toString()} to ${parent.toString()}`);
//           }
//         }

//         beamsByCol.set(col, false);
//         beamsByCol.set(col - 1, true);
//         beamsByCol.set(col + 1, true);
//       } else {
//         beamsGraph.add(candidate.toString(), parent.toString());
//       }
//     }
//   }

//   // console.log('');
//   // console.log('Now for final row');
//   // console.log('');

//   // beamCols = getColsWithBeams();
//   // for (const [col] of beamCols) {
//   //   // console.log({ col });
//   //   let parent: Point | undefined;
//   //   let parentRow = manifold.numRows;
//   //   while (!parent) {
//   //     parentRow--;
//   //     const possibleParent = new Point({ col, row: parentRow });
//   //     if (beamsGraph.nodesById.get(possibleParent.toString())) {
//   //       parent = possibleParent;
//   //     }
//   //   }

//   //   const finalBeamPos = new Point({ col, row: manifold.numRows });
//   //   beamsGraph.add(finalBeamPos.toString(), parent.toString());
//   //   console.log(`Added ${finalBeamPos.toString()} to ${parent.toString()}`);
//   // }

//   // Get all of the paths
//   const paths = beamsGraph.root.getChildPaths();

//   // Draw the paths to help debugging
//   const drawPaths = false;
//   if (drawPaths) {
//     for (const [idx, path] of paths.entries()) {
//       console.log('');
//       console.log(`Path ${idx}:`);
//       console.log(`[${path.join('],[')}]`);
//       const mappedLines = lines.map((nextRow, rowIdx) => {
//         const lineBeamsByCol: number[] = [];
//         for (const pointStr of path) {
//           const point = Point.fromString(pointStr);
//           if (point.row === rowIdx) {
//             lineBeamsByCol.push(point.col);
//           }
//         }

//         const rowChars = nextRow.split('');
//         for (const nextCol of lineBeamsByCol) {
//           rowChars.splice(nextCol, 1, '|');
//         }

//         return rowChars.join('');
//       });

//       console.log(mappedLines.join('\n'));
//     }
//   }

//   logAnswer({
//     answer: paths.length,
//     expected: USE_TEST_DATA ? 40 : undefined,
//     partNum: 2,
//     taskStartedAt,
//   });
// };

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.length > 0);

  const manifold = linesToStringGrid(lines);

  let start: Point;
  for (let col = 0; col < manifold.numCols; col++) {
    const nextPoint = manifold.at(new Point({ col, row: 0 }));
    if (nextPoint === 'S') {
      start = new Point({ col, row: 0 });
      break;
    }
  }

  const numTimelinesByCoord = new Map<string, number>();
  const countTimelines = (thisCol: number, thisRow: number): number => {
    // OOB check ... only this timeline
    if (
      thisCol < 0 ||
      thisCol >= manifold.numCols ||
      thisRow >= manifold.numRows
    ) {
      return 1;
    }

    const thisPoint = Point.fromColRow(thisCol, thisRow);
    if (numTimelinesByCoord.has(thisPoint.toStr())) {
      return numTimelinesByCoord.get(thisPoint.toStr())!;
    }

    const pointValue = manifold.at(thisPoint);
    const [prevCol, nextCol] = [thisCol - 1, thisCol + 1];
    const nextRow = thisRow + 1;

    let numTimelines: number;
    if (pointValue === '^') {
      numTimelines =
        countTimelines(prevCol, nextRow) + countTimelines(nextCol, nextRow);
    } else {
      numTimelines = countTimelines(thisCol, nextRow);
    }

    numTimelinesByCoord.set(thisPoint.toStr(), numTimelines);
    return numTimelines;
  };

  const answer = countTimelines(start!.col, 0);

  logAnswer({
    answer,
    expected: USE_TEST_DATA ? 40 : 47_857_642_990_160,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
