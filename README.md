# Task Manager API

REST API для керування користувачами, задачами та коментарями.

Стек: Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT, bcrypt, Zod, Multer, Sharp і Swagger.

## Запуск

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

API за замовчуванням: `http://localhost:3000`.

Swagger UI: `http://localhost:3000/api-docs`.

## Environment variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/task_manager?schema=public
JWT_SECRET=replace_with_at_least_32_random_characters
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
SWAGGER_ENABLED=true
TRUST_PROXY_HOPS=0
```

Згенерувати `JWT_SECRET`:

```bash
openssl rand -base64 32
```

Для production вкажіть дозволені frontend origins і вимкніть Swagger:

```env
NODE_ENV=production
CORS_ORIGINS=https://app.example.com,https://admin.example.com
SWAGGER_ENABLED=false
```

Якщо API працює за одним довіреним reverse proxy, встановіть `TRUST_PROXY_HOPS=1`.

## Команди

```bash
npm run dev        # development-сервер
npm run typecheck  # перевірка TypeScript
npm run build      # збірка у dist
npm start          # запуск зібраного сервера
```

## Авторизація

### `POST /auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Користувач створюється з роллю `USER`. Email унікальний, пароль хешується bcrypt.

### `POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

У відповідь повертаються JWT на 7 днів і дані користувача. Для захищених маршрутів передавайте:

```http
Authorization: Bearer <token>
```

`authMiddleware` перевіряє користувача та його актуальну роль у базі на кожному запиті, тому зміна ролі застосовується без повторного login.

## Задачі

Усі маршрути захищені та працюють лише із задачами поточного користувача.

- `POST /tasks` — створити задачу;
- `GET /tasks` — отримати задачі;
- `GET /tasks/:id` — отримати одну задачу;
- `PATCH /tasks/:id` — оновити задачу;
- `DELETE /tasks/:id` — видалити задачу.

Приклад:

```json
{
  "title": "Learn Node.js",
  "description": "Build a REST API",
  "status": "TODO",
  "priority": "HIGH"
}
```

Статуси: `TODO`, `IN_PROGRESS`, `DONE`.

Пріоритети: `LOW`, `MEDIUM`, `HIGH`.

### Фільтрація та пагінація

`GET /tasks` підтримує:

- `status`;
- `priority`;
- `search` — пошук у `title` і `description`;
- `page` — за замовчуванням `1`;
- `limit` — за замовчуванням `10`, максимум `100`;
- `sort` — `createdAt`, `priority`, `title`;
- `order` — `asc`, `desc`.

```text
GET /tasks?status=TODO&priority=HIGH&page=1&limit=10&sort=createdAt&order=desc
```

Формат відповіді:

```json
{
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 0
}
```

## Коментарі

Усі маршрути захищені.

- `POST /tasks/:id/comments` — додати коментар до власної задачі;
- `GET /tasks/:id/comments` — отримати коментарі власної задачі;
- `DELETE /comments/:id` — видалити власний коментар.

```json
{
  "text": "Remember to add tests"
}
```

## Користувачі

- `POST /users/avatar` — завантажити аватар поточного користувача;
- `GET /users` — отримати користувачів, лише `ADMIN`;
- `DELETE /users/:id` — видалити користувача, лише `ADMIN`.

Аватар передається як `multipart/form-data` у полі `avatar`.

Дозволені JPEG, PNG і WebP до 5 MB. Sharp перевіряє формат, змінює розмір до `512×512` і зберігає новий WebP. SVG та пошкоджені файли відхиляються.

Щоб створити адміністратора локально:

```bash
npx prisma studio
```

Змініть поле `role` потрібного користувача з `USER` на `ADMIN`.

## Безпека

- Helmet security headers;
- CORS whitelist через `CORS_ORIGINS`;
- JWT secret мінімум 32 символи;
- bcrypt для паролів;
- rate limit: 10 невдалих login-спроб за 15 хвилин;
- rate limit: 5 register-спроб за годину;
- dummy bcrypt hash для захисту від timing-based user enumeration;
- безпечна обробка аватарів через Sharp;
- централізована обробка Zod, Multer і Prisma-помилок.

## Структура

```text
src/
├── config/
├── controllers/
├── database/
├── middlewares/
├── routes/
├── services/
├── types/
├── utils/
├── validators/
├── app.ts
└── server.ts
```
