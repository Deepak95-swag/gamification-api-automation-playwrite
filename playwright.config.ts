import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env at config load time so tests can read process.env
dotenv.config();

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    workers: 1, // Run tests sequentially
    use: {
        baseURL: process.env.BASE_URL,
        trace: 'on-first-retry'
    },
    fullyParallel: false,
    testMatch: [
        '**/rewardRallyFlow.spec.ts',
    ],
    reporter: [['list'], ['html']]
});
