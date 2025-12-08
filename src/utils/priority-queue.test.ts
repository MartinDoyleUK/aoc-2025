import { describe, expect, it } from 'vitest';

import { PriorityQueue } from './priority-queue.js';

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('should create an empty queue', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });
  });

  describe('enqueue and dequeue', () => {
    it('should enqueue and dequeue items in priority order', () => {
      const queue = new PriorityQueue<string>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue('low', 10);
      queue.enqueue('high', 1);
      queue.enqueue('medium', 5);

      expect(queue.size()).toBe(3);
      expect(queue.dequeue()?.value).toBe('high');
      expect(queue.dequeue()?.value).toBe('medium');
      expect(queue.dequeue()?.value).toBe('low');
    });

    it('should handle single item', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue(42, 1);
      expect(queue.size()).toBe(1);
      expect(queue.dequeue()?.value).toBe(42);
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return undefined when dequeuing from empty queue', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should handle multiple items with same priority', () => {
      const queue = new PriorityQueue<string>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue('first', 5);
      queue.enqueue('second', 5);
      queue.enqueue('third', 5);

      expect(queue.size()).toBe(3);
      // All have same priority, so any order is valid
      const result1 = queue.dequeue();
      const result2 = queue.dequeue();
      const result3 = queue.dequeue();

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
    });

    it('should maintain heap property with many items', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      // Insert items in random order
      const priorities = [15, 3, 20, 8, 1, 12, 5, 18];
      for (const p of priorities) {
        queue.enqueue(p, p);
      }

      // Should dequeue in sorted order
      const sorted = [...priorities].toSorted((a, b) => a - b);
      for (const expected of sorted) {
        expect(queue.dequeue()?.value).toBe(expected);
      }

      expect(queue.isEmpty()).toBe(true);
    });

    it('should work with custom comparator (max heap)', () => {
      // Reverse comparator for max heap
      const queue = new PriorityQueue<number>(
        (a, b) => b.priority - a.priority,
      );

      queue.enqueue(1, 1);
      queue.enqueue(5, 5);
      queue.enqueue(3, 3);

      expect(queue.dequeue()?.value).toBe(5);
      expect(queue.dequeue()?.value).toBe(3);
      expect(queue.dequeue()?.value).toBe(1);
    });
  });

  describe('peek', () => {
    it('should return undefined for empty queue', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );
      expect(queue.peek()).toBeUndefined();
    });

    it('should peek at the highest priority item without removing it', () => {
      const queue = new PriorityQueue<string>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue('low', 10);
      queue.enqueue('high', 1);

      expect(queue.peek()?.value).toBe('high');
      expect(queue.size()).toBe(2); // Size unchanged
      expect(queue.peek()?.value).toBe('high'); // Still there
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty queue', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false for non-empty queue', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );
      queue.enqueue(1, 1);
      expect(queue.isEmpty()).toBe(false);
    });

    it('should return true after removing all items', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );
      queue.enqueue(1, 1);
      queue.dequeue();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('size', () => {
    it('should track size correctly', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      expect(queue.size()).toBe(0);

      queue.enqueue(1, 1);
      expect(queue.size()).toBe(1);

      queue.enqueue(2, 2);
      expect(queue.size()).toBe(2);

      queue.dequeue();
      expect(queue.size()).toBe(1);

      queue.dequeue();
      expect(queue.size()).toBe(0);
    });
  });

  describe('heap operations', () => {
    it('should handle bubble up correctly', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      // Insert in descending order, forcing bubble up
      queue.enqueue(10, 10);
      queue.enqueue(5, 5);
      queue.enqueue(1, 1);

      expect(queue.dequeue()?.value).toBe(1);
    });

    it('should handle bubble down with left child', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue(1, 1);
      queue.enqueue(3, 3);
      queue.enqueue(5, 5);

      queue.dequeue(); // Remove 1, should bubble down
      expect(queue.dequeue()?.value).toBe(3);
    });

    it('should handle bubble down with right child', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue(1, 1);
      queue.enqueue(5, 5);
      queue.enqueue(3, 3);

      queue.dequeue(); // Remove 1, should bubble down
      expect(queue.dequeue()?.value).toBe(3);
    });

    it('should handle complex heap restructuring', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      // Create a larger heap to test multiple levels of bubble down
      for (let i = 1; i <= 10; i++) {
        queue.enqueue(i, i);
      }

      // Remove all items and verify order
      for (let i = 1; i <= 10; i++) {
        expect(queue.dequeue()?.value).toBe(i);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle dequeue to empty then enqueue again', () => {
      const queue = new PriorityQueue<number>(
        (a, b) => a.priority - b.priority,
      );

      queue.enqueue(1, 1);
      queue.dequeue();
      queue.enqueue(2, 2);

      expect(queue.dequeue()?.value).toBe(2);
    });

    it('should work with complex value types', () => {
      type Task = {
        id: number;
        name: string;
      };

      const queue = new PriorityQueue<Task>((a, b) => a.priority - b.priority);

      queue.enqueue({ id: 1, name: 'Low' }, 10);
      queue.enqueue({ id: 2, name: 'High' }, 1);

      expect(queue.dequeue()?.value.name).toBe('High');
      expect(queue.dequeue()?.value.name).toBe('Low');
    });
  });
});
