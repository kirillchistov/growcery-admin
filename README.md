# Growcery Admin

Административная панель для системы управления Growcery — клиенты, проекты, счета и аналитика.

## Демо

| Окружение | URL | Примечание |
|-----------|-----|------------|
| GitHub Pages (landing) | https://kirillchistov.github.io/growcery-admin/ | Статическая страница проекта |
| Полная версия (Vercel) | Разверните по инструкции ниже | Авторизация, БД, CRUD |

**Тестовые учётные записи** (после `pnpm db:seed`):

| Email | Пароль |
|-------|--------|
| `user@nextmail.com` | `123456` |
| `kchistov@gmail.com` | `123456` |

## Особенности

- Дашборд с аналитикой и графиком выручки
- Управление клиентами
- Управление проектами
- Выставление и редактирование счетов
- Аутентификация через NextAuth (Credentials)
- PostgreSQL + Drizzle ORM

## Требования

- Node.js 20+
- pnpm 9+
- PostgreSQL (локально или [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

## Установка

```bash
git clone https://github.com/kirillchistov/growcery-admin.git
cd growcery-admin
pnpm install
```

Скопируйте переменные окружения и заполните их:

```bash
cp .env.example .env.local
```

| Переменная | Описание |
|------------|----------|
| `POSTGRES_URL` | Строка подключения к PostgreSQL |
| `AUTH_SECRET` | Секрет NextAuth (`openssl rand -base64 32`) |
| `AUTH_URL` | URL приложения (`http://localhost:3000` локально) |
| `NEXT_PUBLIC_SERVER_URL` | Публичный URL сервера |
| `ITEMS_PER_PAGE` | Количество записей на странице (по умолчанию `5`) |

### База данных

Примените схему и заполните демо-данными:

```bash
pnpm db:push
pnpm db:seed
```

## Запуск

```bash
# Режим разработки
pnpm dev

# Сборка production
pnpm build

# Запуск production-сервера
pnpm start

# Линтер
pnpm lint
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Деплой

### Vercel (рекомендуется для полной версии)

1. Импортируйте репозиторий в [Vercel](https://vercel.com).
2. Добавьте переменные окружения из `.env.example`.
3. Подключите Vercel Postgres или внешнюю БД.
4. После деплоя выполните `pnpm db:seed` через Vercel CLI или локально с production `POSTGRES_URL`.

### GitHub Pages

Workflow `.github/workflows/deploy-github-pages.yml` публикует статическую landing-страницу из каталога `gh-pages/` при push в `main`.

**Важно:** полное Next.js-приложение (авторизация, Server Actions, PostgreSQL) не может работать на GitHub Pages — это статический хостинг. Для интерактивной демо-версии разверните проект на Vercel.

Настройка:

1. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push в `main` — деплой запустится автоматически.

URL: https://kirillchistov.github.io/growcery-admin/

## Стек

- [Next.js 15](https://nextjs.org/) (App Router, PPR)
- [React 19 RC](https://react.dev/)
- [NextAuth v5](https://authjs.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

## Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Dev-сервер |
| `pnpm build` | Production-сборка |
| `pnpm start` | Production-сервер |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Применить схему Drizzle к БД |
| `pnpm db:seed` | Заполнить БД демо-данными |
| `pnpm db:studio` | Drizzle Studio |

## Лицензия

Private — Points Ecom.
