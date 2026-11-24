import { test, expect } from '@playwright/test';
import { api, open, shot } from './helpers';

// Read-only pass: one full-page screenshot per page per app, run before the mutating flows.
test.describe('screens', () => {
  test('capture every page', async ({ page }, testInfo) => {
    const [contract] = await api('contracts');
    const [claim] = await api('claims');
    const [complaint] = await api('complaints');
    const [customer] = await api('customers');

    const pages: [string, string, string][] = [
      ['home', '/home', 'Home'],
      ['contract-list', '/contract/list', 'Contracts'],
      ['contract-details', `/contract/${contract.id}/details`, 'Contract Details'],
      ['contract-edit', `/contract/${contract.id}/edit`, 'Contract Edit'],
      ['contract-create', '/contract/create', 'Contract Create'],
      ['claim-list', '/claim/list', 'Claims'],
      ['claim-details', `/claim/${claim.id}/details`, 'Claim Details'],
      ['claim-create', '/claim/create', 'Complaint Create'],
      ['complaint-list', '/complaint/list', 'Complaints'],
      ['complaint-details', `/complaint/${complaint.id}/details`, 'Complaint Details'],
      ['complaint-create', '/complaint/create', 'Complaint Create'],
      ['customer-list', '/customer/list', 'Customers'],
      ['customer-details', `/customer/${customer.id}/details`, 'Customer Details'],
    ];
    for (const [name, route, heading] of pages) {
      await open(page, route, heading);
      await shot(page, testInfo, name);
    }
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    await shot(page, testInfo, 'not-found');
  });
});
