import { test, expect } from "@playwright/test";

test.describe("Distributor Portal - Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the landing page with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Resident Cement/);
    await expect(page.locator("h1")).toContainText("Resident Cement");
  });

  test("should display all feature cards", async ({ page }) => {
    await expect(page.locator("text=Product Catalog")).toBeVisible();
    await expect(page.locator("text=Digital Payments")).toBeVisible();
    await expect(page.locator("text=Order Tracking")).toBeVisible();
    await expect(page.locator("text=Credit Management")).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    await expect(page.locator('a[href="#features"]')).toBeVisible();
    await expect(page.locator('a[href="#stats"]')).toBeVisible();
  });

  test("should display CTA buttons", async ({ page }) => {
    await expect(page.locator("text=Start Free Trial")).toBeVisible();
    await expect(page.locator("text=View Demo")).toBeVisible();
  });

  test("should display statistics section", async ({ page }) => {
    await expect(page.locator("text=Active Distributors")).toBeVisible();
    await expect(page.locator("text=Orders Processed")).toBeVisible();
    await expect(page.locator("text=Delivery Success Rate")).toBeVisible();
  });
});

test.describe("Distributor Portal - Authentication", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("should display registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("text=First Name")).toBeVisible();
    await expect(page.locator("text=Company Name")).toBeVisible();
  });
});

test.describe("API Gateway - Health Check", () => {
  test("should return healthy status", async ({ request }) => {
    const response = await request.get("http://localhost:3001/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("healthy");
  });

  test("should allow user login", async ({ request }) => {
    const response = await request.post("http://localhost:3001/api/v1/auth/login", {
      data: {
        email: "test@example.com",
        password: "password123",
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.token).toBeDefined();
  });
});
