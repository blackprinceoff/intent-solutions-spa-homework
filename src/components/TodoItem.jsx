import React from 'react';

export default function TodoItem({ todo, onEdit, onDelete, isDeleting }) {
  return (
    <div className={`todo-item${isDeleting ? ' deleting' : ''}`} id={`todo-item-${todo.id}`}>
      <div className="todo-status">
        <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
          {todo.completed ? 'Виконано' : 'Очікує'}
        </span>
      </div>
      <div className={`todo-title${todo.completed ? ' done' : ''}`}>{todo.title}</div>
      <div className="todo-actions">
        <button
          className="btn btn-small btn-secondary"
          onClick={() => onEdit(todo.id)}
          disabled={isDeleting}
        >
          Редагувати
        </button>
        <button
          className="btn btn-small btn-danger"
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
        >
          Видалити
        </button>
      </div>
    </div>
  );
}
