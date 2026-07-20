# Task Manager API

REST API для керування користувачами, задачами та коментарями на Node.js, Express, TypeScript, PostgreSQL і Prisma.

## Встановлення

```bash
npm install
```

Скопіюйте значення з `.env.example` у `.env` та вкажіть власні налаштування:

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/task_manager?schema=public
JWT_SECRET=your_random_secret
```

Застосуйте міграції та запустіть застосунок:

```bash
npx prisma migrate dev
npm run dev
```

API працюватиме на `http://localhost:3000`, Swagger UI — на `http://localhost:3000/api-docs`.

## Команди

```bash
npm run dev        # запуск із автоматичним перезапуском
npm run typecheck  # перевірка TypeScript
npm run build      # компіляція у dist
npm start          # запуск скомпільованого застосунку
```

## Основні маршрути

- `POST /auth/register`
- `POST /auth/login`
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/comments`
- `GET /tasks/:id/comments`
- `DELETE /comments/:id`
- `POST /users/avatar`
- `GET /users` — лише `ADMIN`
- `DELETE /users/:id` — лише `ADMIN`

Для захищених маршрутів передавайте заголовок `Authorization: Bearer <token>`. Після зміни ролі користувача потрібно повторно виконати login.

## Фільтрація задач

`GET /tasks` підтримує `status`, `priority`, `search`, `page`, `limit`, `sort` і `order`.

Приклад:

```text
GET /tasks?status=TODO&priority=HIGH&page=1&limit=10&sort=createdAt&order=desc
```
