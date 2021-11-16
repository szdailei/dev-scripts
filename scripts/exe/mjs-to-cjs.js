import { join } from 'path';
import fs from 'fs';
import { transformSync } from '@babel/core';
import { getStructure } from '../structure.js';
import buildCliServer from './build-cli-server.js';

async function toCjs(mjsFile, cjsFile) {
  const options = {
    compact: true,
    plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-syntax-import-meta'],
  };

  const source = await fs.promises.readFile(mjsFile, 'utf8');
  const { code } = transformSync(source, options);
  await fs.promises.writeFile(cjsFile, code);
}

async function mjsToCjs() {
  await buildCliServer();

  const { dest } = await getStructure();

  const mjsFile = join(dest, 'cli-server.mjs');
  const cjsFile = join(dest, 'server.cjs');
  const exeFile = join(dest, 'server');

  await toCjs(mjsFile, cjsFile);
  return { cjsFile, exeFile };
}

export default mjsToCjs;
