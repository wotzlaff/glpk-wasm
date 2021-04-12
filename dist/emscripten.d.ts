declare const FS: {
  readFile(name: string, opts?: { encoding?: 'binary'; flags?: 'r' }): ArrayBuffer
  readFile(name: string, opts?: { encoding?: 'utf8'; flags?: 'r' }): string
}

declare class Ptr extends Number {}

declare interface Module {
  stringToUTF8(str: string, ptr: Ptr, size: number): void
  UTF8ToString(ptr: Ptr, maxBytesToRead?: number): string
  setValue(ptr: Ptr, val: number, type: string): void
  _free(ptr: Ptr): void
  _malloc(size: number): Ptr
  HEAPU8: Uint8Array
}
