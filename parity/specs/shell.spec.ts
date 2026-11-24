import { test, expect } from '@playwright/test';
import { open } from './helpers';

test('root redirects to home and shows the shell', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Insurance Portal' })).toHaveAttribute('href', 'https://www.ng-journal.com');
  const nav = page.getByRole('navigation');
  for (const domain of ['GENERAL', 'CONTRACT', 'CLAIM', 'COMPLAINT', 'CUSTOMER']) {
    await expect(nav.getByText(domain, { exact: true })).toBeVisible();
  }
  await expect(nav.getByText('Home')).toBeVisible();
  await expect(nav.getByText('List')).toHaveCount(4);
  await expect(nav.getByText('Create')).toHaveCount(3);
});

test('home cards navigate to each list', async ({ page }) => {
  for (const [card, url, heading] of [
    ['Contracts', /\/contract\/list$/, 'Contracts'],
    ['Claims', /\/claim\/list$/, 'Claims'],
    ['Complaints', /\/complaint\/list$/, 'Complaints'],
    ['Customers', /\/customer\/list$/, 'Customers'],
  ] as const) {
    await open(page, '/home', 'Home');
    await page.getByRole('link', { name: card }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});

test('sidebar navigates and highlights the active route', async ({ page }) => {
  await open(page, '/home', 'Home');
  const nav = page.getByRole('navigation');
  await nav.getByText('List').nth(1).click();
  await expect(page).toHaveURL(/\/claim\/list$/);
  await nav.getByText('Create').nth(2).click();
  await expect(page).toHaveURL(/\/complaint\/create$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Complaint Create' })).toBeVisible();
  await nav.getByText('Home').click();
  await expect(page).toHaveURL(/\/home$/);
});

test('unknown route shows page not found', async ({ page }) => {
  await page.goto('/nope/nothing');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  await expect(page.getByText('Sorry, but the page you were trying to view does not exist.')).toBeVisible();
});
