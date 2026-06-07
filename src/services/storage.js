export const storage = {
  _key(userId) {
    return `todos_user_${userId}`;
  },

  hasTodos(userId) {
    return localStorage.getItem(this._key(userId)) !== null;
  },

  getTodos(userId) {
    const raw = localStorage.getItem(this._key(userId));
    return raw ? JSON.parse(raw) : null;
  },

  saveTodos(userId, todos) {
    localStorage.setItem(this._key(userId), JSON.stringify(todos));
  },
};
