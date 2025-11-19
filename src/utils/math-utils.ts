export const findGreatestCommonDenominator = (first: number, second: number): number => {
  if (second === 0) {
    return first;
  }

  return findGreatestCommonDenominator(second, first % second);
};

export const getLowestCommonMultipleOfTwoNumbers = (first: number, second: number) =>
  (first / findGreatestCommonDenominator(first, second)) * second;

export const getLowestCommonMultiple = (inputs: number[]) =>
  // eslint-disable-next-line unicorn/no-array-reduce
  inputs.reduce(getLowestCommonMultipleOfTwoNumbers, 1);
