import { buildCliServer, cleanCliServer, buildApp, cleanApp } from '../scripts/index.js';

(async () => {
  cleanCliServer();
  cleanApp();

  await buildCliServer();
  await buildApp();
})();
