import { test, expect } from '@playwright/test';

test('home page loads all main sections', async ({ page }) => {
  await page.goto('/');

  // Verify side navigation links
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

  // Header search box
  await expect(page.getByLabel('Search')).toBeVisible();

  // Hero section
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /I write about coding, engineering, and leadership as a service\./i,
    })
  ).toBeVisible();

  // Content sections
  await expect(
    page.getByRole('heading', { level: 2, name: /Latest Articles/i })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: /Open-Source Projects/i })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: /Popular Talks/i })
  ).toBeVisible();

  // Footer
  await expect(page.getByText(/Copyright/)).toBeVisible();
});
