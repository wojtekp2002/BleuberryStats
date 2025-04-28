import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/auth/login', formData);
      const { user, token } = data;

      console.log('RESPONSE user:', user);
      console.log('RESPONSE token:', token);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'EMPLOYER') {
        navigate('/dashboard/employer');
      } else if (user.role === 'EMPLOYEE') {
        navigate('/dashboard/employee');
      } else {
        console.warn('Nieznana rola:', user.role);
        setMessage('Nieznana rola użytkownika');
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Błąd logowania');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(to bottom right, #001f3f, #0074D9)' }}>
      <div className="col-md-4">
        <h2 className="text-center mb-4" style={{cursor:'pointer'}} onClick={() => navigate('/')}>
          <strong>BlueberryStats</strong>
        </h2>
        <div className="card shadow w-100">
          <div className="card-body p-4">
            <h2 className="mb-4">Logowanie</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Hasło</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Zaloguj
              </button>
              <p className="mt-2 text-center">
                Nie masz konta? <Link to="/register">Zarejestruj się</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
