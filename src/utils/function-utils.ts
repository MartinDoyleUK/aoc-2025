/**
 * A function that does nothing and returns `undefined`.
 * Useful as a default callback when an optional function parameter is not provided.
 * @example
 * const handler: (() => void) | undefined = undefined;
 * (handler ?? noop)();
 */
export const noop = () => {};

// Stable stringify helper (sorts object keys without mutating inputs)
const stableStringify = (value: unknown): string => {
  const serialized = JSON.stringify(value, (_key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const sortedKeys = Object.keys(val).toSorted();
      const sortedCopy: Record<string, unknown> = {};
      for (const nextKey of sortedKeys) {
        sortedCopy[nextKey] = (val as Record<string, unknown>)[nextKey];
      }

      return sortedCopy;
    }

    return val;
  });

  return serialized ?? 'undefined';
};

/**
 * Memoize a function that takes a single argument object.
 * Results are cached using a stable JSON serialization of the argument (keys sorted), which
 * makes this helper ideal for pure, deterministic functions with simple, serializable
 * argument shapes (numbers, strings, plain objects). Non-serializable inputs (e.g. containing
 * functions, Symbols or circular references) will throw during serialization.
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
  const argumentCounts = countExecutions
    ? new Map<string, number>()
    : undefined;

  const memoized = (argsObject: Args) => {
    const argsString = stableStringify(argsObject);
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
