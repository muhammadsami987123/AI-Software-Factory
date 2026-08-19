import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and displays hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("AI Agents");
    await expect(page.getByRole("link", { name: /Start Building/i }).first()).toBeVisible();
  });

  test("navbar is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("AI Software Factory").first()).toBeVisible();
  });

  test("features section exists", async ({ page }) => {
    await page.goto("/");
    await page.locator("#features").scrollIntoViewIfNeeded();
    await expect(page.locator("#features")).toBeVisible();
  });

  test("CTA navigates to new project", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Start Building/i }).first().click();
    await expect(page).toHaveURL(/projects\/new/);
  });
});

test.describe("Dashboard", () => {
  test("loads dashboard page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Overview");
  });

  test("shows nav sidebar on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard");
    await expect(page.locator("aside")).toBeVisible();
  });
});

test.describe("Projects", () => {
  test("loads projects page", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("h1")).toContainText("Projects");
  });

  test("loads new project page", async ({ page }) => {
    await page.goto("/projects/new");
    await expect(page.locator("h1")).toContainText("New Project");
    await expect(page.locator("form")).toBeVisible();
  });

  test("new project form has required fields", async ({ page }) => {
    await page.goto("/projects/new");
    await expect(page.getByLabel("Project Name")).toBeVisible();
    await expect(page.getByLabel("Product Description")).toBeVisible();
  });
});

test.describe("Agents", () => {
  test("loads agents page", async ({ page }) => {
    await page.goto("/agents");
    await expect(page.locator("h1")).toContainText("Agents");
    await expect(page.getByText("Product Manager")).toBeVisible();
  });
});

test.describe("Settings", () => {
  test("loads settings page", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("h1")).toContainText("Settings");
    await expect(page.getByText("Demo Mode")).toBeVisible();
  });
});
