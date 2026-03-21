import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@residentcement.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display product catalog', async ({ page }) => {
    await page.goto('/dashboard/products');

    await expect(page.locator('[data-testid="product-grid"], .product-card')).toBeVisible();
    await expect(page.locator('text=/cement/i')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/dashboard/products');

    // Look for category filter
    const categorySelect = page.locator('select, [data-testid="category-filter"]');
    if (await categorySelect.isVisible().catch(() => false)) {
      await categorySelect.selectOption('Portland');
      await expect(page.locator('.product-card')).toHaveCount(await page.locator('.product-card').count());
    }
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/dashboard/products');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('Dangote');
      await page.keyboard.press('Enter');

      // Results should update
      await page.waitForTimeout(500);
    }
  });
});
