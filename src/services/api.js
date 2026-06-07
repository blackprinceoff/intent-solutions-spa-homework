const API_BASE = 'https://jsonplaceholder.typicode.com';

export const api = {
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Не вдалося завантажити список користувачів');
    return res.json();
  },

  async getTodos(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}/todos`);
    if (!res.ok) throw new Error('Не вдалося завантажити задачі користувача');
    return res.json();
  },
};
