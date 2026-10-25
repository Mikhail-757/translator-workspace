import { expect, test } from '@playwright/test';

test('all screens render, navigate, and have desktop screenshots', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const screens = [
    ['/login', 'Рады видеть вас', '01-login'],
    ['/register', 'Ваше место в команде', '02-register'],
    ['/', 'С возвращением, Анна', '03-dashboard'],
    ['/documents/new', 'Начнём с оригинала', '04-document-new'],
    ['/documents/1', 'Политика конфиденциальности', '05-editor'],
    ['/tm', 'Память переводов', '06-tm'],
    ['/glossary', 'Глоссарий', '07-glossary'],
    ['/reviews', 'Правки редактора', '08-reviews'],
    ['/profile', 'Мой профиль', '10-profile'],
  ];
  for (const [path, heading, filename] of screens) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `../docs/screenshots/${filename}.png`, fullPage: true });
  }
  await page
    .getByRole('navigation', { name: 'Основная навигация' })
    .getByRole('link', { name: 'Обзор' })
    .click();
  await expect(page).toHaveURL('/');
  await page.getByRole('link', { name: /Политика конфиденциальности/ }).click();
  await expect(page).toHaveURL('/documents/1');
  expect(errors).toEqual([]);
});

for (const width of [360, 768, 1440]) {
  test(`responsive routes at ${width}px and no horizontal page overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      '/',
      '/login',
      '/register',
      '/documents/new',
      '/documents/1',
      '/tm',
      '/glossary',
      '/reviews',
      '/profile',
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `Overflow at ${path} / ${width}`,
      ).toBe(true);
      if (width !== 1440 && (path === '/' || path === '/documents/1')) {
        await page.screenshot({
          path: `../docs/screenshots/${path === '/' ? 'dashboard' : '09-editor'}-${width}.png`,
          fullPage: true,
        });
      }
    }
    if (width === 360) {
      await page.getByRole('button', { name: 'Открыть меню' }).click();
      await page.getByRole('dialog').getByRole('link', { name: 'Память переводов' }).click();
      await expect(page).toHaveURL('/tm');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
  });
}

test('create document, apply suggestion, save and submit a complete translation', async ({
  page,
}) => {
  await page.goto('/documents/new');
  await page.getByLabel('Название документа').fill('Тестовый документ');
  await page.getByLabel('Текст оригинала').fill('A shared language.');
  await page.getByRole('button', { name: 'Перейти к переводу' }).click();
  await expect(page.getByRole('heading', { name: 'Тестовый документ' })).toBeVisible();
  await page.getByLabel('Перевод сегмента 1', { exact: true }).fill('Общий язык.');
  await page.getByRole('button', { name: 'Сохранить переводы' }).click();
  await expect(page.getByText('Все изменения сохранены', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Все документы', exact: true }).click();
  await page.getByRole('link', { name: /Тестовый документ/ }).click();
  await expect(page.getByLabel('Перевод сегмента 1', { exact: true })).toHaveValue('Общий язык.');
  await page.getByRole('button', { name: 'Отправить на проверку' }).click();
  await expect(page.getByText('Режим просмотра', { exact: true })).toBeVisible();
});

test('translation suggestions and incomplete-document validation', async ({ page }) => {
  await page.goto('/documents/1');
  await page.getByRole('button', { name: 'Отправить на проверку' }).click();
  await expect(page.getByText('Сначала переведите все сегменты документа')).toBeVisible();
  await page.getByLabel('Перевод сегмента 5', { exact: true }).focus();
  await page.getByRole('button', { name: 'Использовать перевод' }).click();
  await expect(page.getByLabel('Перевод сегмента 5', { exact: true })).toHaveValue(
    'За помощью обратитесь в службу поддержки.',
  );
  await page.getByRole('button', { name: 'Сохранить переводы' }).click();
  await page.getByRole('link', { name: 'Все документы', exact: true }).click();
  await page.getByRole('link', { name: /Политика конфиденциальности/ }).click();
  await expect(page.getByLabel('Перевод сегмента 5', { exact: true })).toHaveValue(
    'За помощью обратитесь в службу поддержки.',
  );
});

test('memory filters and empty state', async ({ page }) => {
  await page.goto('/tm');
  const search = page.getByRole('textbox', { name: 'Поиск в памяти переводов' });
  await search.fill('encrypted');
  await expect(page.getByRole('row')).toHaveCount(2);
  await expect(
    page.getByText('Все персональные данные шифруются при хранении и передаче.', { exact: true }),
  ).toBeVisible();
  await search.fill('нет-такой-фразы');
  await expect(page.getByText(/Совпадений не найдено/)).toBeVisible();
});

test('glossary add, edit, delete with confirmation', async ({ page }) => {
  await page.goto('/glossary');
  await page.getByRole('button', { name: 'Добавить термин' }).click();
  await page.getByLabel('Термин на английском').fill('release');
  await page.getByLabel('Перевод на русский').fill('релиз');
  await page.getByRole('button', { name: 'Добавить', exact: true }).click();
  await page.getByRole('textbox', { name: 'Поиск терминов' }).fill('release');
  await expect(page.getByText('релиз', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Изменить release', exact: true }).click();
  await page.getByLabel('Перевод на русский').fill('выпуск');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByText('выпуск', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Удалить release', exact: true }).click();
  await page.getByRole('button', { name: 'Удалить', exact: true }).click();
  await expect(page.getByText('Термины не найдены')).toBeVisible();
});

test('editor can approve or return a review', async ({ page }) => {
  await page.goto('/reviews');
  await page.getByRole('button', { name: 'Одобрить', exact: true }).first().click();
  await expect(page.locator('.review-card')).toHaveCount(3);
  const card = page.locator('.review-card').first();
  await card.getByLabel('Комментарий').fill('Уточните формулировку');
  await card.getByRole('button', { name: 'Вернуть на доработку' }).click();
  await expect(page.locator('.review-card')).toHaveCount(2);
  await page.getByText('Все правки', { exact: true }).click();
  await expect(page.locator('.review-card')).toHaveCount(4);
  await expect(page.getByText('Одобрено', { exact: true })).toBeVisible();
  await expect(page.getByText('Возвращено', { exact: true })).toBeVisible();
});

test('registration validation, demo sign in, profile and missing routes', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Имя и фамилия').fill('Иван Петров');
  await page.getByLabel('Рабочая почта').fill('ivan@example.com');
  await page.getByLabel('Пароль', { exact: true }).fill('password123');
  await page.getByLabel('Повторите пароль').fill('different123');
  await page.getByRole('button', { name: 'Создать демопрофиль' }).click();
  await expect(page.getByText('Пароли не совпадают')).toBeVisible();
  await page.getByLabel('Повторите пароль').fill('password123');
  await page.getByRole('button', { name: 'Создать демопрофиль' }).click();
  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', { name: 'Рады видеть вас', exact: true })).toBeVisible();
  await page.getByLabel('Рабочая почта').fill('ivan@example.com');
  await page.getByLabel('Пароль', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Войти в кабинет' }).click();
  await expect(page.getByRole('heading', { name: 'С возвращением, Иван' })).toBeVisible();
  await page.getByRole('link', { name: 'Мой профиль', exact: true }).click();
  await expect(page.getByLabel('Имя и фамилия')).toHaveValue('Иван Петров');
  await page.goto('/documents/999');
  await expect(page.getByText(/Документ не найден/)).toBeVisible();
  await page.goto('/missing');
  await expect(page.getByText('Страница не найдена')).toBeVisible();
});
