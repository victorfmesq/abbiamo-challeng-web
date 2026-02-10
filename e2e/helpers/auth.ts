import { expect, type Page } from '@playwright/test';

export async function loginAsOperator(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('operador@abbiamo.com');
  await page.getByLabel('Senha').fill('abbiamo2024');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/dashboard/);
}

export async function seedAuthStorage(page: Page) {
  // Source: authStorage key in src/services/httpClient.ts
  // Source: session user key in src/features/auth/services/session.ts
  await page.addInitScript(() => {
    localStorage.setItem('auth.token', 'e2e-token');
    localStorage.setItem(
      'auth.user',
      JSON.stringify({
        id: 'e2e-user',
        name: 'E2E Operator',
        email: 'operador@abbiamo.com',
        role: 'operator',
      })
    );
  });
}
