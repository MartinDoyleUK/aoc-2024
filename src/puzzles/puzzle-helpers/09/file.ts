type FileParams = { offset: number; size: number };

let fileAutoId = 0;

export class File {
  public get blocks() {
    return this.fileBlocks;
  }

  public get id() {
    return this.fileId;
  }

  public get offset() {
    return this.fileOffset;
  }

  public get size() {
    return this.fileSize;
  }

  private fileBlocks: File[];

  private fileId: number;

  private fileOffset: number;

  private fileSize: number;

  public constructor({ offset, size }: FileParams) {
    this.fileId = fileAutoId++;
    this.fileSize = size;
    this.fileOffset = offset;
    this.fileBlocks = Array.from<File>({ length: size }).fill(this);
  }

  public static resetIdCounter() {
    fileAutoId = 0;
  }
}
