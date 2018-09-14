import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

function config({ format, min = false, env = 'node', suffix = '' } = {}) {
  const replacer = {
    'process.env.RUN_ENV': JSON.stringify(env)
  }
  if (env === 'browser') {
    suffix = '.browser'
  }

  const c = {
    input: 'index.js',
    output: {
      // exports: 'named',
      file: `dist/psd-to-html${suffix}.${format}${min ? '.min' : ''}.js`,
      format: format, // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
      globals: {
        '@moyuyc/psd': 'PSD'
      }
    },
    name: 'PsdToHtml',
    external: ['es', 'cjs'].includes(format)
      ? id =>
          !!Object.keys(require('./package').dependencies)
            .concat(['babel-runtime', 'fs', 'stream', 'path'])
            .find(x => id.startsWith(x))
      : false,
    // Assume all external modules don't have side effects and remove unused imports
    treeshake: {
      pureExternalImports: true,
      propertyReadSideEffects: true
    },

    plugins: [
      json(),
      replace({
        'process.env.STREAM_PKG_NAME': '"stream"',
        ...replacer
      }),
      commonjs({
        exclude: ['node_modules/core-js/**'],
        ignore: env === 'node' ? [] : ['fs', 'path', 'stream'],
        namedExports: {}
      }),
      babel({
        exclude: '**/node_modules/**',
        externalHelpers: false,
        runtimeHelpers: true
      }),
      resolve({
        browser: true // Default: false
      }), // tells Rollup how to find date-fns in node_modules
      production && min && uglify(), // minify, but only in production
      production && filesize()
    ]
  }

  return c
}

if (production) {
  module.exports = [
    config({
      format: 'umd',
      env: 'browser'
    }),
    config({
      format: 'umd',
      min: true,
      env: 'browser'
    }),
    config({
      format: 'cjs',
      env: 'browser',
      suffix: '.'
    }),
    config({
      format: 'cjs',
      env: 'node'
    }),
    config({
      env: 'node',
      format: 'es'
    })
  ]
} else {
  module.exports = config({ format: 'cjs' })
}
