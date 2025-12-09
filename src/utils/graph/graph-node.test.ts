import { describe, expect, it } from 'vitest';

import { GraphNode } from './graph-node.js';

describe('GraphNode', () => {
  describe('constructor', () => {
    it('should create a node with an id and no parent', () => {
      const node = new GraphNode('A');
      expect(node.id).toBe('A');
      expect(node.parents).toHaveLength(0);
      expect(node.children).toHaveLength(0);
    });

    it('should create a node with an id and a parent', () => {
      const parent = new GraphNode('parent');
      const child = new GraphNode('child', parent);
      expect(child.id).toBe('child');
      expect(child.parents).toHaveLength(1);
      expect(child.parents[0]).toBe(parent);
      expect(parent.children).toHaveLength(1);
      expect(parent.children[0]).toBe(child);
    });

    it('should work with numeric IDs', () => {
      const node = new GraphNode(42);
      expect(node.id).toBe(42);
    });

    it('should work with object IDs', () => {
      const id = { name: 'test' };
      const node = new GraphNode(id);
      expect(node.id).toBe(id);
    });
  });

  describe('getters', () => {
    it('should return defensive copies of children array', () => {
      const parent = new GraphNode('parent');
      const child1 = new GraphNode('child1');
      parent.addChild(child1);

      const children = parent.children;
      expect(children).toHaveLength(1);

      // Mutating the returned array should not affect the node
      (children as GraphNode<string>[]).push(new GraphNode('child2'));
      expect(parent.children).toHaveLength(1);
    });

    it('should return defensive copies of parents array', () => {
      const parent1 = new GraphNode('parent1');
      const child = new GraphNode('child');
      parent1.addChild(child);

      const parents = child.parents;
      expect(parents).toHaveLength(1);

      // Mutating the returned array should not affect the node
      (parents as GraphNode<string>[]).push(new GraphNode('parent2'));
      expect(child.parents).toHaveLength(1);
    });

    it('should return the same id on multiple accesses', () => {
      const node = new GraphNode('test');
      const id1 = node.id;
      const id2 = node.id;
      expect(id1).toBe(id2);
    });
  });

  describe('addChild', () => {
    it('should add a child to a parent node', () => {
      const parent = new GraphNode('parent');
      const child = new GraphNode('child');

      parent.addChild(child);

      expect(parent.children).toHaveLength(1);
      expect(parent.children[0]).toBe(child);
      expect(child.parents).toHaveLength(1);
      expect(child.parents[0]).toBe(parent);
    });

    it('should support adding multiple children', () => {
      const parent = new GraphNode('parent');
      const child1 = new GraphNode('child1');
      const child2 = new GraphNode('child2');
      const child3 = new GraphNode('child3');

      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);

      expect(parent.children).toHaveLength(3);
      expect(parent.children).toContain(child1);
      expect(parent.children).toContain(child2);
      expect(parent.children).toContain(child3);
    });

    it('should support multiple parents (DAG structure)', () => {
      const parent1 = new GraphNode('parent1');
      const parent2 = new GraphNode('parent2');
      const child = new GraphNode('child');

      parent1.addChild(child);
      parent2.addChild(child);

      expect(child.parents).toHaveLength(2);
      expect(child.parents).toContain(parent1);
      expect(child.parents).toContain(parent2);
    });

    it('should not add duplicate children', () => {
      const parent = new GraphNode('parent');
      const child = new GraphNode('child');

      parent.addChild(child);
      parent.addChild(child); // Add again

      expect(parent.children).toHaveLength(1);
      expect(child.parents).toHaveLength(1);
    });

    it('should not add duplicate parents', () => {
      const parent = new GraphNode('parent');
      const child = new GraphNode('child');

      parent.addChild(child);
      parent.addChild(child); // Add again

      expect(child.parents).toHaveLength(1);
    });
  });

  describe('hasChildren', () => {
    it('should return false for a node with no children', () => {
      const node = new GraphNode('node');
      expect(node.hasChildren()).toBe(false);
    });

    it('should return true for a node with children', () => {
      const parent = new GraphNode('parent');
      const child = new GraphNode('child');
      parent.addChild(child);
      expect(parent.hasChildren()).toBe(true);
    });
  });

  describe('getChildPaths', () => {
    it('should return a single path for a leaf node', () => {
      const node = new GraphNode('A');
      const paths = node.getChildPaths();
      expect(paths).toEqual([['A']]);
    });

    it('should return paths to all leaf descendants', () => {
      // A -> B -> D
      //   -> C -> E
      const a = new GraphNode('A');
      const b = new GraphNode('B');
      const c = new GraphNode('C');
      const d = new GraphNode('D');
      const e = new GraphNode('E');

      a.addChild(b);
      a.addChild(c);
      b.addChild(d);
      c.addChild(e);

      const paths = a.getChildPaths();
      expect(paths).toHaveLength(2);
      expect(paths).toContainEqual(['A', 'B', 'D']);
      expect(paths).toContainEqual(['A', 'C', 'E']);
    });

    it('should handle multiple paths through the same node (DAG)', () => {
      // A -> B -> D
      //   -> C /
      const a = new GraphNode('A');
      const b = new GraphNode('B');
      const c = new GraphNode('C');
      const d = new GraphNode('D');

      a.addChild(b);
      a.addChild(c);
      b.addChild(d);
      c.addChild(d);

      const paths = a.getChildPaths();
      expect(paths).toHaveLength(2);
      expect(paths).toContainEqual(['A', 'B', 'D']);
      expect(paths).toContainEqual(['A', 'C', 'D']);
    });

    it('should return empty array when cycle is detected', () => {
      const a = new GraphNode('A');
      const b = new GraphNode('B');

      a.addChild(b);
      // Manually create a cycle (this would be bad in practice)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (b as any)._children.push(a);

      const paths = a.getChildPaths();
      // The path should stop when it detects the cycle
      expect(paths).toEqual([]);
    });

    it('should handle self-loops', () => {
      const a = new GraphNode('A');
      // Manually create a self-loop (this would be bad in practice)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a as any)._children.push(a);

      const paths = a.getChildPaths();
      expect(paths).toEqual([]);
    });

    it('should work with numeric IDs', () => {
      const node1 = new GraphNode(1);
      const node2 = new GraphNode(2);
      const node3 = new GraphNode(3);

      node1.addChild(node2);
      node2.addChild(node3);

      const paths = node1.getChildPaths();
      expect(paths).toEqual([[1, 2, 3]]);
    });

    it('should preserve ancestor path when provided', () => {
      const a = new GraphNode('A');
      const b = new GraphNode('B');
      a.addChild(b);

      const paths = a.getChildPaths(['ROOT']);
      expect(paths).toEqual([['ROOT', 'A', 'B']]);
    });
  });

  describe('toString', () => {
    it('should return a JSON string for a leaf node', () => {
      const node = new GraphNode('A');
      const str = node.toString();
      const parsed = JSON.parse(str);
      expect(parsed.id).toBe('A');
      expect(parsed.children).toBe('[]');
      expect(parsed.parents).toBe('[]');
    });

    it('should include children in the string representation', () => {
      const parent = new GraphNode('parent');
      const child1 = new GraphNode('child1');
      const child2 = new GraphNode('child2');

      parent.addChild(child1);
      parent.addChild(child2);

      const str = parent.toString();
      expect(str).toContain('parent');
      expect(str).toContain('child1');
      expect(str).toContain('child2');
    });

    it('should include parents in the string representation', () => {
      const parent1 = new GraphNode('parent1');
      const parent2 = new GraphNode('parent2');
      const child = new GraphNode('child');

      parent1.addChild(child);
      parent2.addChild(child);

      const str = child.toString();
      expect(str).toContain('child');
      expect(str).toContain('parent1');
      expect(str).toContain('parent2');
    });
  });
});
