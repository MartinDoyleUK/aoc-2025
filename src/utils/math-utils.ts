/**
 * Compute the greatest common divisor (GCD) of two integers using Euclid's algorithm.
 * @param first - The first integer (must be non-negative).
 * @param second - The second integer (must be non-negative).
 * @returns The greatest common divisor of `first` and `second`.
 * @throws Will throw an error if either number is negative.
 * @example
 * findGreatestCommonDivisor(48, 18); // => 6
 */
export const findGreatestCommonDivisor = (
  first: number,
  second: number,
): number => {
  if (first < 0 || second < 0) {
    throw new Error(
      `findGreatestCommonDivisor requires non-negative numbers (got ${first}, ${second})`,
    );
  }

  if (second === 0) {
    return first;
  }

  return findGreatestCommonDivisor(second, first % second);
};

const getLowestCommonMultipleOfTwoNumbers = (first: number, second: number) => {
  const gcd = findGreatestCommonDivisor(first, second);
  return (first / gcd) * second;
};

/**
 * Compute the lowest common multiple (LCM) of an array of integers.
 * @param inputs - The array of integers.
 * @returns The lowest common multiple of all numbers in `inputs`, `1` for an empty array, or `0` if any input is zero.
 * @example
 * getLowestCommonMultiple([12, 18, 24]); // => 72
 */
export const getLowestCommonMultiple = (inputs: number[]) => {
  // LCM with zero is zero
  if (inputs.includes(0)) {
    return 0;
  }

  // eslint-disable-next-line unicorn/no-array-reduce
  return inputs.reduce(getLowestCommonMultipleOfTwoNumbers, 1);
};
