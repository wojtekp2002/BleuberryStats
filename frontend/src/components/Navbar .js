import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <span className="navbar-brand" style={{cursor:'pointer'}} onClick={() => navigate('/')}>
          BlueberryStats
        </span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav me-auto">
            {user?.role === 'EMPLOYER' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/group">Moja grupa</NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/payments">Wypłaty</NavLink>
            </li>
          </ul>
          <div className="d-flex">
            <span className="navbar-text text-light me-3">{user?.email}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>Wyloguj</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
