import 'dotenv/config';
import { z } from 'zod';

const ConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4100),
  FRONTEND_ORIGIN: z.string().default('http://localhost:5173'),
  STORE_PATH: z.string().default('.data/store.json'),
  API_AUTH_TOKEN: z.string().min(16).default('local-dev-token-change-me'),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  API_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  DATAFORSEO_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  DATAFORSEO_LOGIN: z.string().optional(),
  DATAFORSEO_PASSWORD: z.string().optional(),
  DATAFORSEO_BASE_URL: z.string().url().default('https://api.dataforseo.com'),
  DATAFORSEO_PRIMARY_LANGUAGE: z.string().default('English'),
  DATAFORSEO_PRIMARY_LOCATION: z.string().default('United States'),
  DATAFORSEO_MOCK_MODE: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
});

export const config = ConfigSchema.parse(process.env);

export const isLiveDataForSeoEnabled = Boolean(
  config.DATAFORSEO_LOGIN && config.DATAFORSEO_PASSWORD && !config.DATAFORSEO_MOCK_MODE,
);
