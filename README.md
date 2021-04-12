# GLPK compiled to wasm

This package provides the GLPK library build for wasm.
It contains a low-level interface to the GLPK functions and should probably not be used without a wrapper library.

## Example

```js
import glpkWasm from 'glpk-wasm'

glpkWasm().then(mod => {
  const ver = mod._glp_version()
  const verStr = mod.UTF8ToString(ver)
  console.log('GLPK version:', verStr)
})
```
