declare class Ptr extends Number {}
declare class FunctionPtr extends Ptr {}

type Type = 'i8' | 'i16' | 'i32' | 'i64' | 'float' | 'double' | '*'

declare interface Module {
  stringToUTF8(str: string, ptr: Ptr, size: number): void
  UTF8ToString(ptr: Ptr, maxBytesToRead?: number): string
  lengthBytesUTF8(str: string): number
  getValue(ptr: Ptr, type: Type): number
  setValue(ptr: Ptr, val: number, type: Type): void
  _free(ptr: Ptr): void
  _malloc(size: number): Ptr

  addFunction(fn: Function, signature: string): FunctionPtr
  removeFunction(fnPtr: FunctionPtr): void
  HEAPU8: Uint8Array
  FS: {
    readFile(path: string, opts?: { encoding?: 'binary'; flags?: 'r' }): ArrayBuffer
    readFile(path: string, opts?: { encoding?: 'utf8'; flags?: 'r' }): string
    writeFile(path: string, data: string | ArrayBufferView, opts?: { flags?: 'w' }): void
  }
}
