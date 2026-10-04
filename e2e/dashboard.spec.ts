import { test, expect } from '@playwright/test';

test.describe('Personalized Content Dashboard E2E', () => {
  test('loads home page and displays feed content header', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'PulseStream' })).toBeVisible();
    await expect(page.getByPlaceholder('Search news, movies, posts, topics, or authors...')).toBeVisible();
  });

  test('filters content when searching', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder('Search news, movies, posts, topics, or authors...');
    await searchInput.fill('Quantum');

    // Wait for debounced search and verification
    await expect(page.getByText('Quantum Computing Breakthrough')).toBeVisible();
  });

  test('switches tabs to Movies and Favorites', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Movies' }).click();
    await expect(page.getByText('Chronos Paradox')).toBeVisible();

    await page.getByRole('button', { name: 'Favorites' }).click();
    await expect(page.getByText('No favorites saved yet')).toBeVisible();
  });
});
