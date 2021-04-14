import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'dist/libglpk.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    exports: 'auto',
    name: 'GLPK',
  },
  plugins: [commonjs()],
}
