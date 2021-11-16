import { join } from 'path';
import builtinModules from 'builtin-modules';
import { getStructure } from '../structure.js';
import { plugins, rollupBuild } from '../rollup/rollup.js';

async function buildCliServer() {
  const { root, dest } = await getStructure();

  const nodePlugins = [...plugins];
  const inputOptions = {
    input: join(root, 'cli.mjs'),
    plugins: nodePlugins,
    external: builtinModules,
  };

  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'cli-server.mjs',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

export default buildCliServer;
