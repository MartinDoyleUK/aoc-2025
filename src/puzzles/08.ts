// import chalk from 'chalk';

import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type Point3D = [number, number, number];

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const getDistance3D = (
  [aX, aY, aZ]: Point3D,
  [bX, bY, bZ]: Point3D,
): number => {
  const distances = [aX - bX, aY - bY, aZ - bZ];
  const squared = distances.map((dist) => dist ** 2);
  const summed = squared.reduce((prev, next) => prev + next, 0);

  // Keep it simple ... don't need exact distance!
  return summed;
};

const idTo3DPoint = (id: string): Point3D =>
  id.split(',').map(Number) as Point3D;

const idsToKey = (idA: string, idB: string): string =>
  [idA, idB].toSorted().join('_');

const keyToIds = (key: string): [string, string] =>
  key.split('_') as [string, string];

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // console.log('');

  // Keyed by idsToKey() -- reversed by keyToIds()
  const distancesByPair = new Map<string, number>();
  for (const thisId of lines) {
    const thisPoint = idTo3DPoint(thisId);
    for (const otherId of lines) {
      if (otherId === thisId) {
        continue;
      }

      const key = idsToKey(thisId, otherId);
      if (distancesByPair.has(key)) {
        continue;
      }

      const otherPoint = idTo3DPoint(otherId);
      const distance = getDistance3D(thisPoint, otherPoint);

      distancesByPair.set(key, distance);
    }
  }

  const closestPairs = distancesByPair
    .entries()
    .toArray()
    .toSorted(([, a], [, b]) => a - b)
    .slice(0, USE_TEST_DATA ? 10 : 1_000)
    .map(([key]) => keyToIds(key));

  // console.log('closestPairs', closestPairs);

  const circuits: string[][] = [];
  const boxesWithCircuits = new Set<string>();

  const addPairToCircuit = (idPair: [string, string]) => {
    const [idA, idB] = idPair;

    // console.log('');
    // console.log(`Next pair: ${idA} and ${idB}`);

    if (boxesWithCircuits.has(idA) && boxesWithCircuits.has(idB)) {
      const idxA = circuits.findIndex((nextCircuit) =>
        nextCircuit.includes(idA),
      );
      const circuitA = circuits[idxA]!;
      const idxB = circuits.findIndex((nextCircuit) =>
        nextCircuit.includes(idB),
      );
      const circuitB = circuits[idxB]!;

      if (circuitA === circuitB) {
        // console.log('Already in same circuit!');
        return;
      }

      const newCircuit = [...circuitA, ...circuitB];

      // console.log(
      //   `Joining ['${circuitA.join("','")}'] and ['${circuitB.join("','")}']`,
      // );

      if (idxA < idxB) {
        circuits.splice(idxB, 1);
        circuits.splice(idxA, 1);
      } else {
        circuits.splice(idxA, 1);
        circuits.splice(idxB, 1);
      }

      circuits.push(newCircuit);

      // console.log(`Updated: ['${newCircuit.join("','")}']`);
    } else if (boxesWithCircuits.has(idA)) {
      const existingCircuit = circuits.find((nextCircuit) =>
        nextCircuit.includes(idA),
      )!;

      // console.log(`Adding ID '${idB}' to ['${existingCircuit.join("','")}']`);

      boxesWithCircuits.add(idB);
      existingCircuit!.push(idB);

      // console.log(`Updated circuit: ['${existingCircuit.join("','")}']`);
    } else if (boxesWithCircuits.has(idB)) {
      const existingCircuit = circuits.find((nextCircuit) =>
        nextCircuit.includes(idB),
      )!;

      // console.log(`Adding ID '${idA}' to ['${existingCircuit.join("','")}']`);

      boxesWithCircuits.add(idA);
      existingCircuit!.push(idA);

      // console.log(`Updated: ['${existingCircuit.join("','")}']`);
    } else {
      boxesWithCircuits.add(idA);
      boxesWithCircuits.add(idB);
      circuits.push(idPair);

      // console.log(`Making new circuit ['${idPair.join("','")}']`);
    }
  };

  const started = Date.now();
  let nextPair: [string, string] | undefined;
  while ((nextPair = closestPairs.shift())) {
    if (Date.now() - started > 1_000 * 60 * 5) {
      console.log('Timed out!');
      break;
    }

    addPairToCircuit(nextPair);
  }

  // console.log('');
  // console.log('circuits', circuits);

  const result = circuits
    .toSorted((a, b) => b.length - a.length)
    .slice(0, 3)
    .reduce((prev, next) => prev * next.length, 1);

  // console.log('');

  logAnswer({
    answer: result,
    expected: USE_TEST_DATA ? 40 : 140_008,
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

  // console.log('');

  // Keyed by idsToKey() -- reversed by keyToIds()
  const distancesByPair = new Map<string, number>();
  for (const thisId of lines) {
    const thisPoint = idTo3DPoint(thisId);
    for (const otherId of lines) {
      if (otherId === thisId) {
        continue;
      }

      const key = idsToKey(thisId, otherId);
      if (distancesByPair.has(key)) {
        continue;
      }

      const otherPoint = idTo3DPoint(otherId);
      const distance = getDistance3D(thisPoint, otherPoint);

      distancesByPair.set(key, distance);
    }
  }

  const closestPairs = distancesByPair
    .entries()
    .toArray()
    .toSorted(([, a], [, b]) => a - b)
    // .slice(0, USE_TEST_DATA ? 10 : 1_000)
    .map(([key]) => keyToIds(key));

  // console.log('closestPairs', closestPairs);

  const circuits: string[][] = [];
  const boxesWithCircuits = new Set<string>();

  const addPairToCircuit = (idPair: [string, string]) => {
    const [idA, idB] = idPair;

    // console.log('');
    // console.log(`Next pair: ${idA} and ${idB}`);

    if (boxesWithCircuits.has(idA) && boxesWithCircuits.has(idB)) {
      const idxA = circuits.findIndex((nextCircuit) =>
        nextCircuit.includes(idA),
      );
      const circuitA = circuits[idxA]!;
      const idxB = circuits.findIndex((nextCircuit) =>
        nextCircuit.includes(idB),
      );
      const circuitB = circuits[idxB]!;

      if (circuitA === circuitB) {
        // console.log('Already in same circuit!');
        return;
      }

      const newCircuit = [...circuitA, ...circuitB];

      // console.log(
      //   `Joining ['${circuitA.join("','")}'] and ['${circuitB.join("','")}']`,
      // );

      if (idxA < idxB) {
        circuits.splice(idxB, 1);
        circuits.splice(idxA, 1);
      } else {
        circuits.splice(idxA, 1);
        circuits.splice(idxB, 1);
      }

      circuits.push(newCircuit);

      // console.log(`Updated: ['${newCircuit.join("','")}']`);
    } else if (boxesWithCircuits.has(idA)) {
      const existingCircuit = circuits.find((nextCircuit) =>
        nextCircuit.includes(idA),
      )!;

      // console.log(`Adding ID '${idB}' to ['${existingCircuit.join("','")}']`);

      boxesWithCircuits.add(idB);
      existingCircuit!.push(idB);

      // console.log(`Updated circuit: ['${existingCircuit.join("','")}']`);
    } else if (boxesWithCircuits.has(idB)) {
      const existingCircuit = circuits.find((nextCircuit) =>
        nextCircuit.includes(idB),
      )!;

      // console.log(`Adding ID '${idA}' to ['${existingCircuit.join("','")}']`);

      boxesWithCircuits.add(idA);
      existingCircuit!.push(idA);

      // console.log(`Updated: ['${existingCircuit.join("','")}']`);
    } else {
      boxesWithCircuits.add(idA);
      boxesWithCircuits.add(idB);
      circuits.push(idPair);

      // console.log(`Making new circuit ['${idPair.join("','")}']`);
    }
  };

  const started = Date.now();
  let nextPair: [string, string] | undefined;
  let finalPair: [string, string] | undefined;
  while ((nextPair = closestPairs.shift())) {
    if (Date.now() - started > 1_000 * 60 * 5) {
      console.log('Timed out!');
      break;
    }

    finalPair = nextPair;
    addPairToCircuit(nextPair);

    if (boxesWithCircuits.size === lines.length) {
      break;
    }
  }

  if (!finalPair) {
    throw new Error('No final pair!');
  }

  const result = finalPair
    .map(idTo3DPoint)
    .reduce((prev, next) => prev * next[0], 1);

  logAnswer({
    answer: result,
    expected: USE_TEST_DATA ? 25_272 : 9_253_260_633,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
