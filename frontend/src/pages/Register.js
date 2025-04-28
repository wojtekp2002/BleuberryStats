import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  // Inicjalizacja stanu formularza – zawiera wszystkie pola rejestracji
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'EMPLOYEE',
    ratePerKg: 1.0,
    employer: ''
  });
  // Stan dla komunikatu
  const [message, setMessage] = useState('');

  // Obsługa zmiany wartości w polach formularza
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Obsługa submit formularza – wysłanie danych na backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Wysłanie zapytanie POST do endpointu rejestracji
      const res = await axios.post('/auth/register', formData);
      setMessage(res.data.message || 'Rejestracja pomyślna!');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Błąd rejestracji');
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{ background: 'linear-gradient(to bottom right, #001f3f, #0074D9)' }}
    >
      <div className="col-md-4">
        <h2
          className="text-center mb-4"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <strong>ALKO APP</strong>
        </h2>

        {/* Karta rejestracji */}
        <div className="card p-4 shadow">
          <h2 className="mb-4 text-center">Rejestracja</h2>
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

            <div className="mb-3">
              <label className="form-label">Rola</label>
              <select 
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="EMPLOYEE">Pracownik</option>
                <option value="EMPLOYER">Pracodawca</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Stawka (PLN za kg)</label>
              <input 
                type="number"
                name="ratePerKg"
                className="form-control"
                value={formData.ratePerKg}
                onChange={(e) =>
                  handleChange({
                    target: { name: 'ratePerKg', value: Number(e.target.value) }
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">ID pracodawcy (opcjonalnie)</label>
              <input 
                type="text"
                name="employer"
                className="form-control"
                value={formData.employer}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-success w-100 mt-2" type="submit">
              Zarejestruj
            </button>
          </form>

          <p className="mt-2 text-center">
            Masz już konto? <Link to="/login">Zaloguj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
