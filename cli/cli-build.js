import { buildServer, cleanServer, buildApp, cleanApp } from '../scripts/index.js';

(async () => {
  cleanServer();
  cleanApp();

  await buildServer();
  await buildApp();
})();
