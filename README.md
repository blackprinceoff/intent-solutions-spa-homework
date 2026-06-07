# User Tasks Manager (SPA)

Односторінковий веб-додаток для роботи зі списком користувачів та їх задачами.

## Функціонал

- Сторінка користувачів — завантаження та відображення списку з API
- Сторінка задач — перегляд, додавання, редагування та видалення задач
- Дані зберігаються у localStorage після першого завантаження
- Маршрутизація: `/` та `/users/{id}/todos`
- Валідація форми з обов'язковими полями

## Технології

- React 19
- React Router v7
- Vite
- Vitest + Testing Library (тестування)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com)

## Запуск

```bash
npm install
npm run dev
```

Додаток буде доступний на http://localhost:5173

## Тести

```bash
npm test
```

## Структура

```
src/
  components/   — Header, UserCard, TodoItem, TodoForm
  pages/        — UsersPage, TodosPage
  services/     — api.js (fetch), storage.js (localStorage)
  App.jsx       — роутинг
  main.jsx      — точка входу
```
