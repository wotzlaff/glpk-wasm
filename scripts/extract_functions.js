const fs = require('fs')
const data = JSON.parse(fs.readFileSync(0, 'utf-8'))

const ptrTypes = new Set(['TermCallback', 'ErrorCallback'])

function formatType(t) {
  const res = {
    int: 'number',
    void: 'void',
    double: 'number',
    size_t: 'number',
    char: 'Char',
    glp_smcp: 'SMCP',
    glp_prob: 'Problem',
    glp_iptcp: 'IPTCP',
    glp_iocp: 'IOCP',
    glp_bfcp: 'BFCP',
    glp_mpscp: 'MPSCP',
    glp_cpxcp: 'CPXCP',
    // glp_graph: 'Graph',
    // glp_arc: 'Arc',
    glp_tree: 'Tree',
    glp_prep: 'Prep',
    glp_attr: 'Attr',
    glp_tran: 'Translator',
    'void (*)(void *)': 'ErrorCallback',
    'int (*)(void *, const char *)': 'TermCallback',
  }[t]

  if (res !== undefined) {
    return res
  }

  if (t.startsWith('const ')) {
    return formatType(t.substr(6))
  }
  if (t.endsWith(' *')) {
    const res = formatType(t.substr(0, t.length - 2)) + 'Ptr'
    ptrTypes.add(res)
    return res
  }
  throw new Error(`unknown type: ${t}`)
}

function getReturnType(t) {
  const idx = t.indexOf('(')
  return t.substr(0, idx).trim()
}

function filter(method) {
  return ['glp_netgen_prob'].indexOf(method) < 0
}

const signatures = []
const functions = []

data.inner
  .filter(el => el.kind === 'FunctionDecl')
  .filter(el => filter(el.name))
  .forEach(el => {
    try {
      const retType = formatType(getReturnType(el.type.qualType))
      const args = el.inner
        ? el.inner.map(arg => `${arg.name}: ${formatType(arg.type.qualType)}`).join(', ')
        : ''
      signatures.push(`_${el.name}(${args}): ${retType}`)
      functions.push(el.name)
    } catch (err) {
      // signatures.push('// FAIL: ' + el.name)
      functions.push('#' + el.name)
    }
  })

fs.writeFileSync('./exported-functions.txt', functions.join('\n'))

fs.writeFileSync(
  './dist/index.d.ts',
  [
    '///<reference path="./emscripten.d.ts"/>',
    '',
    ...Array.from(ptrTypes, t => `export declare class ${t} extends Ptr {}`),
    '',
    'export declare interface GLPKModule extends Module {',
    ...signatures.map(s => '  ' + s),
    '}',
    '',
    'export default function initialize(): Promise<GLPKModule>',
    '',
  ].join('\n')
)
