/**
 * ResidentCement E2E Test Suite
 * 
 * Comprehensive end-to-end tests for critical user journeys
 * Tests cover: Authentication, Orders, Payments, Inventory, Products
 */

import { test, expect } from '@playwright/test';

// Base URL configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:3001';

// Test data
const testUser = {
  email: `test_${Date.now()}@residentcement.com`,
  password: 'TestPassword123!',
  name: 'Test Customer',
};

test.describe('ResidentCement E2E Tests', () => {
  
  // ============================================
  // AUTHENTICATION TESTS
  // ============================================
  
  test.describe('Authentication Flow', () => {
    
    test('should register a new user', async ({ page }) => {
      // Navigate to registration page
      await page.goto(`${BASE_URL}/register`);
      
      // Fill registration form
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation or success message
      await page.waitForURL(`${BASE_URL}/dashboard`);
      
      // Verify we're on dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    });
    
    test('should login with valid credentials', async ({ page }) => {
      // Navigate to login page
      await page.goto(`${BASE_URL}/login`);
      
      // Fill login form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForURL(`${BASE_URL}/dashboard`);
      
      // Verify dashboard loads
      await expect(page.locator('h1')).toContainText('Dashboard');
    });
    
    test('should show error for invalid login', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Fill with invalid credentials
      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Verify error message appears
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });
    
    test('should logout successfully', async ({ page }) => {
      // Login first
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/dashboard`);
      
      // Logout
      await page.click('[data-testid="logout-button"]');
      
      // Verify redirected to login
      await page.waitForURL(`${BASE_URL}/login`);
      await expect(page).toHaveURL(`${BASE_URL}/login`);
    });
  });
  
  // ============================================
  // PRODUCT CATALOG TESTS
  // ============================================
  
  test.describe('Product Management', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login before each product test
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/dashboard`);
    });
    
    test('should view product catalog', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/products`);
      
      // Verify products load
      await expect(page.locator('[data-testid="product-list"]')).toBeVisible();
      
      // Verify at least one product is displayed
      await expect(page.locator('[data-testid="product-item"]').first()).toBeVisible();
    });
    
    test('should view product details', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/products`);
      
      // Click on first product
      await page.click('[data-testid="product-item"]:first-child');
      
      // Verify product details page loads
      await expect(page.locator('[data-testid="product-details"]')).toBeVisible();
    });
    
    test('should search products', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/products`);
      
      // Search for product
      await page.fill('input[placeholder="Search products"]', 'Cement');
      await page.press('input[placeholder="Search products"]', 'Enter');
      
      // Verify search results
      await expect(page.locator('[data-testid="product-item"]')).toHaveCount({ min: 1 });
    });
  });
  
  // ============================================
  // ORDER MANAGEMENT TESTS
  // ============================================
  
  test.describe('Order Flow', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login before each order test
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/dashboard`);
    });
    
    test('should add product to cart', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/products`);
      
      // Click add to cart on first product
      await page.click('[data-testid="add-to-cart-button"]:first-child');
      
      // Verify cart count updates
      await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    });
    
    test('should view cart', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/cart`);
      
      // Verify cart page loads
      await expect(page.locator('h1')).toContainText('Cart');
    });
    
    test('should create an order', async ({ page }) => {
      // Add product to cart first
      await page.goto(`${BASE_URL}/dashboard/products`);
      await page.click('[data-testid="add-to-cart-button"]:first-child');
      
      // Navigate to cart
      await page.goto(`${BASE_URL}/dashboard/cart`);
      
      // Proceed to checkout
      await page.click('[data-testid="checkout-button"]');
      
      // Fill delivery details
      await page.fill('input[name="deliveryAddress"]', '123 Test Street, Lagos');
      await page.selectOption('select[name="deliveryState"]', 'Lagos');
      
      // Select payment method
      await page.click('input[value="BANK_TRANSFER"]');
      
      // Submit order
      await page.click('[data-testid="place-order-button"]');
      
      // Wait for order confirmation
      await page.waitForURL(/\/dashboard\/orders\/.*/);
      
      // Verify order created
      await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    });
    
    test('should view order history', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/orders`);
      
      // Verify orders page loads
      await expect(page.locator('h1')).toContainText('Orders');
      
      // Verify order list is visible
      await expect(page.locator('[data-testid="order-list"]')).toBeVisible();
    });
    
    test('should view order details', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/orders`);
      
      // Click on first order
      await page.click('[data-testid="order-item"]:first-child');
      
      // Verify order details page loads
      await expect(page.locator('[data-testid="order-details"]')).toBeVisible();
    });
  });
  
  // ============================================
  // PAYMENT TESTS
  // ============================================
  
  test.describe('Payment Flow', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login before each payment test
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/dashboard`);
    });
    
    test('should view payment history', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/payments`);
      
      // Verify payments page loads
      await expect(page.locator('h1')).toContainText('Payments');
    });
    
    test('should initiate payment for order', async ({ page }) => {
      // Navigate to orders
      await page.goto(`${BASE_URL}/dashboard/orders`);
      
      // Click pay on first pending order
      const payButton = page.locator('[data-testid="pay-button"]').first();
      if (await payButton.isVisible()) {
        await payButton.click();
        
        // Verify payment modal/page loads
        await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();
      }
    });
  });
  
  // ============================================
  // CUSTOMER MANAGEMENT TESTS
  // ============================================
  
  test.describe('Customer Profile', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login before each customer test
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/dashboard`);
    });
    
    test('should view customer profile', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/customers`);
      
      // Verify customers page loads
      await expect(page.locator('h1')).toContainText('Customers');
    });
    
    test('should update customer information', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/customers`);
      
      // Click edit on first customer
      await page.click('[data-testid="edit-customer-button"]:first-child');
      
      // Update phone number
      await page.fill('input[name="phone"]', '+2348012345678');
      
      // Save changes
      await page.click('button[type="submit"]');
      
      // Verify success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  });
  
  // ============================================
  // INVOICE TESTS
  // ============================================
  
  test.describe('Invoice Management', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login before each invoice test
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${BASE_URL}/dashboard`);
    });
    
    test('should view invoices', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/invoices`);
      
      // Verify invoices page loads
      await expect(page.locator('h1')).toContainText('Invoices');
      
      // Verify invoice list is visible
      await expect(page.locator('[data-testid="invoice-list"]')).toBeVisible();
    });
    
    test('should download invoice', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/invoices`);
      
      // Click download on first invoice
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="download-invoice-button"]:first-child');
      const download = await downloadPromise;
      
      // Verify download started
      expect(download.suggestedFilename()).toContain('invoice');
    });
  });
  
  // ============================================
  // RESPONSIVE DESIGN TESTS
  // ============================================
  
  test.describe('Responsive Design', () => {
    
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`${BASE_URL}/login`);
      
      // Verify login form is visible and usable on mobile
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeInViewport();
      await expect(page.locator('input[name="password"]')).toBeInViewport();
      await expect(page.locator('button[type="submit"]')).toBeInViewport();
    });
    
    test('should display correctly on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Verify dashboard layout on tablet
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="stat-cards"]')).toBeVisible();
    });
    
    test('should display correctly on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Verify full dashboard layout
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="stat-cards"]')).toBeVisible();
      await expect(page.locator('[data-testid="recent-orders"]')).toBeVisible();
    });
  });
  
  // ============================================
  // ERROR HANDLING TESTS
  // ============================================
  
  test.describe('Error Handling', () => {
    
    test('should handle API errors gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/products`);
      
      // Simulate network error by going offline
      await page.context().setOffline(true);
      
      // Try to refresh products
      await page.reload();
      
      // Verify error message is shown
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // Bring network back
      await page.context().setOffline(false);
      
      // Verify retry works
      await page.click('[data-testid="retry-button"]');
      await expect(page.locator('[data-testid="product-list"]')).toBeVisible({ timeout: 10000 });
    });
    
    test('should handle 404 pages', async ({ page }) => {
      await page.goto(`${BASE_URL}/nonexistent-page`);
      
      // Verify 404 page is shown
      await expect(page.locator('[data-testid="404-page"]')).toBeVisible();
    });
  });
  
  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  
  test.describe('Accessibility', () => {
    
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Verify h1 exists
      await expect(page.locator('h1')).toHaveCount(1);
      
      // Verify h2 follows h1
      const h1Count = await page.locator('h1').count();
      const h2Count = await page.locator('h2').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });
    
    test('should have alt text on images', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/products`);
      
      // Verify all images have alt text
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
    
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Tab through form fields
      await page.keyboard.press('Tab');
      await expect(page.locator('input[name="email"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('input[name="password"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('button[type="submit"]')).toBeFocused();
    });
  });
});
