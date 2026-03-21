import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for E2E tests
 * This runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  // Create a browser context for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Pre-authenticate to speed up tests
    await page.goto(`${baseURL}/login`);
    await page.fill('input[type="email"]', 'demo@residentcement.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);

    // Save authentication state
    await context.storageState({ path: './e2e/.auth/user.json' });
  } catch (error) {
    console.warn('Auth setup failed, tests will authenticate individually');
  }

  await browser.close();
}

export default globalSetup;
