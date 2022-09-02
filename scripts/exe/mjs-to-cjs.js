import fs from 'fs';
import { transformSync } from '@babel/core';

async function mjsToCjs(mjsFile, cjsFile) {
  const options = {
    compact: true,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  };
  const mjsCode = await fs.promises.readFile(mjsFile, 'utf8');

  const mjsCodeWithoutImportMeta = mjsCode.replace(
    'import.meta.url',
    `require('url').pathToFileURL(__filename).toString()`
  );

  const { code } = transformSync(mjsCodeWithoutImportMeta, options);
  await fs.promises.writeFile(cjsFile, code);
}

export default mjsToCjs;
