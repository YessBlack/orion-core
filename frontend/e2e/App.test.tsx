
import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('debería mostrar el login', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.getByText('Iniciar sesión')).toBeVisible();
  });
});
