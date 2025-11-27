/**
 * Reverse the characters in a string.
 * @param input - The string to reverse.
 * @returns The reversed string.
 * @example
 * reverseString('abc'); // => 'cba'
 */
export const reverseString = (input: string): string => {
  let reversed = '';
  for (let index = input.length - 1; index >= 0; index--) {
    reversed += input.charAt(index);
  }

  return reversed;
};

/**
 * Parse a multi-line string into an array of non-empty, trimmed lines.
 * @param input - The raw input string.
 * @returns An array of trimmed, non-empty lines.
 * @example
 * parseLines('  foo  \n\n  bar  '); // => ['foo', 'bar']
 */
export const parseLines = (input: string): string[] =>
  input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

/**
 * Extract all integers (including negative) from a string.
 * @param input - The raw input string.
 * @returns An array of numbers found in the string.
 * @example
 * parseNumbers('x=5, y=-3, z=10'); // => [5, -3, 10]
 */
export const parseNumbers = (input: string): number[] => input.match(/-?\d+/gu)?.map(Number) ?? [];

/**
 * Parse a multi-line string into a 2D array of characters (or mapped values).
 * @param input - The raw input string.
 * @param mapper - Optional function to transform each character.
 * @returns A 2D array representing the grid.
 * @example
 * parseGrid('ab\ncd'); // => [['a', 'b'], ['c', 'd']]
 * parseGrid('12\n34', Number); // => [[1, 2], [3, 4]]
 */
export const parseGrid = <T = string>(input: string, mapper?: (char: string) => T): T[][] =>
  parseLines(input).map((line) => [...line].map((char) => (mapper ? mapper(char) : (char as unknown as T))));
