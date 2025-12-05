import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type Range = [number, number];
type Ranges = Range[];

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse.split('\n').map((line) => line.trim());

  const ranges: Ranges = [];
  let idsStartAt: number;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    if (line.length === 0) {
      idsStartAt = i + 1;
      break;
    }

    const range = line.split('-');
    ranges.push([Number(range[0]), Number(range[1])]);
  }

  const ids = lines.slice(idsStartAt!);
  // console.log({ ids, ranges });
  let numFresh = 0;
  for (const idStr of ids) {
    if (idStr.length === 0) {
      continue;
    }

    const id = Number(idStr);
    const isFresh = ranges.some(([lower, upper]) => id >= lower && id <= upper);
    if (isFresh) {
      numFresh++;
    }
  }

  logAnswer({
    answer: numFresh,
    expected: USE_TEST_DATA ? 3 : 896,
    partNum: 1,
    taskStartedAt,
  });
};

// // Run task two
// const runTwo = () => {
//   const taskStartedAt = performance.now();
//   const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
//   const lines = dataToUse.split('\n').map((line) => line.trim());

//   const originalRanges: Ranges = [];
//   for (const line of lines) {
//     if (line.length === 0) {
//       break;
//     }

//     const range = line.split('-');
//     originalRanges.push([Number(range[0]), Number(range[1])]);
//   }

//   // console.log({ originalRanges });
//   // console.log('');

//   const updatedRanges: Ranges = [];
//   for (const nextRange of originalRanges) {
//     const [nextLower, nextUpper] = nextRange;
//     const affected: Ranges = [];
//     const unaffected: Ranges = [];

//     // console.log('');
//     // console.log({ nextRange, updatedRanges });

//     while (updatedRanges.length > 0) {
//       const nextUpdatedRange = updatedRanges.shift()!;
//       const [updatedLower, updatedUpper] = nextUpdatedRange;
//       if (nextLower >= updatedLower && nextUpper <= updatedUpper) {
//         // Range fully contained
//         unaffected.push(nextUpdatedRange);
//       } else if (nextLower > updatedUpper || nextUpper < updatedLower) {
//         // Totally outside this range
//         unaffected.push(nextUpdatedRange);
//       } else {
//         // Overlaps another range
//         affected.push(nextUpdatedRange);
//       }
//     }

//     // console.log({ affected, unaffected });

//     let thisRange = nextRange;
//     if (affected.length > 0) {
//       let newLower = Number.MAX_SAFE_INTEGER;
//       let newUpper = 0;
//       for (const [affectedLower, affectedUpper] of affected) {
//         if (affectedLower < newLower) {
//           newLower = affectedLower;
//         }

//         if (affectedUpper > newUpper) {
//           newUpper = affectedUpper;
//         }
//       }

//       thisRange = [newLower, newUpper];
//     }

//     // console.log({ thisRange });

//     updatedRanges.push(...unaffected, thisRange);

//     // console.log({ updatedRanges });
//   }

//   // console.log('');
//   // console.log('');
//   // console.log({ updatedRanges });

//   const numIds = updatedRanges.reduce((prev, [lower, upper]) => prev + (upper - lower) + 1, 0);

//   logAnswer({
//     answer: numIds,
//     expected: USE_TEST_DATA ? 14 : undefined,
//     partNum: 2,
//     taskStartedAt,
//   });
// };

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse.split('\n').map((line) => line.trim());

  const ranges: Ranges = [];
  for (const line of lines) {
    if (line.length === 0) {
      break;
    }

    const range = line.split('-');
    ranges.push([Number(range[0]), Number(range[1])]);
  }

  const sorted = ranges.toSorted(([aLower], [bLower]) => aLower - bLower);
  const updatedRanges: Ranges = [];
  let startRange: Range | undefined;
  for (const nextRange of sorted) {
    if (startRange) {
      if (nextRange[0] > startRange[1]) {
        updatedRanges.push(startRange);
        startRange = nextRange;
      } else {
        startRange = [startRange[0], Math.max(startRange[1], nextRange[1])];
      }
    } else {
      startRange = nextRange;
    }
  }

  if (startRange) {
    updatedRanges.push(startRange);
  }

  const numIds = updatedRanges.reduce((prev, [lower, upper]) => prev + (upper - lower) + 1, 0);

  logAnswer({
    answer: numIds,
    expected: USE_TEST_DATA ? 14 : 346_240_317_247_002,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
