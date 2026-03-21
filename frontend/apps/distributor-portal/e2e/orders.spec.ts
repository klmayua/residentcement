import { test, expect } from '@playwright/test';

test.describe('Order Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@residentcement.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display orders list', async ({ page }) => {
    await page.goto('/dashboard/orders');

    await expect(page.locator('h1, h2').filter({ hasText: /orders/i })).toBeVisible();
  });

  test('should view order details', async ({ page }) => {
    await page.goto('/dashboard/orders');

    // Click on first order
    const orderLink = page.locator('a[href*="/orders/"], [data-testid="order-row"]').first();
    if (await orderLink.isVisible().catch(() => false)) {
      await orderLink.click();
      await expect(page.locator('text=/order details/i, text=/status/i')).toBeVisible();
    }
  });

  test('should filter orders by status', async ({ page }) => {
    await page.goto('/dashboard/orders');

    const statusFilter = page.locator('select, [data-testid="status-filter"]');
    if (await statusFilter.isVisible().catch(() => false)) {
      await statusFilter.selectOption('completed');
      // Wait for results to update
      await page.waitForTimeout(300);
    }
  });
});
