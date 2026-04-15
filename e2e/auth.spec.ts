import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page at /auth/login', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1')).toContainText('ImobiDoc');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show register page at /auth/register', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.locator('h1')).toContainText('ImobiDoc');
    await expect(page.locator('button[type="submit"]')).toContainText('Criar Conta');
  });

  test('login form should validate email format', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '12345');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('login form should require minimum password length', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
