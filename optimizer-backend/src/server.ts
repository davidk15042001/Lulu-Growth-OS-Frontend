import { config } from './config.js';
import { bootstrapDemoData, createApp, startScheduler } from './app.js';
import { processRunQueue } from './service.js';
import { closeDatabaseConnection } from './store.js';

const app = createApp();

await bootstrapDemoData();
const scheduler = startScheduler();
const workerInterval = setInterval(() => {
  void processRunQueue(undefined, 5);
}, 5_000);

const server = app.listen(config.PORT, () => {
  console.log(`Optimizer backend listening on http://localhost:${config.PORT}`);
});

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}, shutting down optimizer backend...`);
  clearInterval(workerInterval);
  scheduler.stop();
  server.close(async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
