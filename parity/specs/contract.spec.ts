import { test, expect } from '@playwright/test';
import { api, dataRows, expectRequiredError, open, pickDate, pickOption, saveButton, stamp } from './helpers';

test.describe('contract', () => {
  test('list shows every contract with headers and opens details', async ({ page }) => {
    const contracts = await api<any[]>('contracts');
    await open(page, '/contract/list', 'Contracts');
    await expect(page.locator('table thead th')).toHaveText(['Policynumber', 'Status', 'Insurance Start On', 'Customer', 'Phone', 'Email']);
    await expect(dataRows(page)).toHaveCount(contracts.length);
    await expect(dataRows(page).first()).toContainText(contracts[0].policyNumber);
    await dataRows(page).first().click();
    await expect(page).toHaveURL(new RegExp(`/contract/${contracts[0].id}/details$`));
  });

  test('details shows fields and links to customer and edit', async ({ page }) => {
    const [contract] = await api<any[]>('contracts');
    const customer = await api<any>(`customers/${contract.customer}`);
    await open(page, `/contract/${contract.id}/details`, 'Contract Details');
    for (const l of ['Status:', 'Policynumber:', 'Insurance Start:', 'Customer:', 'Phone:', 'Email:']) {
      await expect(page.getByText(l, { exact: true })).toBeVisible();
    }
    await expect(page.getByText(contract.policyNumber, { exact: true })).toBeVisible();
    await expect(page.getByText(contract.status, { exact: true })).toBeVisible();
    await expect(page.getByText(customer.email, { exact: true })).toBeVisible();
    await page.getByRole('link', { name: `${customer.firstName} ${customer.lastName}` }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/${customer.id}/details$`));
    await page.goBack();
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(new RegExp(`/contract/${contract.id}/edit$`));
    await expect(page.getByRole('heading', { level: 1, name: 'Contract Edit' })).toBeVisible();
  });

  test('create validates, saves and edit updates status', async ({ page }) => {
    const policy = `PW${stamp()}`;
    await open(page, '/contract/create', 'Contract Create');
    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
    await expect(saveButton(page)).toBeDisabled();

    const policyInput = page.locator('#policyNumber');
    await policyInput.fill('x');
    await policyInput.fill('');
    await expectRequiredError(page, 1);
    await policyInput.fill(policy);
    await expectRequiredError(page, 0);
    await expect(saveButton(page)).toBeDisabled();

    await pickOption(page, 'Select customer');
    await pickDate(page, 'insuranceStartOn', '01/15/2025');
    await expect(saveButton(page)).toBeEnabled();
    await saveButton(page).click();

    await expect(page.getByText('Contract created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/contract\/[^/]+\/details$/);
    await expect(page.getByText(policy, { exact: true })).toBeVisible();
    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
    await expect(page.getByText('Jan 15, 2025', { exact: true })).toBeVisible();
    const created = (await api<any[]>('contracts')).find((c) => c.policyNumber === policy);
    expect(created).toBeTruthy();

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(new RegExp(`/contract/${created.id}/edit$`));
    await expect(page.locator('#policyNumber')).toHaveValue(policy);
    await expect(saveButton(page)).toBeDisabled();
    await page.getByText('Pending', { exact: true }).click();
    await page.getByRole('option', { name: 'Active', exact: true }).click();
    await expect(saveButton(page)).toBeEnabled();
    await saveButton(page).click();
    await expect(page.getByText('Contract updated successfully')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/contract/${created.id}/details$`));
    await expect(page.getByText('Active', { exact: true })).toBeVisible();

    await open(page, '/contract/list', 'Contracts');
    await expect(dataRows(page).filter({ hasText: policy })).toHaveCount(1);
  });
});
