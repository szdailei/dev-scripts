import { join } from 'path';
import { existsSync } from 'fs';
import builtinModules from 'builtin-modules';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import shell from 'shelljs';
import { getStructure } from '../structure.js';
import { plugins, rollupBuild } from './rollup.js';

async function cleanPdf() {
  const { dest } = await getStructure();

  const destServerFile = join(dest, 'cli-pdf.js');
  if (existsSync(destServerFile)) {
    shell.rm(destServerFile);
  }

  const destServerFileOfCjs = join(dest, 'cli-pdf.cjs');
  if (existsSync(destServerFileOfCjs)) {
    shell.rm(destServerFileOfCjs);
  }
}

async function buildPdfOfMjsFormat() {
  const { dest, cli } = await getStructure();

  const nodePlugins = [...plugins, json()];

  const compileMode = process.env.NODE_ENV;
  nodePlugins[1] =   replace({
    'process.env.NODE_ENV': JSON.stringify(compileMode),
    preventAssignment: true,
    delimiters: ['', ''],
    '#!/usr/bin/env node': '',
    'const puppeteerRootDirectory = pkgDir.sync(__dirname)':'const puppeteerRootDirectory = pkgDir.sync(process.cwd())',
    "const pkg = require('../../../../package.json')":"const pkg ={version:'1.0.0'}",
    "return require('debug')(prefix)":"return (function dummmy(){})"
  })

  const inputOptions = {
    input: join(cli, 'cli-pdf.js'),
    plugins: nodePlugins,
    external: builtinModules,
    treeshake: {
      preset: 'smallest',
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  };

  const outputOptions = {
    dir: dest,
    format: 'esm',
    entryFileNames: 'cli-pdf.js',
    chunkFileNames: '[name]-[hash].js',
  };

  await rollupBuild(inputOptions, outputOptions);
}

async function buildPdf() {
  await buildPdfOfMjsFormat();
}

export { buildPdf, cleanPdf };
