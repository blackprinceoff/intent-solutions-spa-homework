import React, { useState, useEffect, useRef } from 'react';

export default function TodoForm({ todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo ? todo.title : '');
  const [completed, setCompleted] = useState(todo ? todo.completed : false);
  const [titleError, setTitleError] = useState(false);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }

    setSaving(true);

    setTimeout(() => {
      try {
        onSave({ title: trimmed, completed });
        alert('Дані збережено');
      } catch (err) {
        alert(err.message || 'Помилка збереження');
      } finally {
        setSaving(false);
      }
    }, 1000);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {todo ? 'Редагувати задачу' : 'Додати задачу'}
          </h2>
          <button className="modal-close-btn" onClick={onCancel}>&times;</button>
        </div>

        <form className="todo-form" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="todo-title" className="form-label">Назва задачі</label>
            <input
              type="text"
              id="todo-title"
              className={`form-input${titleError ? ' invalid' : ''}`}
              placeholder="Введіть назву задачі..."
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
              ref={titleRef}
            />
            {titleError && (
              <span className="form-error visible">Назва задачі обов'язкова</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Статус виконання</label>
            <div className="toggle-group">
              <label className="toggle-label" htmlFor="todo-completed">
                <input
                  type="checkbox"
                  id="todo-completed"
                  className="toggle-input"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                <span className="toggle-text">
                  {completed ? 'Виконано' : 'Не виконано'}
                </span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
              Відміна
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner"></span> : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
