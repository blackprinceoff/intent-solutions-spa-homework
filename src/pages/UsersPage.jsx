import React, { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import { api } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading-text">Завантаження користувачів...</p>;
  }

  if (error) {
    return (
      <div className="empty-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => location.reload()}>
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="page-title">Користувачі</h1>
      <p className="page-subtitle">Оберіть користувача для перегляду його задач</p>
      <div className="users-grid" id="users-grid">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </>
  );
}
