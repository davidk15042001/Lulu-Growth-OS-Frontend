import { config } from './config.js';
import { bootstrapDemoData, createApp, startScheduler } from './app.js';

const app = createApp();

await bootstrapDemoData();
startScheduler();

app.listen(config.PORT, () => {
  console.log(`Optimizer backend listening on http://localhost:${config.PORT}`);
});
