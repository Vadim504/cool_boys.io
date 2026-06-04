import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('e2eStorageCleared')) {
      localStorage.clear();
      sessionStorage.setItem('e2eStorageCleared', 'true');
    }
  });
  await page.goto('/');
});

async function authWithSms(
  page: Page,
  phone = '9000000000',
  mode: 'login' | 'register' = 'register'
) {
  await page.getByRole('button', { name: 'Войти' }).first().click();
  const modal = page.locator('.auth-content');

  if (mode === 'register') {
    await modal.getByRole('button', { name: 'Регистрация' }).click();
  }

  await modal.getByPlaceholder('900 000 00 00').fill(phone);
  await modal.getByRole('button', { name: 'Получить код' }).click();
  await modal.getByPlaceholder('0 0 0 0').fill('1234');
  await modal.getByRole('button', { name: 'Подтвердить' }).click();
}

async function signIn(page: Page, phone = '9000000000') {
  await authWithSms(page, phone, 'register');
}

async function openAddressPicker(page: Page) {
  const responsiveAddress = page.locator('.responsive-address-action');
  if (await responsiveAddress.isVisible()) {
    await responsiveAddress.click();
    return;
  }

  await page.locator('.address-selector').click();
}

async function addDeliveryAddress(page: Page, street = 'улица Кремлевская, 1') {
  await openAddressPicker(page);
  await expect(page.getByText('Выбрать адрес')).toBeVisible();
  await page.getByRole('button', { name: 'Новый адрес' }).click();
  await page.getByText('Казань', { exact: true }).click();
  await page.getByPlaceholder('Улица и дом').fill(street);
  await page.getByPlaceholder('Квартира').fill('12');
  await page.getByPlaceholder('Этаж').fill('3');
  await page.getByPlaceholder('Подъезд').fill('2');
  await page.getByPlaceholder('Домофон').fill('45');
  await page.getByPlaceholder('Комментарий').fill('Оставить у двери');
  await page.getByRole('button', { name: 'Да, всё верно' }).click();
  await expect(page.locator('.address-card.active')).toContainText('Казань');
  await page.locator('.modal-close-button').click();
}

test('user opens product detail, adds product and opens checkout modal', async ({ page }) => {
  await signIn(page);
  await addDeliveryAddress(page);

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

test('checkout requires a selected delivery address', async ({ page }) => {
  await signIn(page);
  await page.locator('.add-button').first().click();

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.locator('.checkout-modal')).toHaveCount(0);
  await expect(page.getByText('Выбрать адрес')).toBeVisible();
});

test('auth checks existing users for login and registration', async ({ page }) => {
  await page.getByRole('button', { name: 'Войти' }).first().click();
  let modal = page.locator('.auth-content');

  await modal.getByPlaceholder('900 000 00 00').fill('9100000000');
  await modal.getByRole('button', { name: 'Получить код' }).click();
  await expect(page.getByText('Пользователь с таким номером не найден')).toBeVisible();

  await modal.getByRole('button', { name: 'Регистрация' }).click();
  await modal.getByRole('button', { name: 'Получить код' }).click();
  await modal.getByPlaceholder('0 0 0 0').fill('1234');
  await modal.getByRole('button', { name: 'Подтвердить' }).click();

  await page.getByRole('button', { name: /9100000000/ }).click();
  await page.getByRole('button', { name: 'Выйти из аккаунта' }).click();

  await page.getByRole('button', { name: 'Войти' }).first().click();
  modal = page.locator('.auth-content');
  await modal.getByRole('button', { name: 'Регистрация' }).click();
  await modal.getByPlaceholder('900 000 00 00').fill('9100000000');
  await modal.getByRole('button', { name: 'Получить код' }).click();
  await expect(page.getByText('Пользователь с таким номером уже зарегистрирован')).toBeVisible();

  await modal.getByRole('button', { name: 'Вход' }).click();
  await modal.getByRole('button', { name: 'Получить код' }).click();
  await modal.getByPlaceholder('0 0 0 0').fill('5678');
  await modal.getByRole('button', { name: 'Подтвердить' }).click();
  await expect(page.getByRole('button', { name: /9100000000/ })).toBeVisible();
});

test('user edits and clears cart from sidebar', async ({ page }) => {
  await page.locator('.add-button').first().click();
  await expect(page.locator('.cart-item')).toContainText('Молоко 3.2%');
  await expect(page.locator('.cart-item .stepper__count')).toHaveText('1');

  await page.reload();
  await expect(page.locator('.cart-item')).toContainText('Молоко 3.2%');
  await expect(page.locator('.cart-item .stepper__count')).toHaveText('1');

  await page.getByRole('button', { name: 'Добавить Молоко 3.2%' }).click();
  await expect(page.locator('.cart-item .stepper__count')).toHaveText('2');

  await page.getByRole('button', { name: 'Уменьшить Молоко 3.2%' }).click();
  await expect(page.locator('.cart-item .stepper__count')).toHaveText('1');

  await page.getByRole('button', { name: 'Удалить Молоко 3.2%' }).click();
  await expect(page.locator('.empty-cart-msg')).toHaveText('Корзина пока пуста');

  await page.locator('.add-button').first().click();
  await page.getByRole('button', { name: 'Очистить' }).click();
  await expect(page.locator('.empty-cart-msg')).toHaveText('Корзина пока пуста');

  await page.reload();
  await expect(page.locator('.empty-cart-msg')).toHaveText('Корзина пока пуста');
});

test('catalog click resets category and search filters', async ({ page }) => {
  await page.goto('/category/dairy');
  await page.getByPlaceholder('Поиск...').fill('молоко');
  await expect(page.getByPlaceholder('Поиск...')).toHaveValue('молоко');

  await page.getByRole('link', { name: 'Каталог' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByPlaceholder('Поиск...')).toHaveValue('');
  await expect(page.getByText('Пицца Маргарита')).toBeVisible();
});

test('search page shows results and empty state', async ({ page }) => {
  await page.goto('/search?q=молоко');
  await expect(page.getByText('Результаты по запросу: молоко')).toBeVisible();
  await expect(page.getByText('Молоко 3.2%')).toBeVisible();

  await page.goto('/search?q=несуществующийтовар');
  await expect(page.getByText('Ничего не найдено')).toBeVisible();
});

test('user adds delivery address and sees it in sidebar', async ({ page }) => {
  await signIn(page);
  await page.locator('.address-selector').click();
  await expect(page.getByText('Выбрать адрес')).toBeVisible();

  await page.getByRole('button', { name: 'Новый адрес' }).click();
  await page.getByText('Казань').click();
  await page.getByRole('button', { name: 'Да, всё верно' }).click();
  await expect(page.getByText('Введите улицу и дом', { exact: true })).toBeVisible();

  await page.getByPlaceholder('Улица и дом').fill('улица Кремлевская');
  await page.getByRole('button', { name: 'Да, всё верно' }).click();
  await expect(page.getByText('Укажите номер дома', { exact: true })).toBeVisible();

  await page.getByPlaceholder('Улица и дом').fill('улица Кремлевская, 1');
  await page.getByPlaceholder('Квартира').fill('12');
  await page.getByPlaceholder('Этаж').fill('3');
  await page.getByPlaceholder('Подъезд').fill('2');
  await page.getByPlaceholder('Домофон').fill('45');
  await page.getByPlaceholder('Комментарий').fill('Оставить у двери');
  await page.getByRole('button', { name: 'Да, всё верно' }).click();

  const activeAddress = page.locator('.address-card.active');
  await expect(activeAddress).toContainText('Казань');
  await expect(activeAddress).toContainText('улица Кремлевская');
  await expect(activeAddress).toContainText('подъезд 2');
  await page.locator('.modal-close-button').click();
  await expect(page.locator('.map-sidebar .address-current')).toContainText('Казань, улица Кремлевская, 1');
});

test('user finds a delivery house on the map by address', async ({ page }) => {
  await signIn(page);
  await page.route('https://nominatim.openstreetmap.org/search?*', async (route) => {
    const url = new URL(route.request().url());
    if (!url.searchParams.has('street')) {
      await route.continue();
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          place_id: 1001,
          lat: '55.796127',
          lon: '49.108795',
          display_name: 'Кремлевская улица, 1, Казань, Татарстан, Россия',
          address: {
            road: 'Кремлевская улица',
            house_number: '1',
            city: 'Казань',
          },
        },
      ]),
    });
  });

  await page.locator('.address-selector').click();
  await page.getByRole('button', { name: 'Новый адрес' }).click();
  await page.getByText('Казань').click();
  await page.getByPlaceholder('Улица и дом').fill('Кремлевская улица, 1');
  await page.getByRole('button', { name: 'Найти' }).click();
  await page.getByRole('button', { name: /Кремлевская улица, 1/ }).click();

  await expect(page.getByPlaceholder('Улица и дом')).toHaveValue('Кремлевская улица, 1');
  await expect(page.locator('.leaflet-interactive')).toHaveCount(1);
  await expect(page.locator('.leaflet-interactive')).not.toHaveAttribute('d', 'M0 0');
});

test('user opens support chat', async ({ page }) => {
  await page.getByTitle('Поддержка').click();
  await expect(page.locator('.chat-window')).toBeVisible();
  await expect(page.getByText('Здравствуйте! Чем я могу вам помочь?')).toBeVisible();
});

test('user signs in and opens profile', async ({ page }) => {
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.locator('.auth-content').getByRole('button', { name: 'Регистрация' }).click();
  await page.getByPlaceholder('900 000 00 00').fill('9000000000');
  await page.getByRole('button', { name: 'Получить код' }).click();
  const codeInput = page.getByPlaceholder('0 0 0 0');
  const verifyButton = page.getByRole('button', { name: 'Подтвердить' });
  const codeInputBox = await codeInput.boundingBox();
  const verifyButtonBox = await verifyButton.boundingBox();

  expect(codeInputBox).not.toBeNull();
  expect(verifyButtonBox).not.toBeNull();
  expect(verifyButtonBox!.y - (codeInputBox!.y + codeInputBox!.height)).toBeGreaterThanOrEqual(16);

  await codeInput.fill('1234');
  await verifyButton.click();

  await page.getByRole('button', { name: /9000000000/ }).click();
  await expect(page.locator('.profile-container')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
});

test('user completes mock order, sees it in profile and repeats it', async ({ page }) => {
  await signIn(page);
  await addDeliveryAddress(page);

  await page.locator('.add-button').first().click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await page.getByRole('button', { name: 'Продолжить' }).click();

  await expect(page.locator('.checkout-modal')).toBeHidden();
  await expect(page.locator('.empty-cart-msg')).toHaveText('Корзина пока пуста');

  await page.reload();
  await expect(page.locator('.empty-cart-msg')).toHaveText('Корзина пока пуста');

  await page.getByRole('button', { name: /9000000000/ }).click();
  await expect(page.locator('.order-card')).toBeVisible();
  await expect(page.getByText(/Заказ MF-/)).toBeVisible();

  await page.getByRole('button', { name: 'Повторить заказ' }).click();
  await page.locator('.profile-close-btn').click();

  await expect(page.locator('.cart-item')).toContainText('Молоко 3.2%');
  await expect(page.getByRole('button', { name: 'Оформить заказ' })).toBeEnabled();

  await page.reload();
  await expect(page.locator('.cart-item')).toContainText('Молоко 3.2%');
});

test('orders and addresses are isolated between phone profiles', async ({ page }) => {
  await signIn(page, '9000000000');
  await addDeliveryAddress(page);
  await page.locator('.add-button').first().click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await page.getByRole('button', { name: 'Продолжить' }).click();

  await page.getByRole('button', { name: /9000000000/ }).click();
  await expect(page.locator('.order-card')).toBeVisible();
  await page.getByRole('button', { name: 'Выйти из аккаунта' }).click();

  await signIn(page, '9010000000');
  await page.getByRole('button', { name: /9010000000/ }).click();

  await expect(page.getByText('У вас пока нет заказов')).toBeVisible();
  await expect(page.getByText('Адреса не добавлены')).toBeVisible();
});

test.describe('responsive tablet cart drawer', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('opens cart in a right drawer and exposes quick actions', async ({ page }) => {
    await expect(page.locator('.responsive-actions')).toBeVisible();
    await signIn(page);

    await page.locator('.add-button').first().click();
    await page.getByRole('button', { name: 'Открыть корзину' }).click();

    const drawer = page.locator('.map-sidebar.is-open');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('.cart-item')).toContainText('Молоко 3.2%');

    await expect.poll(async () =>
      drawer.evaluate((el) => Math.round(el.getBoundingClientRect().right))
    ).toBe(768);
    const drawerBox = await drawer.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, width: rect.width };
    });
    expect(drawerBox.x).toBeGreaterThan(300);
    expect(drawerBox.width).toBeLessThanOrEqual(430);

    await drawer.getByRole('button', { name: 'Закрыть корзину' }).click();
    await expect(page.locator('.map-sidebar.is-open')).toHaveCount(0);

    await page.locator('.responsive-address-action').click();
    await expect(page.getByText('Выбрать адрес')).toBeVisible();
    await page.locator('.modal-close-button').click();

    await page.getByRole('button', { name: 'Поддержка' }).click();
    await expect(page.locator('.chat-window')).toBeVisible();
    await page.locator('.chat-close-button').click();

    await page.getByRole('button', { name: 'Открыть профиль' }).click();
    await expect(page.locator('.profile-container')).toBeVisible();
  });
});

test.describe('responsive mobile cart sheet', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens cart in a bottom sheet and keeps checkout flow available', async ({ page }) => {
    await expect(page.locator('.responsive-actions')).toBeVisible();
    await signIn(page);
    await addDeliveryAddress(page);

    await page.locator('.add-button').first().click();
    const cartButton = page.getByRole('button', { name: 'Открыть корзину' });
    await expect(cartButton).toContainText('1');
    await cartButton.click();

    const sheet = page.locator('.map-sidebar.is-open');
    await expect(sheet).toBeVisible();
    await expect(sheet.locator('.cart-item')).toContainText('Молоко 3.2%');

    await expect.poll(async () =>
      sheet.evaluate((el) => Math.round(el.getBoundingClientRect().bottom))
    ).toBe(844);
    const sheetBox = await sheet.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width };
    });
    expect(sheetBox.x).toBe(0);
    expect(sheetBox.width).toBe(390);
    expect(sheetBox.y).toBeGreaterThan(100);
    expect(sheetBox.y).toBeLessThan(844);

    await sheet.getByRole('button', { name: 'Добавить Молоко 3.2%' }).click();
    await expect(sheet.locator('.cart-item .stepper__count')).toHaveText('2');

    await sheet.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.locator('.checkout-modal')).toBeVisible();
    await expect(page.locator('.map-sidebar.is-open')).toHaveCount(0);
    await page.locator('.checkout-close-btn').click();

    await cartButton.click();
    await page.getByRole('button', { name: 'Очистить' }).click();
    await expect(page.locator('.map-sidebar.is-open .empty-cart-msg')).toHaveText('Корзина пока пуста');
  });
});

test.describe('responsive mobile address modal', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('stretches the address form below the map without nested scrollbars', async ({ page }) => {
    await signIn(page);
    await page.locator('.responsive-address-action').click();
    await page.getByRole('button', { name: 'Новый адрес' }).click();

    const citySearchRow = page.locator('.address-search-row');
    const cityList = page.locator('.city-selection-list');
    await expect(citySearchRow).toBeVisible();
    expect(await citySearchRow.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await cityList.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);

    await page.getByText('Казань', { exact: true }).click();

    const map = page.locator('.map-section');
    const form = page.locator('.form-section');
    const mapBox = await map.boundingBox();
    const formBox = await form.boundingBox();

    expect(mapBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(formBox!.y).toBeGreaterThanOrEqual(mapBox!.y + mapBox!.height);
    expect(await form.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
    expect(await form.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
});
