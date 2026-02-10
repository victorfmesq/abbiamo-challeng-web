import { test, expect } from '@playwright/test';
import { seedAuthStorage } from './helpers/auth';

const baseDelivery = {
  id: 'delivery-1',
  tracking_code: 'TRK-IN',
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

const inRouteDelivery = { ...baseDelivery };
const pendingDelivery = {
  ...baseDelivery,
  id: 'delivery-2',
  tracking_code: 'TRK-PENDING',
  status: 'PENDING',
};

test('filter deliveries by status and clear filters', async ({ page }) => {
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

    const status = url.searchParams.get('status');
    const data = status === 'IN_ROUTE' ? [inRouteDelivery] : [inRouteDelivery, pendingDelivery];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data,
        meta: { limit: 10, total: data.length, page: 1, totalPages: 1 },
      }),
    });
  });

  await page.goto('/deliveries');

  const table = page.getByTestId('e2e-deliveries-table');
  await expect(table).toBeVisible();
  await expect(table).toContainText('TRK-IN');
  await expect(table).toContainText('TRK-PENDING');

  await page.getByLabel('Status').selectOption({ label: 'Em rota' });
  await expect(table).toContainText('TRK-IN');
  await expect(table).not.toContainText('TRK-PENDING');

  const clearFilters = page.getByRole('button', { name: 'Limpar filtros' });
  await expect(clearFilters).toBeVisible();
  await clearFilters.click();

  await expect(table).toContainText('TRK-PENDING');
});
