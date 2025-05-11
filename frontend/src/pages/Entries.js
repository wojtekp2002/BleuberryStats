import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function EntriesPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const [employees, setEmployees] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [form, setForm] = useState({ employeeId: '', kg: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1) Pobierz listę pracowników
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(data);
      if (data.length) setForm(f => ({ ...f, employeeId: data[0]._id }));
    } catch (err) {
      setError('Nie można pobrać pracowników.');
    }
  };

  // 2) Pobierz historię wszystkich wpisów
  const fetchHarvests = async () => {
    try {
      const { data } = await axios.get('/harvest', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHarvests(data);
    } catch (err) {
      setError('Nie można pobrać wpisów.');
    }
  };

  useEffect(() => {
    if (!token || user.role !== 'EMPLOYER') {
      navigate('/');
      return;
    }
    fetchEmployees();
    fetchHarvests();
  }, [navigate, token, user.role]);

  // 3) Obsługa formularza dodawania
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/harvest',
        { employeeId: form.employeeId, kg: Number(form.kg) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Wpis dodany pomyślnie.');
      setForm(f => ({ ...f, kg: '' }));
      fetchHarvests();
    } catch (err) {
      setError('Błąd dodawania wpisu.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Wpisy</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Dodaj nowy wpis</h5>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Pracownik</label>
                <select
                  className="form-select"
                  value={form.employeeId}
                  onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                >
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Ilość (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.kg}
                  onChange={e => setForm(f => ({ ...f, kg: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>

        <h5 className="mb-3">Historia wpisów</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Data</th>
                <th>Pracownik</th>
                <th>kg</th>
                <th>Kwota</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {harvests.map(h => (
                <tr key={h._id}>
                  <td>{new Date(h.date).toLocaleString()}</td>
                  <td>{h.employee.email || h.employee}</td>
                  <td>{h.kg}</td>
                  <td>{h.amount.toFixed(2)}</td>
                  <td>
                    {h.paidOut
                      ? <span className="badge bg-success">Wypłacone</span>
                      : <span className="badge bg-warning text-dark">Do wypłaty</span>}
                  </td>
                </tr>
              ))}
              {!harvests.length && (
                <tr>
                  <td colSpan="5" className="text-center">Brak wpisów</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
