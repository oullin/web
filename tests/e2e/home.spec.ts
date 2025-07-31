import { test, expect } from '@playwright/test';

test('home page loads hero text', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: /I write about coding/i })
  ).toBeVisible();
});
