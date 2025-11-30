import { describe, expect, it } from 'vitest';

import { Point } from './point.js';
import { Vector } from './vector.js';

describe('Point', () => {
  describe('constructor', () => {
    it('should create point from ColRow object', () => {
      const point = new Point({ col: 5, row: 10 });
      expect(point.col).toBe(5);
      expect(point.row).toBe(10);
    });

    it('should create point from string', () => {
      const point = new Point('10,5');
      expect(point.col).toBe(5);
      expect(point.row).toBe(10);
    });

    it('should create point from signed string', () => {
      const point = new Point('-10,+5');
      expect(point.col).toBe(5);
      expect(point.row).toBe(-10);
    });

    it('should create point from Symbol with description', () => {
      const symbol = Symbol.for('10,5');
      const point = new Point(symbol);
      expect(point.col).toBe(5);
      expect(point.row).toBe(10);
    });

    it('should throw error for Symbol without description', () => {
      // eslint-disable-next-line symbol-description
      const symbol = Symbol();
      expect(() => new Point(symbol)).toThrow('Supplied Symbol has no description');
    });

    it('should throw error for invalid string format', () => {
      expect(() => new Point('invalid')).toThrow('Cannot convert "invalid" to Point');
    });

    it('should round-trip via toString()', () => {
      const original = new Point({ col: -3, row: 7 });
      const clone = new Point(original.toString());
      expect(clone.col).toBe(-3);
      expect(clone.row).toBe(7);
    });
  });

  describe('getters', () => {
    it('should get col and row', () => {
      const point = new Point({ col: 3, row: 7 });
      expect(point.col).toBe(3);
      expect(point.row).toBe(7);
    });

    it('should get id as Symbol', () => {
      const point = new Point({ col: 3, row: 7 });
      const id = point.id;
      expect(typeof id).toBe('symbol');
      expect(id.description).toBe('7,3');
    });
  });

  describe('compare()', () => {
    it('should return 0 for equal points', () => {
      const a = new Point({ col: 5, row: 10 });
      const b = new Point({ col: 5, row: 10 });
      expect(Point.compare(a, b)).toBe(0);
    });

    it('should return -1 when first row is smaller', () => {
      const a = new Point({ col: 5, row: 5 });
      const b = new Point({ col: 5, row: 10 });
      expect(Point.compare(a, b)).toBe(-1);
    });

    it('should return 1 when first row is larger', () => {
      const a = new Point({ col: 5, row: 10 });
      const b = new Point({ col: 5, row: 5 });
      expect(Point.compare(a, b)).toBe(1);
    });

    it('should return -1 when rows equal and first col is smaller', () => {
      const a = new Point({ col: 3, row: 5 });
      const b = new Point({ col: 7, row: 5 });
      expect(Point.compare(a, b)).toBe(-1);
    });

    it('should return 1 when rows equal and first col is larger', () => {
      const a = new Point({ col: 7, row: 5 });
      const b = new Point({ col: 3, row: 5 });
      expect(Point.compare(a, b)).toBe(1);
    });
  });

  describe('applyVector()', () => {
    it('should apply vector forward', () => {
      const point = new Point({ col: 5, row: 10 });
      const vector = new Vector({ col: 2, row: 3 });
      const result = point.applyVector(vector);
      expect(result.col).toBe(7);
      expect(result.row).toBe(13);
    });

    it('should apply vector in reverse', () => {
      const point = new Point({ col: 5, row: 10 });
      const vector = new Vector({ col: 2, row: 3 });
      const result = point.applyVector(vector, true);
      expect(result.col).toBe(3);
      expect(result.row).toBe(7);
    });
  });

  describe('getDistanceTo()', () => {
    it('should calculate distance between two points', () => {
      const a = new Point({ col: 0, row: 0 });
      const b = new Point({ col: 3, row: 4 });
      expect(a.getDistanceTo(b)).toBe(5);
    });

    it('should calculate distance for same point', () => {
      const a = new Point({ col: 5, row: 5 });
      expect(a.getDistanceTo(a)).toBe(0);
    });
  });

  describe('getVectorTo()', () => {
    it('should get vector to another point', () => {
      const a = new Point({ col: 2, row: 3 });
      const b = new Point({ col: 5, row: 7 });
      const vector = a.getVectorTo(b);
      expect(vector.col).toBe(3);
      expect(vector.row).toBe(4);
    });

    it('should get negative vector when target is behind', () => {
      const a = new Point({ col: 5, row: 7 });
      const b = new Point({ col: 2, row: 3 });
      const vector = a.getVectorTo(b);
      expect(vector.col).toBe(-3);
      expect(vector.row).toBe(-4);
    });
  });

  describe('neighbours()', () => {
    it('should return cardinal neighbours in order N,E,S,W by default', () => {
      const point = new Point({ col: 2, row: 2 });
      const neighbours = point.neighbours();
      expect(neighbours.map((p) => p.toString())).toEqual(['1,2', '2,3', '3,2', '2,1']);
    });
  });

  describe('toString()', () => {
    it('should convert to string', () => {
      const point = new Point({ col: 5, row: 10 });
      expect(point.toString()).toBe('10,5');
    });
  });

  describe('toJSON()', () => {
    it('should convert to JSON string', () => {
      const point = new Point({ col: 5, row: 10 });
      expect(point.toJSON()).toBe('Point(10,5)');
    });
  });
});
