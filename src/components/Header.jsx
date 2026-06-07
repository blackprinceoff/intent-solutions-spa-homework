import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const match = location.pathname.match(/^\/users\/(\d+)\/todos$/);

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">TaskFlow</Link>

        {match && (
          <nav className="breadcrumbs">
            <Link to="/">Користувачі</Link>
            <span> / </span>
            <span className="current">Задачі користувача #{match[1]}</span>
          </nav>
        )}
      </div>
    </header>
  );
}
