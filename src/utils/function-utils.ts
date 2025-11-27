/**
 * A function that does nothing and returns `undefined`.
 * Useful as a default callback when an optional function parameter is not provided.
 * @example
 * const handler: (() => void) | undefined = undefined;
 * (handler ?? noop)();
 */
export const noop = () => {};
