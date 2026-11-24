import { test, expect } from '@playwright/test';
import { api, dataRows, open } from './helpers';

test.describe('customer', () => {
  test('list shows every customer and opens details', async ({ page }) => {
    const customers = await api<any[]>('customers');
    await open(page, '/customer/list', 'Customers');
    await expect(page.locator('table thead th')).toHaveText(['First name', 'Last name', 'Phone', 'Email', 'Street', 'City', 'State', 'Zip']);
    await expect(dataRows(page)).toHaveCount(customers.length);
    await expect(dataRows(page).first()).toContainText(customers[0].email);
    await dataRows(page).first().click();
    await expect(page).toHaveURL(new RegExp(`/customer/${customers[0].id}/details$`));
  });

  test('details shows person and address', async ({ page }) => {
    const [customer] = await api<any[]>('customers');
    await open(page, `/customer/${customer.id}/details`, 'Customer Details');
    await expect(page.getByRole('heading', { level: 2, name: 'Address' })).toBeVisible();
    for (const v of [customer.firstName, customer.lastName, customer.email, customer.phone,
      customer.address.street, customer.address.city, customer.address.state, customer.address.zip]) {
      await expect(page.getByText(v, { exact: true }).first()).toBeVisible();
    }
  });
});
