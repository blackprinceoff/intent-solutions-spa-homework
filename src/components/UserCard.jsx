import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserCard({ user }) {
  const navigate = useNavigate();

  return (
    <div
      className="user-card"
      id={`user-card-${user.id}`}
      onClick={() => navigate(`/users/${user.id}/todos`)}
    >
      <div className="user-name">{user.name}</div>
      <div className="user-details">
        <div className="user-detail">
          <span className="user-detail-label">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="user-detail">
          <span className="user-detail-label">Компанія:</span>
          <span>{user.company.name}</span>
        </div>
      </div>
    </div>
  );
}
