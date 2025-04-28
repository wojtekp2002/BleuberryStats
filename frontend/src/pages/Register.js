import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSeedling, FaEnvelope, FaLock, FaUserTie, FaUser } from 'react-icons/fa';
import '../App.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'EMPLOYEE',
    adminCode: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Wyślij email, password, role i adminCode (jeśli EMPLOYER)
      const { data } = await axios.post('/auth/register', form);
      setMessage(data.message || 'Rejestracja pomyślna!');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd rejestracji');
    }
  };

  return (
    <div className="main-background d-flex align-items-center justify-content-center">
      <div className="card card-custom shadow p-4" style={{ width: 360 }}>
        <div className="text-center mb-4">
          <FaSeedling size={48} className="text-primary" />
          <h2 className="mt-2" style={{ fontWeight: 'bold' }}>BlueberryStats</h2>
        </div>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-dark text-white"><FaEnvelope/></span>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-dark text-white"><FaLock/></span>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Hasło"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-dark text-white">
              {form.role === 'EMPLOYEE' ? <FaUser/> : <FaUserTie/>}
            </span>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="EMPLOYEE">Pracownik</option>
              <option value="EMPLOYER">Pracodawca</option>
            </select>
          </div>

          {/* Kod administratora — tylko dla pracodawcy */}
          {form.role === 'EMPLOYER' && (
            <div className="input-group mb-4">
              <span className="input-group-text bg-dark text-white"><FaLock/></span>
              <input
                type="password"
                name="adminCode"
                className="form-control"
                placeholder="Kod administratora"
                value={form.adminCode}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-custom btn-success w-100 mb-3">
            Zarejestruj
          </button>

          <p className="text-center mb-0">
            Masz już konto? <Link to="/login" className="text-warning">Zaloguj się</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
