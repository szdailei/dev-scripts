import { buildServer, cleanServer, buildClient, cleanClient } from '../scripts/index.js';

(async () => {
  cleanServer();
  cleanClient();

  await buildServer();
  await buildClient();
})();
