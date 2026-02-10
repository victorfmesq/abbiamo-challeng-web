import { test, expect } from '@playwright/test';
import { seedAuthStorage } from './helpers/auth';

const delivery = {
  id: 'delivery-1',
  tracking_code: 'TRK-RESCHEDULE',
  status: 'IN_ROUTE',
  priority: 'NORMAL',
  assigned_driver: 'driver-1',
  recipient: {
    name: 'Alice',
    phone: '000000000',
    document: '00000000000',
    address: {
      street: 'Rua A',
      number: '10',
      neighborhood: 'Centro',
      city: 'Fortaleza',
      state: 'CE',
      zip_code: '60000-000',
      coordinates: { lat: 0, lng: 0 },
    },
  },
  created_at: '2024-01-01T10:00:00Z',
  expected_delivery_at: '2024-01-02T10:00:00Z',
  delivery_attempts: 0,
  timeline: [],
};

test('open bulk actions and close reschedule modal', async ({ page }) => {
  await seedAuthStorage(page);

  // Source: fetchDeliveries in src/features/deliveries/services/deliveriesService.ts
  await page.route('**/deliveries*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    const resourceType = request.resourceType();
    const isApiCall = resourceType === 'xhr' || resourceType === 'fetch';

    if (!isApiCall || request.method() !== 'GET' || url.pathname !== '/deliveries') {
      return route.fallback();
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [delivery],
        meta: { limit: 10, total: 1, page: 1, totalPages: 1 },
      }),
    });
  });

  await page.goto('/deliveries');

  const table = page.getByTestId('e2e-deliveries-table');
  await expect(table).toBeVisible();

  const firstRowCheckbox = table.getByTestId(/row-select-/).first();
  await expect(firstRowCheckbox).toBeVisible();
  await firstRowCheckbox.check({ force: true });

  await page.getByTestId('bulk-actions-open').click();
  await page.getByTestId('bulk-action-reschedule').click();

  const modal = page.getByTestId('reschedule-modal');
  await expect(modal).toBeVisible();

  await modal.getByRole('button', { name: 'Cancelar' }).click();
  await expect(modal).toBeHidden();
});
