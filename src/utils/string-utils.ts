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
