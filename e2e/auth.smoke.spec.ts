import { test, expect } from '@playwright/test';
import { loginAsOperator } from './helpers/auth';

test('login redirects to dashboard', async ({ page }) => {
  await loginAsOperator(page);

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByTestId('dashboard-period')).toBeVisible();
});
