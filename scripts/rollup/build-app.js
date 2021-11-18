import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import { existsSync } from 'fs';
import { join } from 'path';
import shell from 'shelljs';
import { getStructure } from '../structure.js';
import { inputPlugins, rollupBuild } from './rollup.js';

async function cleanApp() {
  const { destOfWeb } = await getStructure();
  if (existsSync(destOfWeb)) {
    shell.rm('-rf', destOfWeb);
  }
}

async function buildApp({ appJsxFile } = {}) {
  const { srcOfClient, srcOfHtml, destOfWeb } = await getStructure();

  const browserPlugins = [...inputPlugins];
  browserPlugins.push(
    postcss({
      plugins: [],
    })
  );
  browserPlugins.push(
    babel({
      babelHelpers: 'bundled',
      plugins: ['@babel/plugin-syntax-jsx'],
      presets: [['@babel/preset-env', { targets: { chrome: 90 } }], '@babel/preset-react'],
      extensions: ['.jsx', '.tsx'],
    })
  );

  const inputFile = appJsxFile || 'app.jsx';

  const inputOptions = {
    input: join(srcOfClient, inputFile),
    plugins: browserPlugins,
  };

  const outputOptions = {
    dir: destOfWeb,
    format: 'esm',
    entryFileNames: 'app.js',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);

  shell.cp('-R', srcOfHtml, destOfWeb);

  return destOfWeb
}

export { buildApp, cleanApp };
