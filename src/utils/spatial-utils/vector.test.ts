import { describe, expect, it } from 'vitest';

import { Vector, VECTORS } from './vector.js';

describe('Vector', () => {
  describe('constructor', () => {
    it('should create vector from ColRow object', () => {
      const vector = new Vector({ col: 5, row: 10 });
      expect(vector.col).toBe(5);
      expect(vector.row).toBe(10);
    });

    it('should create vector from string', () => {
      const vector = new Vector('10,5');
      expect(vector.col).toBe(5);
      expect(vector.row).toBe(10);
    });

    it('should create vector from signed string', () => {
      const vector = new Vector('-10,+5');
      expect(vector.col).toBe(5);
      expect(vector.row).toBe(-10);
    });

    it('should create vector from Symbol with description', () => {
      const symbol = Symbol.for('10,5');
      const vector = new Vector(symbol);
      expect(vector.col).toBe(5);
      expect(vector.row).toBe(10);
    });

    it('should throw error for Symbol without description', () => {
      // eslint-disable-next-line symbol-description
      const symbol = Symbol();
      expect(() => new Vector(symbol)).toThrow('Supplied Symbol has no description');
    });

    it('should throw error for invalid string format', () => {
      expect(() => new Vector('invalid')).toThrow('Cannot convert "invalid" to Vector');
    });

    it('should round-trip via toString()', () => {
      const original = new Vector({ col: -4, row: 9 });
      const clone = new Vector(original.toString());
      expect(clone.col).toBe(-4);
      expect(clone.row).toBe(9);
    });
  });

  describe('getters', () => {
    it('should get col and row', () => {
      const vector = new Vector({ col: 3, row: 7 });
      expect(vector.col).toBe(3);
      expect(vector.row).toBe(7);
    });

    it('should get id as Symbol', () => {
      const vector = new Vector({ col: 3, row: 7 });
      const id = vector.id;
      expect(typeof id).toBe('symbol');
    });
  });

  describe('eq()', () => {
    it('should return true for equal vectors', () => {
      const a = new Vector({ col: 5, row: 10 });
      const b = new Vector({ col: 5, row: 10 });
      expect(a.eq(b)).toBe(true);
    });

    it('should return false for different vectors', () => {
      const a = new Vector({ col: 5, row: 10 });
      const b = new Vector({ col: 3, row: 7 });
      expect(a.eq(b)).toBe(false);
    });
  });

  describe('invert()', () => {
    it('should invert positive vector', () => {
      const vector = new Vector({ col: 5, row: 10 });
      const inverted = vector.invert();
      expect(inverted.col).toBe(-5);
      expect(inverted.row).toBe(-10);
    });

    it('should invert negative vector', () => {
      const vector = new Vector({ col: -5, row: -10 });
      const inverted = vector.invert();
      expect(inverted.col).toBe(5);
      expect(inverted.row).toBe(10);
    });

    it('should invert mixed sign vector', () => {
      const vector = new Vector({ col: 5, row: -10 });
      const inverted = vector.invert();
      expect(inverted.col).toBe(-5);
      expect(inverted.row).toBe(10);
    });
  });

  describe('toString()', () => {
    it('should format positive values with plus sign', () => {
      const vector = new Vector({ col: 5, row: 10 });
      expect(vector.toString()).toBe('+10,+5');
    });

    it('should format negative values without plus sign', () => {
      const vector = new Vector({ col: -5, row: -10 });
      expect(vector.toString()).toBe('-10,-5');
    });

    it('should format mixed sign values', () => {
      const vector = new Vector({ col: 5, row: -10 });
      expect(vector.toString()).toBe('-10,+5');
    });

    it('should format zero values', () => {
      const vector = new Vector({ col: 0, row: 0 });
      expect(vector.toString()).toBe('0,0');
    });
  });

  describe('toJSON()', () => {
    it('should convert to JSON string', () => {
      const vector = new Vector({ col: 5, row: 10 });
      expect(vector.toJSON()).toBe('Vector(+10,+5)');
    });
  });

  describe('VECTORS constants', () => {
    it('should have correct N vector', () => {
      expect(VECTORS.N.col).toBe(0);
      expect(VECTORS.N.row).toBe(-1);
    });

    it('should have correct E vector', () => {
      expect(VECTORS.E.col).toBe(1);
      expect(VECTORS.E.row).toBe(0);
    });

    it('should have correct S vector', () => {
      expect(VECTORS.S.col).toBe(0);
      expect(VECTORS.S.row).toBe(1);
    });

    it('should have correct W vector', () => {
      expect(VECTORS.W.col).toBe(-1);
      expect(VECTORS.W.row).toBe(0);
    });

    it('should have correct NE vector', () => {
      expect(VECTORS.NE.col).toBe(1);
      expect(VECTORS.NE.row).toBe(-1);
    });

    it('should have correct NW vector', () => {
      expect(VECTORS.NW.col).toBe(-1);
      expect(VECTORS.NW.row).toBe(-1);
    });

    it('should have correct SE vector', () => {
      expect(VECTORS.SE.col).toBe(1);
      expect(VECTORS.SE.row).toBe(1);
    });

    it('should have correct SW vector', () => {
      expect(VECTORS.SW.col).toBe(-1);
      expect(VECTORS.SW.row).toBe(1);
    });
  });
});
