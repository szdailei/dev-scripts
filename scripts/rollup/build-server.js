import { join } from 'path';
import { existsSync } from 'fs';
import builtinModules from 'builtin-modules';
import shell from 'shelljs';
import { getStructure } from '../structure.js';
import { inputPlugins, rollupBuild } from './rollup.js';

async function cleanServer() {
  const { dest } = await getStructure();
  const destServerFile = join(dest, 'server.js');
  if (existsSync(destServerFile)) {
    shell.rm(destServerFile);
  }
}

async function buildServer() {
  const { dest, srcOfServer } = await getStructure();

  const nodePlugins = [...inputPlugins];
  const inputOptions = {
    input: join(srcOfServer, 'server.js'),
    plugins: nodePlugins,
    external: builtinModules,
  };

  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'server.js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

export { buildServer, cleanServer };
