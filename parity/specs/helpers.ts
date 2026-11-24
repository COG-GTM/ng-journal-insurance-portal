import { expect, Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const API = process.env.API_URL ?? 'http://localhost:3000/api';

export async function api<T = any>(resource: string): Promise<T> {
  const res = await fetch(`${API}/${resource}`);
  expect(res.ok).toBeTruthy();
  return (await res.json()) as T;
}

export function stamp() {
  return `${Date.now()}`.slice(-8);
}

export async function open(page: Page, route: string, heading: string) {
  await page.goto(route);
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
}

export async function shot(page: Page, testInfo: TestInfo, name: string) {
  await page.waitForLoadState('networkidle');
  await page.mouse.move(0, 0);
  const dir = path.join(__dirname, '..', 'report', 'screens', testInfo.project.name);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true, animations: 'disabled' });
}

export function dataRows(page: Page) {
  return page.locator('table tbody tr');
}

export async function pickOption(page: Page, placeholder: string, optionText?: string | RegExp) {
  await page.getByText(placeholder, { exact: true }).click();
  const options = page.getByRole('option');
  await expect(options.first()).toBeVisible();
  if (optionText) {
    await options.filter({ hasText: optionText }).first().click();
  } else {
    await options.first().click();
  }
  await expect(options).toHaveCount(0);
}

export async function pickDate(page: Page, hostId: string, value: string) {
  const input = page.locator(`#${hostId} input`);
  await input.click();
  await input.fill('');
  await input.pressSequentially(value);
  await page.keyboard.press('Escape');
  await page.locator('h1').click();
}

export async function expectRequiredError(page: Page, count: number) {
  await expect(page.getByText('Input is required.')).toHaveCount(count);
}

export function saveButton(page: Page) {
  return page.getByRole('button', { name: 'Save' });
}
