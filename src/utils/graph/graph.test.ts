import { describe, expect, it } from 'vitest';

import { GraphNode } from './graph-node.js';
import { Graph } from './graph.js';

describe('Graph', () => {
  describe('constructor', () => {
    it('should create a graph with a root node', () => {
      const graph = new Graph('root');
      expect(graph.root).toBeDefined();
      expect(graph.root.id).toBe('root');
    });

    it('should add the root node to nodesById', () => {
      const graph = new Graph('root');
      expect(graph.nodesById.size).toBe(1);
      expect(graph.nodesById.get('root')).toBe(graph.root);
    });

    it('should work with numeric IDs', () => {
      const graph = new Graph(42);
      expect(graph.root.id).toBe(42);
      expect(graph.nodesById.get(42)).toBe(graph.root);
    });

    it('should work with object IDs', () => {
      const id = { name: 'root' };
      const graph = new Graph(id);
      expect(graph.root.id).toBe(id);
      expect(graph.nodesById.get(id)).toBe(graph.root);
    });
  });

  describe('getters', () => {
    it('should return the root node', () => {
      const graph = new Graph('root');
      const root = graph.root;
      expect(root.id).toBe('root');
    });

    it('should return the same root on multiple accesses', () => {
      const graph = new Graph('root');
      const root1 = graph.root;
      const root2 = graph.root;
      expect(root1).toBe(root2);
    });

    it('should return a readonly map of nodes', () => {
      const graph = new Graph('root');
      const nodesById = graph.nodesById;
      expect(nodesById).toBeInstanceOf(Map);
      expect(nodesById.size).toBe(1);
    });
  });

  describe('add', () => {
    it('should add a child node using parent ID', () => {
      const graph = new Graph('root');
      graph.add('child', 'root');

      expect(graph.nodesById.size).toBe(2);
      expect(graph.nodesById.has('child')).toBe(true);
      expect(graph.root.children).toHaveLength(1);
      expect(graph.root.children[0]?.id).toBe('child');
    });

    it('should add a child node using parent node', () => {
      const graph = new Graph('root');
      const rootNode = graph.root;
      graph.add('child', rootNode);

      expect(graph.nodesById.size).toBe(2);
      expect(graph.nodesById.has('child')).toBe(true);
      expect(graph.root.children).toHaveLength(1);
      expect(graph.root.children[0]?.id).toBe('child');
    });

    it('should add multiple children to a parent', () => {
      const graph = new Graph('root');
      graph.add('child1', 'root');
      graph.add('child2', 'root');
      graph.add('child3', 'root');

      expect(graph.nodesById.size).toBe(4);
      expect(graph.root.children).toHaveLength(3);
    });

    it('should add grandchildren', () => {
      const graph = new Graph('root');
      graph.add('child', 'root');
      graph.add('grandchild', 'child');

      expect(graph.nodesById.size).toBe(3);
      const child = graph.nodesById.get('child');
      expect(child?.children).toHaveLength(1);
      expect(child?.children[0]?.id).toBe('grandchild');
    });

    it('should reuse existing nodes to create DAG structure', () => {
      const graph = new Graph('root');
      graph.add('A', 'root');
      graph.add('B', 'root');
      graph.add('C', 'A'); // First add C as child of A
      graph.add('C', 'B'); // Then add same C as child of B

      expect(graph.nodesById.size).toBe(4); // root, A, B, C (not 5!)
      const nodeC = graph.nodesById.get('C');
      expect(nodeC?.parents).toHaveLength(2); // C has two parents
    });

    it('should throw error when parent ID is not found', () => {
      const graph = new Graph('root');
      expect(() => {
        graph.add('child', 'nonexistent');
      }).toThrow('Cannot add child. Parent not found');
    });

    it('should throw error when parent node is not in the graph', () => {
      const graph = new Graph('root');
      const orphanNode = new GraphNode('orphan');
      expect(() => {
        graph.add('child', orphanNode);
      }).toThrow('Cannot add child. Parent not found');
    });

    it('should throw when adding an edge that would create a cycle', () => {
      const graph = new Graph('root');
      graph.add('child', 'root');

      expect(() => {
        graph.add('root', 'child');
      }).toThrow('would create a cycle');
    });

    it('should detect cycles in more complex DAG structures', () => {
      const graph = new Graph('root');
      graph.add('A', 'root');
      graph.add('B', 'A');
      graph.add('C', 'B');

      // Try to add an edge from C back to A (would create cycle A -> B -> C -> A)
      expect(() => {
        graph.add('A', 'C');
      }).toThrow('would create a cycle');
    });

    it('should detect cycles in diamond DAG when adding back edge', () => {
      // Create diamond: root -> A -> C
      //                       -> B /
      const graph = new Graph('root');
      graph.add('A', 'root');
      graph.add('B', 'root');
      graph.add('C', 'A');
      graph.add('C', 'B'); // C now reachable from root via both A and B

      // Try to create a cycle by adding root as child of C
      expect(() => {
        graph.add('root', 'C');
      }).toThrow('would create a cycle');
    });

    it('should handle reachability check with multiple paths to same node', () => {
      // Create: root -> B -> X -> Z
      //                    -> Y -> Z
      const graph = new Graph('root');
      graph.add('B', 'root');
      graph.add('X', 'B');
      graph.add('Y', 'B');
      graph.add('Z', 'X');
      graph.add('Z', 'Y'); // Z reachable from B via two paths

      // Try adding root as child of Z, which checks isReachable(Z, root)
      // This traverses from Z and will encounter nodes multiple times
      expect(() => {
        graph.add('root', 'Z');
      }).toThrow('would create a cycle');
    });

    it('should skip already-visited nodes during reachability check', () => {
      // Create: root -> E -> A -> C
      //                    -> B -> C
      //              -> X
      // E has a diamond pattern below it (both A and B lead to C)
      const graph = new Graph('root');
      graph.add('E', 'root');
      graph.add('A', 'E');
      graph.add('B', 'E');
      graph.add('C', 'A');
      graph.add('C', 'B'); // C is reachable from E via two paths
      graph.add('X', 'root');

      // Try to add E under X
      // This checks isReachable(E, X) - is X reachable from E?
      // X is NOT reachable from E, so we traverse E's entire subgraph
      // During traversal: E -> A -> C, then E -> B -> C (C added twice)
      // When C is popped the second time, it's already visited (else branch hit)
      graph.add('E', 'X'); // Should succeed - no cycle

      // Verify E now has two parents
      const nodeE = graph.nodesById.get('E');
      expect(nodeE?.parents).toHaveLength(2);
    });

    it('should handle adding child to child node', () => {
      const graph = new Graph('root');
      graph.add('child', 'root');
      const childNode = graph.nodesById.get('child');
      if (!childNode) {
        throw new Error('Child not found');
      }

      graph.add('grandchild', childNode);

      expect(graph.nodesById.size).toBe(3);
      expect(childNode.children).toHaveLength(1);
      expect(childNode.children[0]?.id).toBe('grandchild');
    });

    it('should maintain bidirectional relationships', () => {
      const graph = new Graph('root');
      graph.add('child', 'root');

      const rootNode = graph.root;
      const childNode = graph.nodesById.get('child');

      expect(rootNode.children[0]).toBe(childNode);
      expect(childNode?.parents[0]).toBe(rootNode);
    });
  });

  describe('complex DAG structures', () => {
    it('should create a diamond DAG structure', () => {
      // root -> A -> C
      //      -> B /
      const graph = new Graph('root');
      graph.add('A', 'root');
      graph.add('B', 'root');
      graph.add('C', 'A');
      graph.add('C', 'B');

      expect(graph.nodesById.size).toBe(4);
      const nodeC = graph.nodesById.get('C');
      expect(nodeC?.parents).toHaveLength(2);

      const paths = graph.root.getChildPaths();
      expect(paths).toHaveLength(2);
      expect(paths).toContainEqual(['root', 'A', 'C']);
      expect(paths).toContainEqual(['root', 'B', 'C']);
    });

    it('should create a complex multi-level DAG', () => {
      //       root
      //      /    \
      //     A      B
      //    / \    /
      //   C   D  /
      //    \ / \/
      //     E
      const graph = new Graph('root');
      graph.add('A', 'root');
      graph.add('B', 'root');
      graph.add('C', 'A');
      graph.add('D', 'A');
      graph.add('D', 'B');
      graph.add('E', 'C');
      graph.add('E', 'D');

      expect(graph.nodesById.size).toBe(6);

      const nodeD = graph.nodesById.get('D');
      const nodeE = graph.nodesById.get('E');

      expect(nodeD?.parents).toHaveLength(2); // D has parents A and B
      expect(nodeE?.parents).toHaveLength(2); // E has parents C and D
    });
  });

  describe('integration with GraphNode', () => {
    it('should work correctly with GraphNode.getChildPaths', () => {
      const graph = new Graph('root');
      graph.add('A', 'root');
      graph.add('B', 'A');
      graph.add('C', 'B');

      const paths = graph.root.getChildPaths();
      expect(paths).toEqual([['root', 'A', 'B', 'C']]);
    });

    it('should work correctly with GraphNode.hasChildren', () => {
      const graph = new Graph('root');
      expect(graph.root.hasChildren()).toBe(false);

      graph.add('child', 'root');
      expect(graph.root.hasChildren()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string IDs', () => {
      const graph = new Graph('');
      expect(graph.root.id).toBe('');
      graph.add('child', '');
      expect(graph.nodesById.size).toBe(2);
    });

    it('should handle null as an ID', () => {
      const graph = new Graph<null | string>(null);
      expect(graph.root.id).toBe(null);
      graph.add('child', null);
      expect(graph.nodesById.size).toBe(2);
    });

    it('should handle undefined as an ID', () => {
      const graph = new Graph<string | undefined>(undefined);
      expect(graph.root.id).toBe(undefined);
      graph.add('child', undefined);
      expect(graph.nodesById.size).toBe(2);
    });

    it('should return a ReadonlyMap type for nodesById', () => {
      const graph = new Graph('root');
      graph.add('A', 'root');

      const nodesById = graph.nodesById;

      // The nodesById getter returns ReadonlyMap type,
      // preventing TypeScript from allowing mutations at compile time
      // At runtime, we can still mutate it (it's just a Map),
      // but TypeScript prevents it at compile time
      expect(nodesById).toBeInstanceOf(Map);
      expect(nodesById.size).toBe(2);
    });
  });
});
