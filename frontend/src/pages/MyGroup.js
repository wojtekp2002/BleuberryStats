import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';       
import Navbar from '../components/Navbar ';            
import axios from 'axios';

export default function MyGroupPage() {
  const navigate = useNavigate();                    
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ email:'', password:'', ratePerKg:1.0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/');
      return;
    }
    fetchEmployees();
  }, [navigate, user]);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get('/users');
      setEmployees(data);
    } catch (err) {
      console.error('Błąd pobierania:', err);
    }
  };

  const add = async e => {
    e.preventDefault();
    await axios.post('/users', form);
    setModalOpen(false);
    setForm({ email:'', password:'', ratePerKg:1.0 });
    fetchEmployees();
  };

  const remove = async id => {
    if (!window.confirm('Usuń pracownika?')) return;
    await axios.delete(`/users/${id}`);
    fetchEmployees();
  };

  const filtered = employees.filter(emp =>
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-3">Moja grupa</h2>
        <div className="d-flex mb-3">
          <input
            className="form-control me-2"
            placeholder="Szukaj po email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            + Dodaj
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Email</th><th>Stawka</th><th>Akcje</th></tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp._id}>
                  <td>{emp.email}</td>
                  <td>{emp.ratePerKg.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(emp._id)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan="3" className="text-center">Brak pracowników</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={add}>
              <div className="modal-header">
                <h5 className="modal-title">Dodaj pracownika</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label>Hasło</label>
                  <input
                    className="form-control"
                    type="password"
                    required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label>Stawka (PLN/kg)</label>
                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    required
                    value={form.ratePerKg}
                    onChange={e =>
                      setForm(f => ({ ...f, ratePerKg: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Anuluj
                </button>
                <button type="submit" className="btn btn-primary">Dodaj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
