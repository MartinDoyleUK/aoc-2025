/**
 * Compute the greatest common divisor (GCD) of two integers using Euclid's algorithm.
 * @param first - The first integer.
 * @param second - The second integer.
 * @returns The greatest common divisor of `first` and `second`.
 * @example
 * findGreatestCommonDenominator(48, 18); // => 6
 */
export const findGreatestCommonDivisor = (first: number, second: number): number => {
  if (second === 0) {
    return first;
  }

  return findGreatestCommonDivisor(second, first % second);
};

/**
 * Compute the lowest common multiple (LCM) of two integers.
 * @param first - The first integer.
 * @param second - The second integer.
 * @returns The lowest common multiple of `first` and `second`.
 * @example
 * getLowestCommonMultipleOfTwoNumbers(12, 18); // => 36
 */
export const getLowestCommonMultipleOfTwoNumbers = (first: number, second: number) => {
  const gcd = findGreatestCommonDivisor(first, second);
  return (first / gcd) * second;
};

/**
 * Compute the lowest common multiple (LCM) of an array of integers.
 * @param inputs - The array of integers.
 * @returns The lowest common multiple of all numbers in `inputs`, or `1` for an empty array.
 * @example
 * getLowestCommonMultiple([12, 18, 24]); // => 72
 */
export const getLowestCommonMultiple = (inputs: number[]) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return inputs.reduce(getLowestCommonMultipleOfTwoNumbers, 1);
};
