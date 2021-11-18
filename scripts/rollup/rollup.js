import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const compileMode = process.env.NODE_ENV;
const inputPlugins = [
  nodeResolve({ extensions: ['.mjs', '.js', '.jsx'], preferBuiltins: false }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(compileMode),
    preventAssignment: true,
    delimiters: ['', ''],
    '#!/usr/bin/env node': '',
  }),
  commonjs(),
];

async function rollupBuild(inputOptions, outputOptions) {
  const bundle = await rollup(inputOptions);

  const sourcemap = process.env.NODE_ENV !== 'production';
  const prodOutputOptions = { ...outputOptions, sourcemap };

  if (process.env.NODE_ENV === 'production') {
    const outputPlugins = [terser({ keep_fnames: true })];
    prodOutputOptions.plugins = outputPlugins;
  }

  await bundle.write(prodOutputOptions);
  await bundle.close();
}

export { inputPlugins, rollupBuild };
