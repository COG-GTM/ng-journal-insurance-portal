import { test, expect } from '@playwright/test';
import { api, dataRows, expectRequiredError, open, pickDate, pickOption, saveButton, stamp } from './helpers';

test.describe('complaint', () => {
  test('list shows every complaint and opens details', async ({ page }) => {
    const complaints = await api<any[]>('complaints');
    await open(page, '/complaint/list', 'Complaints');
    await expect(page.locator('table thead th')).toHaveText(['Type', 'Customer', 'Date', 'Description']);
    await expect(dataRows(page)).toHaveCount(complaints.length);
    await expect(dataRows(page).first()).toContainText(complaints[0].description);
    await dataRows(page).first().click();
    await expect(page).toHaveURL(new RegExp(`/complaint/${complaints[0].id}/details$`));
  });

  test('details shows fields and links to the customer', async ({ page }) => {
    const [complaint] = await api<any[]>('complaints');
    const customer = await api<any>(`customers/${complaint.customer}`);
    await open(page, `/complaint/${complaint.id}/details`, 'Complaint Details');
    await expect(page.getByText(complaint.type, { exact: true })).toBeVisible();
    await expect(page.getByText(complaint.description, { exact: true })).toBeVisible();
    await page.getByRole('link', { name: `${customer.firstName} ${customer.lastName}` }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/${customer.id}/details$`));
  });

  test('create validates and saves a complaint', async ({ page }) => {
    const description = `Parity complaint ${stamp()}`;
    await open(page, '/complaint/create', 'Complaint Create');
    await expect(saveButton(page)).toBeDisabled();
    await page.locator('#description').fill('x');
    await page.locator('#description').fill('');
    await expectRequiredError(page, 1);
    await page.locator('#description').fill(description);
    await expectRequiredError(page, 0);
    await pickOption(page, 'Select type');
    await pickOption(page, 'Select customer');
    await pickDate(page, 'date', '06/30/2025');
    await expect(saveButton(page)).toBeEnabled();
    await saveButton(page).click();
    await expect(page.getByText('Complaint created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/complaint\/[^/]+\/details$/);
    await expect(page.getByText(description, { exact: true })).toBeVisible();
    await expect(page.getByText('Jun 30, 2025', { exact: true })).toBeVisible();
    await open(page, '/complaint/list', 'Complaints');
    await expect(dataRows(page).filter({ hasText: description })).toHaveCount(1);
  });
});
