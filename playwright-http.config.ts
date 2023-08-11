import type { PlaywrightTestConfig } from '@playwright/test';
import config from './playwright.config';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const httpConfig: PlaywrightTestConfig = {
  ...config,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['html', { open: 'never', outputFolder: 'test-results-http/report' }]]
    : 'line',
  outputDir: 'test-results-http',
};

export default httpConfig;
