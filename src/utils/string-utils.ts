export const reverseString = (input: string): string => {
  let reversed = '';
  for (let index = input.length - 1; index >= 0; index--) {
    reversed += input.charAt(index);
  }

  return reversed;
};
