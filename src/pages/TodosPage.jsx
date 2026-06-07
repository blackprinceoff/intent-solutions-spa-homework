import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import { api } from '../services/api';
import { storage } from '../services/storage';

export default function TodosPage() {
  const { userId } = useParams();
  const numericUserId = parseInt(userId, 10);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTodos() {
      try {
        let data;
        if (storage.hasTodos(numericUserId)) {
          data = storage.getTodos(numericUserId);
        } else {
          data = await api.getTodos(numericUserId);
          storage.saveTodos(numericUserId, data);
        }
        if (!cancelled) {
          setTodos(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadTodos();
    return () => { cancelled = true; };
  }, [numericUserId]);

  function handleAdd() {
    setEditingTodo(null);
    setShowForm(true);
  }

  function handleEdit(todoId) {
    const todo = todos.find((t) => t.id === todoId);
    if (todo) {
      setEditingTodo(todo);
      setShowForm(true);
    }
  }

  function handleSave({ title, completed }) {
    let newTodos;

    if (editingTodo) {
      const index = todos.findIndex((t) => t.id === editingTodo.id);
      if (index === -1) {
        alert('Задачу не знайдено');
        return;
      }
      newTodos = [...todos];
      newTodos[index] = { ...newTodos[index], title, completed };
    } else {
      const maxId = todos.reduce((max, t) => Math.max(max, t.id), 0);
      newTodos = [...todos, {
        userId: numericUserId,
        id: maxId + 1,
        title,
        completed,
      }];
    }

    storage.saveTodos(numericUserId, newTodos);
    setTodos(newTodos);
    setShowForm(false);
    setEditingTodo(null);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingTodo(null);
  }

  async function handleDelete(todoId) {
    setDeletingId(todoId);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const index = todos.findIndex((t) => t.id === todoId);
            if (index === -1) {
              reject(new Error('Задачу не знайдено'));
              return;
            }
            const newTodos = todos.filter((t) => t.id !== todoId);
            storage.saveTodos(numericUserId, newTodos);
            setTodos(newTodos);
            resolve();
          } catch (err) {
            reject(err);
          }
        }, 1000);
      });

      alert('Задачу видалено');
    } catch (err) {
      alert(err.message || 'Помилка видалення');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="loading-text">Завантаження задач...</p>;
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
      <div className="todos-header">
        <h1 className="page-title">Задачі</h1>
        <button className="btn btn-primary" id="add-todo-btn" onClick={handleAdd}>
          Додати
        </button>
      </div>

      <div className="todos-list" id="todos-list">
        {todos.length === 0 && (
          <div className="empty-state">
            <p>У цього користувача поки немає задач</p>
          </div>
        )}

        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deletingId === todo.id}
          />
        ))}
      </div>

      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
