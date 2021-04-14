import glpkWasm from '../dist/index.js'

glpkWasm().then(mod => {
  const ver = mod._glp_version()
  const verStr = mod.UTF8ToString(ver)
  console.log('GLPK version:', verStr)
})
