import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import { readFileSync } from 'fs';

// Read package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  // ESM build
  {
    input: 'src/integration/IntestacyWidget.js',
    output: {
      file: pkg.module.replace('src/', 'dist/'),
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { targets: { esmodules: true } }]
        ]
      }),
      css({ output: 'intestacy-calculator.css' })
    ]
  },
  
  // UMD build (unminified)
  {
    input: 'src/integration/IntestacyWidget.js',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'IntestacyWidget',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { targets: pkg.browserslist }]
        ]
      }),
      css({ output: 'intestacy-calculator.css' })
    ]
  },
  
  // UMD build (minified)
  {
    input: 'src/integration/IntestacyWidget.js',
    output: {
      file: pkg.main.replace('.js', '.min.js'),
      format: 'umd',
      name: 'IntestacyWidget',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { targets: pkg.browserslist }]
        ]
      }),
      terser(),
      css({ output: 'intestacy-calculator.min.css' })
    ]
  }
];