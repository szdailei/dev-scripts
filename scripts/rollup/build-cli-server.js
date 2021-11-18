import { join } from 'path';
import { existsSync } from 'fs';
import builtinModules from 'builtin-modules';
import shell from 'shelljs';
import { getStructure } from '../structure.js';
import { inputPlugins, rollupBuild } from './rollup.js';

async function cleanCliServer() {
  const { dest } = await getStructure();
  const destServerFile = join(dest, 'cli-server.js');
  if (existsSync(destServerFile)) {
    shell.rm(destServerFile);
  }
}

async function buildCliServer() {
  const { cli, dest } = await getStructure();

  const nodePlugins = [...inputPlugins];
  const inputOptions = {
    input: join(cli, 'cli-server.js'),
    plugins: nodePlugins,
    external: builtinModules,
  };

  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'cli-server.js',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

export {buildCliServer,cleanCliServer}
