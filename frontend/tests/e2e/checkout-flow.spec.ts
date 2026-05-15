import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/');
});

test('user opens product detail, adds product and opens checkout modal', async ({ page }) => {
  await expect(page.locator('.cart-title')).toHaveText('Корзина');

  await page.locator('.product-card').first().click({ position: { x: 20, y: 20 } });
  await expect(page.locator('.product-detail-content')).toBeVisible();
  await expect(page.getByText('Описание')).toBeVisible();
  await page.locator('.close-detail-btn').click();

  const addButton = page.locator('.add-button').first();
  await addButton.click();

  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
  await expect(orderButton).toBeEnabled();
  await orderButton.click();

  await expect(page.locator('.checkout-modal')).toBeVisible();
  await expect(page.getByText('Добавить к заказу?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Продолжить' })).toBeVisible();
});

test('user adds delivery address and sees it in sidebar', async ({ page }) => {
  await page.locator('.address-selector').click();
  await expect(page.getByText('Выбрать адрес')).toBeVisible();

  await page.getByRole('button', { name: 'Новый адрес' }).click();
  await page.getByText('Казань').click();
  await page.getByPlaceholder('Улица и дом').fill('улица Кремлевская, 1');
  await page.getByRole('button', { name: 'Да, всё верно' }).click();

  const activeAddress = page.locator('.address-card.active');
  await expect(activeAddress).toContainText('Казань');
  await expect(activeAddress).toContainText('улица Кремлевская');
  await page.locator('.modal-close-button').click();
  await expect(page.locator('.map-sidebar .address-current')).toContainText('Казань, улица Кремлевская, 1');
});

test('user opens support chat', async ({ page }) => {
  await page.getByTitle('Поддержка').click();
  await expect(page.locator('.chat-window')).toBeVisible();
  await expect(page.getByText('Здравствуйте! Чем я могу вам помочь?')).toBeVisible();
});

test('user signs in and opens profile', async ({ page }) => {
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.getByPlaceholder('900 000 00 00').fill('9000000000');
  await page.getByRole('button', { name: 'Получить код' }).click();
  await page.getByPlaceholder('0 0 0 0').fill('1234');
  await page.getByRole('button', { name: 'Подтвердить' }).click();

  await page.getByRole('button', { name: /9000000000/ }).click();
  await expect(page.locator('.profile-container')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
});
