import { config } from './config.js';
import { bootstrapDemoData, createApp, startScheduler } from './app.js';
import { processRunQueue } from './service.js';

const app = createApp();

await bootstrapDemoData();
startScheduler();
setInterval(() => {
  void processRunQueue(undefined, 5);
}, 5_000);

app.listen(config.PORT, () => {
  console.log(`Optimizer backend listening on http://localhost:${config.PORT}`);
});
