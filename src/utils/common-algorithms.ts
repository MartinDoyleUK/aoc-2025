type FindTransitionByIndexArgs = {
  lower: number;
  predicate: (index: number) => boolean;
  upper: number;
};

type FindTransitionByIndexFunction = (args: FindTransitionByIndexArgs) => number | undefined;

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
 * Given an array of 0s followed by 1s, return the first index where the value becomes 1.
 * This is a specialised binary-search helper for cases where a predicate
 * transitions from `false` (0) to `true` (1) at most once.
 * @param array - A binary array containing only `0` and `1` values.
 * @param length - The number of elements from the array to consider.
 * @returns The index of the first `1`, or -1 if no transition exists.
 * @example
 * // Transition at index 3
 * findTransitionPoint([0, 0, 0, 1, 1], 5); // => 3
 */
export const findTransitionPoint = (array: Array<0 | 1>, length: number) => {
  // Initialise lower and upper bounds
  let start = 0;
  let end = length - 1;

  // Perform Binary search
  while (start <= end) {
    // Find pointer
    // const pointer = Number.parseInt((start + end) / 2, 10);
    const pointer = Math.floor((start + end) / 2);
    const predicateIsFalse = array[pointer] === 0;

    // update lower_bound if pointer contains 0
    if (predicateIsFalse) {
      start = pointer + 1;
    } else {
      // Check if it is the left most 1
      // Return pointer, if yes
      if (pointer === 0 || (pointer > 0 && array[pointer - 1] === 0)) {
        return pointer;
      }

      // Else update upper_bound
      end = pointer - 1;
    }
  }

  return -1;
};

/**
 * Find the index where a predicate flips from `false` to `true` across an integer range.
 * This is a generic binary search that assumes:
 * - for indices `< transition` the predicate returns `false`
 * - for indices `>= transition` the predicate returns `true`
 * @param args - The arguments controlling the search range and predicate.
 * @param args.lower - The first index to consider (inclusive).
 * @param args.upper - The last index to consider (inclusive).
 * @param args.predicate - A function that takes an index and returns `true` or `false`.
 * @returns The first index for which `predicate(index)` is `true`, or `undefined` if no transition is found.
 * @example
 * // Find smallest n such that n^2 >= 50
 * const result = findTransitionByIndex({
 *   lower: 1,
 *   upper: 10,
 *   predicate: (n) => n * n >= 50,
 * });
 * // result === 8
 */
export const findTransitionByIndex: FindTransitionByIndexFunction = ({ lower, predicate, upper }) => {
  let start = lower;
  let end = upper;

  let transition: number | undefined;
  let pointer: number;
  while (start <= end) {
    pointer = getBinaryCandidate(start, end);
    if (predicate(pointer)) {
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
