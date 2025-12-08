type CompareItems<T> = (a: Item<T>, b: Item<T>) => number;

type Item<T> = {
  priority: number;
  value: T;
};

export class PriorityQueue<TItemType> {
  private compare: (a: Item<TItemType>, b: Item<TItemType>) => number;

  private heap: Array<Item<TItemType>> = [];

  public constructor(compare: CompareItems<TItemType>) {
    this.compare = compare;
  }

  /**
   * Removes and returns the item with the highest priority according to the comparator.
   * For a min-heap (comparator: (a, b) => a.priority - b.priority), returns the smallest priority.
   * For a max-heap (comparator: (a, b) => b.priority - a.priority), returns the largest priority.
   * Returns undefined if the queue is empty.
   */
  public dequeue(): Item<TItemType> | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const minItem = this.heap[0];
    const lastItem = this.heap.pop()!; // Safe: we know heap has at least 2 items

    this.heap[0] = lastItem;
    this.bubbleDown(0);

    return minItem;
  }

  public enqueue(value: TItemType, priority: number): void {
    const item: Item<TItemType> = { priority, value };
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Look at the highest priority item without removing it.
   * The definition of "highest priority" depends on your comparator.
   */
  public peek(): Item<TItemType> | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    return this.heap[0];
  }

  public size(): number {
    return this.heap.length;
  }

  // ---------- private helpers ----------

  private bubbleDown(index: number): void {
    let currentIndex = index;
    const length = this.heap.length;

    while (true) {
      const leftIndex = 2 * currentIndex + 1;
      const rightIndex = 2 * currentIndex + 2;
      let smallestIndex = currentIndex;

      if (
        leftIndex < length &&
        this.compare(this.heap[leftIndex]!, this.heap[smallestIndex]!) < 0
      ) {
        smallestIndex = leftIndex;
      }

      if (
        rightIndex < length &&
        this.compare(this.heap[rightIndex]!, this.heap[smallestIndex]!) < 0
      ) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === currentIndex) {
        break;
      }

      this.swap(currentIndex, smallestIndex);
      currentIndex = smallestIndex;
    }
  }

  private bubbleUp(index: number): void {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);

      if (this.compare(this.heap[currentIndex]!, this.heap[parentIndex]!) < 0) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j]!;
    this.heap[j] = temp!;
  }
}
