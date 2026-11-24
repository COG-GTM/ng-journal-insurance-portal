import { test, expect } from '@playwright/test';
import { api, dataRows, expectRequiredError, open, pickDate, pickOption, saveButton, stamp } from './helpers';

test.describe('claim', () => {
  test('list shows every claim and opens details', async ({ page }) => {
    const claims = await api<any[]>('claims');
    await open(page, '/claim/list', 'Claims');
    await expect(page.locator('table thead th')).toHaveText(['Claim number', 'Damage Type', 'Date', 'Policynumber', 'Customer']);
    await expect(dataRows(page)).toHaveCount(claims.length);
    await expect(dataRows(page).first()).toContainText(claims[0].claimNumber);
    await dataRows(page).first().click();
    await expect(page).toHaveURL(new RegExp(`/claim/${claims[0].id}/details$`));
  });

  test('details shows claim and contract fields', async ({ page }) => {
    const [claim] = await api<any[]>('claims');
    const contract = await api<any>(`contracts/${claim.contract}`);
    await open(page, `/claim/${claim.id}/details`, 'Claim Details');
    for (const l of ['Claim Number:', 'Date:', 'Damage Type:', 'Policynumber:', 'Customer:']) {
      await expect(page.getByText(l, { exact: true })).toBeVisible();
    }
    await expect(page.getByText(claim.claimNumber, { exact: true })).toBeVisible();
    await expect(page.getByText(claim.damageType, { exact: true })).toBeVisible();
    await expect(page.getByText(contract.policyNumber, { exact: true })).toBeVisible();
  });

  test('create validates and saves a claim', async ({ page }) => {
    const number = `CL${stamp()}`;
    const description = `Parity claim ${number}`;
    await open(page, '/claim/create', 'Complaint Create');
    await expect(saveButton(page)).toBeDisabled();
    const numberInput = page.locator('#claimNumber');
    await numberInput.fill('x');
    await numberInput.fill('');
    await page.locator('#description').fill('x');
    await page.locator('#description').fill('');
    await expectRequiredError(page, 2);
    await numberInput.fill(number);
    await page.locator('#description').fill(description);
    await expectRequiredError(page, 0);
    await pickDate(page, 'date', '03/02/2025');
    await pickOption(page, 'Select damage type');
    await pickOption(page, 'Select contract');
    await expect(saveButton(page)).toBeEnabled();
    await saveButton(page).click();
    await expect(page.getByText('Claim created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/claim\/[^/]+\/details$/);
    await expect(page.getByText(number, { exact: true })).toBeVisible();
    await expect(page.getByText('Mar 2, 2025', { exact: true })).toBeVisible();
    await open(page, '/claim/list', 'Claims');
    await expect(dataRows(page).filter({ hasText: number })).toHaveCount(1);
  });
});
