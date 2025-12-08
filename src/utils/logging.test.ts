import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  logAnswer,
  logComplete,
  logError,
  logInfo,
  logPuzzleDay,
  logStart,
  logTime,
} from './logging.js';

describe('logging functions', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(performance, 'now').mockReturnValue(1_000);
    vi.clearAllMocks();
  });

  describe('logPuzzleDay()', () => {
    it('should log puzzle day with ordinal words', () => {
      logPuzzleDay('1');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('first'),
      );
    });

    it('should log puzzle day for double-digit day', () => {
      logPuzzleDay('25');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('twenty-fifth'),
      );
    });

    it('should not add blank line when isFirst is true', () => {
      logPuzzleDay('1', true);
      expect(console.info).toHaveBeenCalledTimes(1);
    });

    it('should add blank line when isFirst is false', () => {
      logPuzzleDay('1', false);
      expect(console.info).toHaveBeenCalledTimes(2);
      expect(console.info).toHaveBeenNthCalledWith(1, '');
    });
  });

  describe('logAnswer()', () => {
    it('should log answer with part number and time', () => {
      logAnswer({ answer: 42, partNum: 1, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('First part'),
      );
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('42'));
    });

    it('appends a question mark when expected is not provided', () => {
      logAnswer({ answer: 123, partNum: 1, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('❔'));
    });

    it('should format large numbers with commas', () => {
      logAnswer({ answer: 1_000_000, partNum: 1, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('1,000,000'),
      );
    });

    it('should show raw number when different from formatted', () => {
      logAnswer({ answer: 1_000, partNum: 1, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('(1000)'),
      );
    });

    it('should handle string answers', () => {
      logAnswer({ answer: 'test answer', partNum: 2, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('test answer'),
      );
    });

    it('should show checkmark when answer matches expected', () => {
      logAnswer({ answer: 42, expected: 42, partNum: 1, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('✅'));
    });

    it('should show X when answer does not match expected', () => {
      logAnswer({ answer: 42, expected: 100, partNum: 1, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('❌'));
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('100'));
    });

    it('should handle expected as function that returns true', () => {
      const verifyFn = (answer: unknown) => answer === 42;
      logAnswer({
        answer: 42,
        expected: verifyFn,
        partNum: 1,
        taskStartedAt: 0,
      });
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('✅'));
    });

    it('should handle expected as function that returns false', () => {
      const verifyFn = (answer: unknown) => answer === 100;
      logAnswer({
        answer: 42,
        expected: verifyFn,
        partNum: 1,
        taskStartedAt: 0,
      });
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining('❌'));
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('verify-function result'),
      );
    });

    it('should handle part 2', () => {
      logAnswer({ answer: 42, partNum: 2, taskStartedAt: 0 });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Second part'),
      );
    });
  });

  describe('logTime()', () => {
    it('should log time taken for a day', () => {
      logTime(0, '5');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('five'),
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Took'),
      );
    });
  });

  describe('logComplete()', () => {
    it('should log completion message with time', () => {
      logComplete(0);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('All completed'),
      );
    });
  });

  describe('logStart()', () => {
    it('should log start message', () => {
      logStart();
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Starting puzzle run'),
      );
    });
  });

  describe('logError()', () => {
    it('should log error with label', () => {
      const error = new Error('test error');
      logError('Error label', error);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Error label'),
        error,
      );
    });

    it('should log error without error object', () => {
      logError('Error label');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('Error label'),
        undefined,
      );
    });
  });

  describe('logInfo()', () => {
    it('should log info messages', () => {
      logInfo('test message', 'another arg');
      expect(console.info).toHaveBeenCalledWith('test message', 'another arg');
    });

    it('should handle no arguments', () => {
      logInfo();
      expect(console.info).toHaveBeenCalledWith();
    });
  });
});
