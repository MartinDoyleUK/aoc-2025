/* eslint-disable canonical/id-match */

type FileParams = { size: number; startingOffset: number };

let fileAutoId = 0;

export class File {
  public get blocks() {
    return this._blocks;
  }

  public get id() {
    return this._id;
  }

  public get size() {
    return this._size;
  }

  public get startingOffset() {
    return this._startingOffset;
  }

  private _blocks: File[];

  private _id: number;

  private _size: number;

  private _startingOffset: number;

  public constructor({ size, startingOffset }: FileParams) {
    this._id = fileAutoId++;
    this._size = size;
    this._startingOffset = startingOffset;
    this._blocks = Array.from<File>({ length: size }).fill(this);
  }

  public static resetIdCounter() {
    fileAutoId = 0;
  }

  public toJSON() {
    return `File(id=${this._id},offset=${this._startingOffset},size=${this._size})`;
  }
}
