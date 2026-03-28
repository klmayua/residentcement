import { test, expect } from '@playwright/test';

// Visual inspection tests for Resident Cement website
test.describe('Resident Cement - Visual Inspection', () => {
  
  // Test all pages load correctly
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Sustainability', url: '/sustainability/' },
    { name: 'Investors', url: '/investors/' },
    { name: 'Products', url: '/products/' },
    { name: 'Media', url: '/media/' },
    { name: 'Careers', url: '/careers/' },
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} - Page loads successfully`, async ({ page }) => {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 60000 });
      
      // Verify page loads with correct title
      await expect(page).toHaveTitle(/RESIDENT CEMENT/, { timeout: 10000 });
      
      // Take screenshot for visual record
      await page.screenshot({ 
        path: `tests/screenshots/${pageInfo.name.toLowerCase()}-desktop.png`,
        fullPage: true 
      });
      
      console.log(`✓ ${pageInfo.name} loaded successfully`);
    });
  }

  // Test specific page elements
  test('Homepage - Hero section visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Check page has main content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 10000 });
  });

  test('Sustainability - Page loads', async ({ page }) => {
    await page.goto('/sustainability/', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Check page has content
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Investors - Page loads', async ({ page }) => {
    await page.goto('/investors/', { waitUntil: 'networkidle', timeout: 60000 });
    
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Products - Page loads', async ({ page }) => {
    await page.goto('/products/', { waitUntil: 'networkidle', timeout: 60000 });
    
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Media - Page loads', async ({ page }) => {
    await page.goto('/media/', { waitUntil: 'networkidle', timeout: 60000 });
    
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });

  test('Careers - Page loads', async ({ page }) => {
    await page.goto('/careers/', { waitUntil: 'networkidle', timeout: 60000 });
    
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
  });
});
