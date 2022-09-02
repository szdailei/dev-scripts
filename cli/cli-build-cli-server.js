import { buildCliServer, cleanCliServer } from '../scripts/index.js';

(async () => {
  cleanCliServer();

  await buildCliServer();
})();
