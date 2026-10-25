# ТЗ · Лабораторная работа №1
## Проект: «Кабинет переводчика внутри компании» (Translation Memory + глоссарий + правки редактора)

Документ является рабочим ТЗ на ЛР1 по требованиям `src_01.md`. Всё, что ниже «вне рамок», в ЛР1 **не делаем** — это залог стабильности.

---

## 1. Назначение приложения (готовый текст для README)

> «Кабинет переводчика» — внутренняя веб-платформа переводческой команды компании. Она хранит единую память переводов (одобренные сегменты «оригинал → перевод»), терминологическую базу и поток редакторских правок. Переводчик загружает документ, разбитый на сегменты, переводит их с подсказками из памяти переводов; редактор проверяет, правит и одобряет переводы. Одобренные сегменты попадают в память переводов и переиспользуются в следующих документах.

---

## 2. Роли и пользовательские сценарии

| Роль | Сценарий (шаги) |
|---|---|
| **Переводчик** | 1) войти → 2) создать документ (вставить текст, выбрать языки) → 3) перевести сегменты в редакторе, используя подсказки из памяти переводов → 4) отправить документ на ревизию |
| **Редактор** | 1) войти → 2) открыть очередь правок → 3) одобрить/отклонить/исправить перевод сегмента с комментарием → 4) одобрить документ |
| **Обе роли** | искать совпадения в памяти переводов; вести глоссарий (добавлять/редактировать термины) |

---

## 3. Карта экранов и маршрутов

| # | Маршрут | Экран | Назначение |
|---|---|---|---|
| 1 | `/login` | Вход | форма email + пароль |
| 2 | `/register` | Регистрация | форма + выбор роли |
| 3 | `/` | Дашборд | статистика + список моих документов |
| 4 | `/documents/new` | Новый документ | форма создания документа |
| 5 | `/documents/:id` | Редактор перевода | двухколоночная работа с сегментами + подсказки ТМ |
| 6 | `/tm` | Память переводов | поиск по одобренным сегментам |
| 7 | `/glossary` | Глоссарий | таблица терминов + добавление/правка |
| 8 | `/reviews` | Правки редактора | очередь сегментов на ревизию |

Два layout: `AuthLayout` (экраны 1–2, центрированная карточка) и `AppLayout` (экраны 3–8, `Layout.Sider` с меню + `Header`).

---

## 4. Спецификация экранов (компоненты Ant Design + поведение на mock)

**4.1 `/login`.** `Card` + `Form` (email, password), кнопка «Войти», ссылка на `/register`. Submit → `message.success('demo')` + `navigate('/')`.

**4.2 `/register`.** `Form`: имя, email, пароль, повтор пароля, `Select` роли (переводчик/редактор). Submit → `navigate('/login')`.

**4.3 `/` Дашборд.** Четыре `Statistic`-карточки (документов, сегментов переведено, одобрено, терминов). `Table` документов: название, языковая пара, статус (`Tag` с цветом), прогресс (`Progress`), обновлён, действие «Открыть». Клик по строке → `/documents/:id`. Кнопка «Новый документ» → `/documents/new`.

**4.4 `/documents/new`.** `Form`: название, `Select` языка оригинала (ru/en/de), `Select` языка перевода, `Input.TextArea` (текст документа, 6+ строк). Submit → `message.success` + `navigate('/documents/1')`.

**4.5 `/documents/:id` Редактор (ключевой экран).** Шапка: название, языковая пара, `Tag` статуса документа, кнопка «Отправить на ревизию». Список сегментов-карточек: слева текст оригинала (+ номер), справа `TextArea` перевода, `Tag` статуса сегмента; при наличии подсказки — `Alert type="info"` «Память переводов: совпадение 87%» с вариантом перевода. Кнопка «Сохранить» → `message.success`.

**4.6 `/tm`.** `Input.Search` + `Select` фильтра по языковой паре. `Table` результатов: оригинал, перевод, домен, документ-источник, дата. Поиск — клиентская фильтрация mock по подстроке. Состояние «ничего не найдено» — `Empty`.

**4.7 `/glossary`.** `Table` терминов: термин, перевод, домен, кто добавил. Кнопка «Добавить термин» → `Modal` с `Form`. В строке — «Изменить» (Modal) и «Удалить» (`Popconfirm`), работают с локальным state.

**4.8 `/reviews`.** Список карточек: документ, сегмент-оригинал, перевод переводчика, `TextArea` версии редактора, `Input` комментария, кнопки «Одобрить» / «Отклонить» (меняют локальный статус карточки).

---

## 5. UI-библиотека и дизайн

**Решение: Ant Design 5** (`antd` + `@ant-design/icons`).
Обоснование: готовые `Table/Form/Layout/Modal/Tag/Progress/Statistic` = меньше рукописного кода и меньше способов сломать вёрстку; требование src «готовая библиотека UI-компонентов» выполнено.

Требования:
- единая тема через `ConfigProvider` (один primary-цвет);
- тексты — через `Typography` (заголовки/абзацы), читаемые отступы;
- интерфейс на русском, код и коммиты — на английском;
- адаптивность: **1440px** (Sider раскрыт, редактор в 2 колонки), **768px** (Sider свернут, 2 колонки), **360px** (Sider → `Drawer` по бургеру, редактор в 1 колонку). Проверить все три в DevTools и зафиксировать в README.

---

## 6. Структура frontend (заклад под FSD из ЛР3)

```
frontend/src/
  app/            # Router, AppLayout, AuthLayout, ConfigProvider
  pages/          # LoginPage, RegisterPage, DashboardPage,
                  # DocumentNewPage, EditorPage, TmPage, GlossaryPage, ReviewsPage
  shared/
    types/        # доменные типы (см. п.7)
    mocks/        # demo-данные
    ui/           # обёртки/мелочи, если появятся
```

`features/` и `entities/` появятся в ЛР3 — сейчас не создаём пустые папки.

---

## 7. Типы и mock-данные

`shared/types/index.ts` (зеркалит будущие SQLAlchemy-модели ЛР2):

```ts
export type Role = 'translator' | 'editor';
export type DocumentStatus = 'draft' | 'in_review' | 'approved';
export type SegmentStatus = 'pending' | 'translated' | 'approved' | 'rejected';

export interface User { id: number; name: string; email: string; role: Role }
export interface TmEntry { id: number; sourceText: string; targetText: string;
  domain: string | null; sourceDocTitle: string; score?: number }
export interface Segment { id: number; position: number; sourceText: string;
  targetText: string | null; status: SegmentStatus; suggestion: TmEntry | null }
export interface Doc { id: number; title: string; sourceLang: string; targetLang: string;
  status: DocumentStatus; progress: number; updatedAt: string; segments: Segment[] }
export interface Term { id: number; sourceTerm: string; targetTerm: string;
  domain: string | null; addedBy: string }
export interface Review { id: number; docTitle: string; sourceText: string;
  translatorVersion: string; editorVersion: string; comment: string | null;
  status: 'open' | 'approved' | 'rejected' }
```

Объём mock: 4 документа, 8–10 сегментов в документе-примере, 10 записей ТМ, 10 терминов, 4 ревизии. Данные — реалистичные (технические/юридические фразы), не `lorem ipsum`.

---

## 8. README (скелет, заполнить на этой неделе)

```md
# Кабинет переводчика (Translation Memory)
## Назначение            ← текст из п.1
## Роли и сценарии        ← таблица из п.2
## Экраны                 ← таблица из п.3 + скриншоты
## Стек                   ← React+TS, Vite, Ant Design, react-router-dom
## Запуск frontend        ← npm install / npm run dev → http://localhost:5173
## Структура проекта      ← дерево из п.6
## Адаптивность           ← как проверял (360/768/1440)
## Журнал изменений       ← секция для будущих правок интерфейса (требование src)
```

---

## 9. Скриншоты (`docs/screenshots/`)

`01-login.png`, `02-register.png`, `03-dashboard.png`, `04-document-new.png`, `05-editor.png`, `06-tm.png`, `07-glossary.png`, `08-reviews.png`, `09-editor-mobile-360.png`.

---

## 10. План коммитов (история = требование src)

1. `chore: init vite react-ts project, gitignore, readme skeleton`
2. `feat: add app routing and auth/app layouts`
3. `feat: add login and register pages (mock)`
4. `feat: add dashboard with stats and documents table (mock)`
5. `feat: add new document form (mock)`
6. `feat: add translation editor screen with tm suggestions (mock)`
7. `feat: add translation memory search page (mock)`
8. `feat: add glossary table with add/edit modal (mock)`
9. `feat: add editor reviews queue (mock)`
10. `style: responsive layout for 360/768/1440`
11. `docs: add screenshots and frontend run instructions`

---

## 11. DoD — чек-лист сдачи (1:1 из src_01.md)

- [ ] README: назначение, сценарии, экраны, инструкция запуска frontend
- [ ] React + TypeScript, начальная структура описана
- [ ] Вёрстка всех 8 экранов + переходы (react-router)
- [ ] Ant Design подключена, единое оформление, читаемость
- [ ] Базовая адаптивность (проверено 360/768/1440)
- [ ] Скриншоты всех экранов в `docs/screenshots`
- [ ] `npm run dev` стартует, навигация работает
- [ ] История: 10+ осмысленных коммитов, не одна загрузка
- [ ] `.gitignore` есть, секретов в репо нет

---

## 12. Вне рамок ЛР1 (НЕ ДЕЛАТЬ)

- ❌ любые вызовы API / fetch / axios — только mock
- ❌ настоящая аутентификация (кнопка «Войти» — mock-переход)
- ❌ полный FSD-рефакторинг, `entities/features` — в ЛР3
- ❌ анимации кастомные — в ЛР3 (хватит встроенных переходов Modal/Drawer)
- ❌ backend, БД, сегментация текста — в ЛР2

---

## 13. Порядок работы (шаги)

1. `npm create vite@latest frontend -- --template react-ts`; `npm i antd @ant-design/icons react-router-dom`
2. README-скелет + `.gitignore` → коммит 1
3. Роутинг + layout'ы → коммит 2
4. Экраны пачками по 1–2 → коммиты 3–9
5. Адаптивность → коммит 10
6. Скриншоты + финализация README → коммит 11
7. Прогнать чек-лист п.11 сверху вниз

По готовности ЛР1 — пиши, перейдём к ТЗ на ЛР2 (модели SQLAlchemy + эндпоинты, схема уже согласована с дорожной картой).