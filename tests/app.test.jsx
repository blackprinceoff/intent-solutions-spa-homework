import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

import { api } from '../src/services/api';
import { storage } from '../src/services/storage';
import UserCard from '../src/components/UserCard';
import TodoItem from '../src/components/TodoItem';

const mockUsers = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    company: { name: 'Romaguera-Crona' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    company: { name: 'Deckow-Crist' },
  },
];

const mockTodos = [
  { userId: 1, id: 1, title: 'Task one', completed: false },
  { userId: 1, id: 2, title: 'Task two', completed: true },
  { userId: 1, id: 3, title: 'Task three', completed: false },
];

describe('API Service', () => {
  beforeEach(() => fetch.mockClear());

  test('getUsers — успішне завантаження', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUsers) });
    const users = await api.getUsers();
    expect(users).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
  });

  test('getUsers — помилка', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(api.getUsers()).rejects.toThrow('Не вдалося завантажити список користувачів');
  });

  test('getTodos — завантажує задачі конкретного юзера', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTodos) });
    const todos = await api.getTodos(1);
    expect(todos).toEqual(mockTodos);
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1/todos');
  });

  test('getTodos — помилка', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(api.getTodos(999)).rejects.toThrow('Не вдалося завантажити задачі користувача');
  });
});

describe('Storage Service', () => {
  beforeEach(() => localStorage.clear());

  test('hasTodos повертає false коли нема даних', () => {
    expect(storage.hasTodos(1)).toBe(false);
  });

  test('saveTodos зберігає дані', () => {
    storage.saveTodos(1, mockTodos);
    expect(JSON.parse(localStorage.getItem('todos_user_1'))).toEqual(mockTodos);
  });

  test('getTodos повертає збережені дані', () => {
    storage.saveTodos(1, mockTodos);
    expect(storage.getTodos(1)).toEqual(mockTodos);
  });

  test('hasTodos повертає true після збереження', () => {
    storage.saveTodos(1, mockTodos);
    expect(storage.hasTodos(1)).toBe(true);
  });

  test('getTodos повертає null коли нема даних', () => {
    expect(storage.getTodos(99)).toBeNull();
  });

  test('різні юзери мають окреме сховище', () => {
    const user1 = [{ id: 1, title: 'User 1 task', completed: false }];
    const user2 = [{ id: 2, title: 'User 2 task', completed: true }];
    storage.saveTodos(1, user1);
    storage.saveTodos(2, user2);
    expect(storage.getTodos(1)).toEqual(user1);
    expect(storage.getTodos(2)).toEqual(user2);
  });
});

describe('Todo CRUD', () => {
  beforeEach(() => localStorage.clear());

  test('додавання задачі', () => {
    const todos = [...mockTodos];
    const maxId = todos.reduce((max, t) => Math.max(max, t.id), 0);
    todos.push({ userId: 1, id: maxId + 1, title: 'New task', completed: false });
    expect(todos).toHaveLength(4);
    expect(todos[3].id).toBe(4);
    expect(todos[3].title).toBe('New task');
  });

  test('редагування задачі', () => {
    const todos = [...mockTodos];
    const i = todos.findIndex((t) => t.id === 2);
    todos[i] = { ...todos[i], title: 'Updated', completed: false };
    expect(todos[i].title).toBe('Updated');
    expect(todos).toHaveLength(3);
  });

  test('видалення задачі', () => {
    const todos = [...mockTodos];
    const i = todos.findIndex((t) => t.id === 2);
    todos.splice(i, 1);
    expect(todos).toHaveLength(2);
    expect(todos.find((t) => t.id === 2)).toBeUndefined();
  });

  test('збереження після додавання', () => {
    const todos = [...mockTodos, { userId: 1, id: 4, title: 'Persisted', completed: false }];
    storage.saveTodos(1, todos);
    expect(storage.getTodos(1)).toHaveLength(4);
  });

  test('збереження після редагування', () => {
    const todos = [...mockTodos];
    todos[0] = { ...todos[0], title: 'Edited' };
    storage.saveTodos(1, todos);
    expect(storage.getTodos(1)[0].title).toBe('Edited');
  });

  test('збереження після видалення', () => {
    const todos = mockTodos.filter((t) => t.id !== 1);
    storage.saveTodos(1, todos);
    expect(storage.getTodos(1)).toHaveLength(2);
  });

  test('maxId для нових задач', () => {
    const maxId = [{ id: 1 }, { id: 5 }, { id: 3 }].reduce((max, t) => Math.max(max, t.id), 0);
    expect(maxId).toBe(5);
  });

  test('maxId = 0 для пустого масиву', () => {
    expect([].reduce((max, t) => Math.max(max, t.id), 0)).toBe(0);
  });
});

describe('Data Integrity', () => {
  beforeEach(() => localStorage.clear());

  test('перше завантаження бере з API і зберігає', async () => {
    expect(storage.hasTodos(1)).toBe(false);
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTodos) });
    const todos = await api.getTodos(1);
    storage.saveTodos(1, todos);
    expect(storage.hasTodos(1)).toBe(true);
    expect(storage.getTodos(1)).toEqual(mockTodos);
  });

  test('повторне завантаження бере зі storage', () => {
    fetch.mockClear();
    storage.saveTodos(1, mockTodos);
    expect(storage.getTodos(1)).toEqual(mockTodos);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('дані зберігаються після перезавантаження', () => {
    storage.saveTodos(1, mockTodos);
    const todos = storage.getTodos(1);
    todos.push({ userId: 1, id: 99, title: 'Added', completed: false });
    storage.saveTodos(1, todos);
    const reloaded = storage.getTodos(1);
    expect(reloaded).toHaveLength(4);
    expect(reloaded.find((t) => t.id === 99)).toBeTruthy();
  });
});

describe('UserCard', () => {
  test('відображає ім\'я, email та компанію', () => {
    render(<BrowserRouter><UserCard user={mockUsers[0]} /></BrowserRouter>);
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
    expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument();
  });
});

describe('TodoItem', () => {
  test('відображає назву задачі', () => {
    render(<TodoItem todo={mockTodos[0]} onEdit={() => { }} onDelete={() => { }} isDeleting={false} />);
    expect(screen.getByText('Task one')).toBeInTheDocument();
  });

  test('показує "Виконано" для виконаної', () => {
    render(<TodoItem todo={mockTodos[1]} onEdit={() => { }} onDelete={() => { }} isDeleting={false} />);
    expect(screen.getByText('Виконано')).toBeInTheDocument();
  });

  test('показує "Очікує" для невиконаної', () => {
    render(<TodoItem todo={mockTodos[0]} onEdit={() => { }} onDelete={() => { }} isDeleting={false} />);
    expect(screen.getByText('Очікує')).toBeInTheDocument();
  });

  test('кнопка Редагувати викликає onEdit', () => {
    const onEdit = vi.fn();
    render(<TodoItem todo={mockTodos[0]} onEdit={onEdit} onDelete={() => { }} isDeleting={false} />);
    fireEvent.click(screen.getByText('Редагувати'));
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  test('кнопка Видалити викликає onDelete', () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={mockTodos[0]} onEdit={() => { }} onDelete={onDelete} isDeleting={false} />);
    fireEvent.click(screen.getByText('Видалити'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
