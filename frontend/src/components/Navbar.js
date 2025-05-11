import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSeedling, FaUsers, FaList, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom shadow">
      <div className="container">
        <span
          className="navbar-brand"
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          <FaSeedling className="me-1" /> BlueberryStats
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navmenu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav me-auto">
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <FaChartBar className="me-1" /> Statystyki
              </NavLink>
            </li>

            {user?.role === 'EMPLOYER' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/group">
                    <FaUsers className="me-1" /> Moja grupa
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/entries">
                    <FaList className="me-1" /> Wpisy
                  </NavLink>
                </li>
              </>
            )}

            {/* Wypłaty dla obu ról */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/payments">
                <FaMoneyBillWave className="me-1" /> Wypłaty
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="navbar-text text-light me-3">
              {user?.email}
            </span>
            <button
              className="btn btn-outline-light btn-sm btn-custom"
              onClick={logout}
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </nav>
);
}
