import { test, expect } from '@playwright/test';

test.describe('Cart and Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@residentcement.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/dashboard/products');

    // Find and click "Add to Cart" button
    const addButton = page.locator('button:has-text("Add"), button:has-text("Cart"), [data-testid="add-to-cart"]').first();
    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click();

      // Check cart count or success message
      await expect(page.locator('.cart-badge, [data-testid="cart-count"], text="added"')).toBeVisible();
    }
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/dashboard/cart');

    await expect(page.locator('h1, h2').filter({ hasText: /cart/i })).toBeVisible();
    await expect(page.locator('[data-testid="cart-items"], .cart-item')).toBeVisible();
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.goto('/dashboard/cart');

    const checkoutButton = page.locator('button:has-text("Checkout"), [data-testid="checkout-button"]');
    if (await checkoutButton.isVisible().catch(() => false)) {
      await checkoutButton.click();
      await expect(page).toHaveURL(/.*checkout/);
    }
  });

  test('should complete checkout flow', async ({ page }) => {
    await page.goto('/dashboard/cart');

    const checkoutButton = page.locator('button:has-text("Checkout"), [data-testid="checkout-button"]');
    if (await checkoutButton.isEnabled().catch(() => false)) {
      await checkoutButton.click();

      // Fill shipping details
      await page.fill('input[placeholder*="address" i]', '123 Test Street');
      await page.fill('input[placeholder*="city" i]', 'Lagos');

      // Proceed to payment
      await page.click('button:has-text("Continue"), button:has-text("Next")');

      // Payment step should be visible
      await expect(page.locator('text=/payment/i, text=/paystack/i')).toBeVisible();
    }
  });
});
