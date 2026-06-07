import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import UsersPage from './pages/UsersPage';
import TodosPage from './pages/TodosPage';
import './App.css';

export default function App() {
  return (
    <div id="app">
      <Header />
      <main id="main-content" className="main-content">
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/users/:userId/todos" element={<TodosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
