import { join } from 'path';
import fs from 'fs';
import { transformSync } from '@babel/core';
import { getStructure } from '../structure.js';
import buildCliServer from './build-cli-server.js';

async function toCjs(mjsFile, cjsFile) {
  const options = {
    compact: true,
    plugins: ['babel-plugin-transform-import-meta','@babel/plugin-transform-modules-commonjs'],
    sourceType: 'module'
  };

  const mjsCode = await fs.promises.readFile(mjsFile, 'utf8');
  const { code } = transformSync(mjsCode, options);
  await fs.promises.writeFile(cjsFile, code);
}

async function mjsToCjs() {
  await buildCliServer();

  const { dest } = await getStructure();

  const mjsFile = join(dest, 'cli-server.mjs');
  const cjsFile = join(dest, 'cli-server.cjs');

  await toCjs(mjsFile, cjsFile);

  const exeFile = join(dest, 'server');
  return { cjsFile, exeFile };
}

export default mjsToCjs;
