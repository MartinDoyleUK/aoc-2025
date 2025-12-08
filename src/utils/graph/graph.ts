/* eslint-disable canonical/id-match */

import { GraphNode } from './graph-node.js';

/**
 * Represents a directed acyclic graph (DAG) with a single root node.
 * Nodes can have multiple parents and multiple children, but the graph must remain acyclic.
 * All nodes are reachable from the root node.
 * @template TId - The type of the node identifiers
 */
export class Graph<TId> {
  /**
   * Gets a read-only view of the nodes by their IDs.
   * To maintain graph integrity, nodes should be added using the add() method.
   */
  public get nodesById(): ReadonlyMap<TId, GraphNode<TId>> {
    return this._nodesById;
  }

  /**
   * Gets the root node of the graph.
   * All other nodes in the graph are descendants of this root.
   */
  public get root(): GraphNode<TId> {
    return this._root;
  }

  private _nodesById = new Map<TId, GraphNode<TId>>();

  private _root: GraphNode<TId>;

  /**
   * Creates a new graph with a root node.
   * @param rootId - The identifier for the root node
   */
  public constructor(rootId: TId) {
    this._root = new GraphNode(rootId);
    this._nodesById.set(rootId, this._root);
  }

  /**
   * Adds a child node to a parent node in the graph.
   * If the child node already exists in the graph, it will be reused (creating a DAG structure
   * where the child has multiple parents). If it doesn't exist, a new node will be created.
   * @param childId - The identifier for the child node
   * @param parent - Either the parent node itself or its identifier
   * @throws {Error} If the parent node is not found in the graph
   */
  public add(childId: TId, parent: GraphNode<TId> | TId): void {
    const parentNode = this.getNode(parent);
    if (!parentNode) {
      throw new Error(
        `Cannot add child. Parent not found: "${JSON.stringify(parent)}"`,
      );
    }

    const child = this._nodesById.get(childId) ?? new GraphNode<TId>(childId);

    parentNode.addChild(child);
    this._nodesById.set(childId, child);
  }

  /**
   * Retrieves a node from the graph by its ID or returns the node if already a GraphNode instance.
   * @param idOrNode - Either a node ID or a GraphNode instance
   * @returns The GraphNode if found, undefined otherwise
   */
  private getNode(idOrNode: unknown): GraphNode<TId> | undefined {
    if (idOrNode instanceof GraphNode) {
      // Verify the node is actually in this graph
      const node = idOrNode as GraphNode<TId>;

      return this._nodesById.get(node.id) === node ? node : undefined;
    }

    return this._nodesById.get(idOrNode as TId);
  }
}
