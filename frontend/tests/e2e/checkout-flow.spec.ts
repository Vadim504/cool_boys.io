import { test, expect } from '@playwright/test';

test('user adds product and opens checkout modal', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('text=Корзина')).toBeVisible();

  const addButton = page.locator('.add-button').first();
  await addButton.click();

  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
  await expect(orderButton).toBeEnabled();
  await orderButton.click();

  await expect(page.locator('.checkout-modal')).toBeVisible();
  await expect(page.getByText('Добавить к заказу?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Продолжить' })).toBeVisible();
});
