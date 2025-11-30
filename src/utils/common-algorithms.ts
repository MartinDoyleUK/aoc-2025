type FindTransitionArgs<TValue> = {
  array: readonly TValue[];
  predicate: (value: TValue, index: number, array: readonly TValue[]) => boolean;
};

type FindTransitionFunction = <TValue = unknown>(args: FindTransitionArgs<TValue>) => number | undefined;

/**
 * Get the mid-point of a numeric range – i.e. the next candidate for a binary search.
 * @param start - The inclusive start of the range to be considered.
 * @param end - The inclusive end of the range to be considered.
 * @returns The mid-point of the range.
 * @throws Will throw an error if the range is invalid (e.g. `start` above `end`, or `start`/`end` are `undefined`).
 * @example
 * // Basic odd-length range
 * getBinaryCandidate(4, 6); // => 5
 */
export const getBinaryCandidate = (start: number, end: number) => {
  if (start === undefined || end === undefined || start > end) {
    throw new Error(`Range invalid (start=${start}, end=${end})`);
  }

  return Math.floor((start + end) / 2);
};

/**
 * Find the index where a predicate flips from `false` to `true` across a sorted/monotonic array.
 * Assumes the predicate returns `false` for all indices before the transition and `true` afterwards.
 * @param args - The arguments controlling the search.
 * @param args.array - The array to search. Its order should make the predicate monotonic.
 * @param args.predicate - A function that takes the current value, its index and the full array, and returns a boolean.
 * @returns The first index for which `predicate(value, index, array)` is `true`, or `undefined` if no transition is found.
 * @example
 * // Binary data
 * findTransition({ array: [0, 0, 0, 1, 1], predicate: (value) => value === 1 }); // => 3
 * @example
 * // Derived from ordered numbers
 * findTransition({ array: [4, 9, 16, 25], predicate: (value) => value >= 20 }); // => 3
 */
export const findTransition: FindTransitionFunction = ({ array, predicate }) => {
  let start = 0;
  let end = array.length - 1;

  let transition: number | undefined;
  let pointer: number;
  while (start <= end) {
    pointer = getBinaryCandidate(start, end);
    if (predicate(array[pointer]!, pointer, array)) {
      transition = pointer;
      end = pointer - 1;
    } else {
      start = pointer + 1;
    }
  }

  return transition;
};

/**
 * Memoize a function that takes a single argument object.
 * Results are cached using `JSON.stringify(argsObject)` as the key, which
 * makes this helper ideal for pure, deterministic functions with simple
 * argument shapes (numbers, strings, plain objects).
 * When `countExecutions` is `true`, the returned function is augmented with
 * a `getCounts()` method that exposes how many times each unique argument
 * combination was evaluated.
 * @template Args - The shape of the single argument object accepted by the function.
 * @template Result - The returned type of the function.
 * @param functionToMemoize - The function whose results you want to cache.
 * @param countExecutions - When `true`, track how often each argument combination is evaluated.
 * @returns A memoized version of the function.
 * @example
 * // Basic memoization
 * const slowSquare = ({ value }: { value: number }) => {
 *   // pretend this is expensive
 *   return value * value;
 * };
 * const memoizedSquare = memoize(slowSquare);
 * memoizedSquare({ value: 5 }); // computes and caches
 * memoizedSquare({ value: 5 }); // returns cached value
 * @example
 * // With execution counts
 * const fn = ({ n }: { n: number }) => n * 2;
 * const tracked = memoize(fn, true) as typeof fn & { getCounts: () => Map<string, number> };
 *
 * tracked({ n: 1 });
 * tracked({ n: 1 });
 * tracked({ n: 2 });
 *
 * tracked.getCounts().get(JSON.stringify({ n: 1 })); // => 2
 */
export const memoize = <Args, Result>(
  functionToMemoize: (argsObject: Args) => Result,
  countExecutions = false,
): ((argsObject: Args) => Result) => {
  const resultsMap = new Map<string, Result>();
  const argumentCounts = countExecutions ? new Map<string, number>() : undefined;

  const memoized = (argsObject: Args) => {
    const argsString = JSON.stringify(argsObject);
    if (!resultsMap.has(argsString)) {
      resultsMap.set(argsString, functionToMemoize(argsObject));
    }

    if (countExecutions) {
      const existingCount = argumentCounts!.get(argsString) ?? 0;
      argumentCounts!.set(argsString, existingCount + 1);
    }

    return resultsMap.get(argsString)!;
  };

  if (countExecutions) {
    Object.assign(memoized, {
      getCounts: () => argumentCounts!,
    });
  }

  return memoized;
};
