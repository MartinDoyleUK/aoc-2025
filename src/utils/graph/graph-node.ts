/* eslint-disable canonical/id-match */

/**
 * Represents a node in a directed acyclic graph (DAG).
 * Each node can have multiple parents and multiple children.
 * @template TId - The type of the node's identifier
 */
export class GraphNode<TId> {
  /**
   * Gets a defensive copy of the node's children.
   * Modifications to the returned array will not affect the node's internal state.
   */
  public get children(): readonly GraphNode<TId>[] {
    return [...this._children];
  }

  /**
   * Gets the unique identifier for this node.
   */
  public get id(): TId {
    return this._id;
  }

  /**
   * Gets a defensive copy of the node's parents.
   * Modifications to the returned array will not affect the node's internal state.
   */
  public get parents(): readonly GraphNode<TId>[] {
    return [...this._parents];
  }

  private _children: GraphNode<TId>[] = [];

  private _id: TId;

  private _parents: GraphNode<TId>[] = [];

  /**
   * Creates a new graph node.
   * @param id - The unique identifier for this node
   * @param parent - Optional parent node to immediately connect to
   */
  public constructor(id: TId, parent?: GraphNode<TId>) {
    this._id = id;
    if (parent) {
      this._parents.push(parent);
    }
  }

  /**
   * Adds a child node to this node, establishing a directed edge from this node to the child.
   * Also updates the child's parent list to include this node.
   * @param child - The child node to add
   */
  public addChild(child: GraphNode<TId>): void {
    // Use internal access to properly maintain bidirectional relationship
    if (!child._parents.includes(this)) {
      child._parents.push(this);
    }

    if (!this._children.includes(child)) {
      this._children.push(child);
    }
  }

  /**
   * Gets all paths from this node to its descendant leaf nodes.
   * A leaf node is a node with no children.
   * Detects cycles and returns an empty array if a cycle is detected.
   * @param ancestors - The ancestor IDs in the current path (used internally for cycle detection)
   * @returns An array of paths, where each path is an array of node IDs from this node to a leaf
   */
  public getChildPaths(ancestors: TId[] = []): TId[][] {
    // Cycle detection: if this node is already in the ancestor path, we have a cycle
    if (ancestors.includes(this._id)) {
      return [];
    }

    const pathToThis = [...ancestors, this._id];

    if (!this.hasChildren()) {
      return [pathToThis];
    }

    const childPaths: TId[][] = this._children.flatMap((nextChild) => {
      return nextChild.getChildPaths(pathToThis);
    });

    return childPaths;
  }

  /**
   * Checks whether this node has any children.
   * @returns True if the node has at least one child, false otherwise
   */
  public hasChildren(): boolean {
    return this._children.length > 0;
  }

  /**
   * Returns a string representation of this node for debugging purposes.
   * @returns A JSON string containing the node's ID and its children/parent IDs
   */
  public toString(): string {
    return JSON.stringify({
      children: `[${this._children.map((node) => node.id).join('],[')}]`,
      id: this._id,
      parents: `[${this._parents.map((node) => node.id).join('],[')}]`,
    });
  }
}
