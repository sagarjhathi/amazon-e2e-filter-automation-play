import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* slowMo adds 1.5s per action, so the default 30s is far too short for the brand filter flow */
  timeout: 900_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? Number(process.env.PW_WORKERS ?? 2) : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* In CI each shard writes a blob report (merged into one HTML report afterwards) plus a progress list in the log. */
  reporter: process.env.CI ? [['list'], ['blob']] : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
     launchOptions: {
         // slowMo: 1200, // milliseconds of delay before every Playwright action
    args: ['--disable-blink-features=AutomationControlled'],
  },
    /* Traces are the largest artifact. In CI record one only when a failing test is retried for the first time, without the screenshot filmstrip. Locally keep the full trace on failure and retries. */
    trace: process.env.CI ? { mode: 'on-first-retry', screenshots: false } : 'retain-on-failure-and-retries',
     video: process.env.CI ? 'retain-on-failure' : 'on',
    headless:true,

    /* Max wait for a single action (click, fill, ...) before it fails naming the locator */
    actionTimeout: 15_000,
    /* Max wait for a navigation (goto, reload, ...) */
    navigationTimeout: 30_000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
