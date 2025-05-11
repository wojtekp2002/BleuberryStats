import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaEye
} from 'react-icons/fa';
import '../App.css';

export default function MyGroupPage() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  const token = localStorage.getItem('token');

  const [group, setGroup] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [modalProfile, setModalProfile] = useState(false);

  // Pobierz grupę
  const fetchGroup = async () => {
    try {
      const { data } = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroup(data);
    } catch {
      alert('Błąd pobierania pracowników');
    }
  };

  // Podpowiedzi do wyszukiwania
  const fetchSuggestions = async q => {
    setSearch(q);
    if (!q) return setSuggestions([]);
    try {
      const { data } = await axios.get(`/users/search?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  // Dodanie do grupy
  const handleAdd = async email => {
    if (!email) return;
    try {
      await axios.post('/users', { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearch('');
      setSuggestions([]);
      fetchGroup();
    } catch {
      alert('Błąd dodawania pracownika');
    }
  };

  // Aktualizacja stawki po onBlur
  const handleRate = async (employeeId, ratePerKg) => {
    if (isNaN(ratePerKg) || ratePerKg <= 0) {
      alert('Stawka musi być liczbą większą od 0');
      return;
    }
    try {
      await axios.patch(
        `/users/${employeeId}`,
        { ratePerKg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGroup();
    } catch {
      alert('Błąd aktualizacji stawki');
    }
  };

  // Usunięcie z grupy
  const handleRemove = async id => {
    if (!window.confirm('Usunąć pracownika z grupy?')) return;
    try {
      await axios.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroup();
    } catch {
      alert('Błąd usuwania');
    }
  };

  // Wyświetlenie historii pracownika
  const handleView = async id => {
    try {
      const { data } = await axios.get('/harvest', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(data.filter(h =>
        String((h.employee._id || h.employee)) === id
      ));
      setModalProfile(true);
    } catch {
      alert('Błąd pobierania historii');
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/');
      return;
    }
    fetchGroup();
  }, [navigate, user]);

  return (
    <>
      <Navbar />
      <div className="main-background">
        <div className="container py-5 text-white">
          <h2 className="mb-4">Moja grupa</h2>

          {/* Wyszukiwanie + Dodaj */}
          <div className="input-group mb-4">
            <span className="input-group-text bg-dark text-white">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Szukaj pracownika..."
              value={search}
              onChange={e => fetchSuggestions(e.target.value)}
            />
            <button
              className="btn btn-custom btn-primary"
              onClick={() => handleAdd(search)}
            >
              <FaPlus className="me-1" /> Dodaj
            </button>
          </div>

          {/* Autocomplete */}
          {suggestions.length > 0 && (
            <ul className="list-group mb-4">
              {suggestions.map(s => (
                <li
                  key={s._id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearch(s.email);
                    setSuggestions([]);
                  }}
                >
                  {s.email}
                </li>
              ))}
            </ul>
          )}

          {/* Tabela */}
          <div className="card card-custom mb-5 bg-transparent border-light">
            <div className="card-body">
              <h5 className="card-title">Lista pracowników</h5>
              <div className="table-responsive">
                <table className="table table-hover table-custom text-white">
                  <thead className="table-light text-dark">
                    <tr>
                      <th>Email</th>
                      <th>Stawka (PLN/kg)</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.email}</td>
                        <td style={{ width: 140 }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            defaultValue={emp.ratePerKg}
                            onBlur={e =>
                              handleRate(emp._id, parseFloat(e.target.value))
                            }
                          />
                        </td>
                        <td style={{ width: 120 }}>
                          <button
                            className="btn btn-sm btn-info me-2 btn-custom"
                            onClick={() => handleView(emp._id)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-danger btn-custom"
                            onClick={() => handleRemove(emp._id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {group.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center">
                          Brak pracowników w grupie
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal profilu */}
          {modalProfile && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-lg">
                <div className="modal-content bg-dark text-white">
                  <div className="modal-header">
                    <h5 className="modal-title">Historia zbiorów</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setModalProfile(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="table-responsive">
                      <table className="table table-hover table-custom text-white">
                        <thead className="table-light text-dark">
                          <tr>
                            <th>Data</th>
                            <th>kg</th>
                            <th>Kwota</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map(h => (
                            <tr key={h._id}>
                              <td>{new Date(h.date).toLocaleString()}</td>
                              <td>{h.kg}</td>
                              <td>{h.amount.toFixed(2)}</td>
                              <td>{h.paidOut ? 'Wypłacone' : 'Do wypłaty'}</td>
                            </tr>
                          ))}
                          {logs.length === 0 && (
                            <tr>
                              <td colSpan="4" className="text-center">
                                Brak wpisów
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-light btn-custom"
                      onClick={() => setModalProfile(false)}
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
