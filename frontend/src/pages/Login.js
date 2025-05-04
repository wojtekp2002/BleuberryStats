import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSeedling, FaEnvelope, FaLock } from 'react-icons/fa';
import '../App.css'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      //dashboard od roli
      if (data.user.role === 'EMPLOYER') {
        navigate('/dashboard/employer', { replace: true });
      } else {
        navigate('/dashboard/employee', { replace: true });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd logowania');
    }
  };

  return (
    <div className="main-background d-flex align-items-center justify-content-center">
      <div className="card card-custom shadow p-4" style={{ width: 360 }}>
        <div className="text-center mb-4">
          <FaSeedling size={48} className="text-primary" />
          <h2 className="mt-2" style={{ fontWeight: 'bold' }}>BlueberryStats</h2>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        <form onSubmit={handleSubmit}>
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

          <div className="input-group mb-4">
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

          <button type="submit" className="btn btn-custom btn-primary w-100 mb-3">
            Zaloguj
          </button>

          <p className="text-center mb-0">
            Nie masz konta? <Link to="/register" className="text-warning">Zarejestruj się</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
