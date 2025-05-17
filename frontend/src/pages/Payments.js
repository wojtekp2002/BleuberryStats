import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaList, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const [summary, setSummary] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get('/harvest/summary', { headers: { Authorization: `Bearer ${token}` } });
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError('Błąd pobierania podsumowania');
    }
  };

  const fetchHarvests = async () => {
    try {
      const { data } = await axios.get('/harvest', { headers: { Authorization: `Bearer ${token}` } });
      setHarvests(data);
    } catch (err) {
      console.error(err);
      setError('Błąd pobierania historii');
    }
  };

  useEffect(() => {
    if (!user || !token) return navigate('/login');
    fetchHarvests();
    if (user.role === 'EMPLOYER') fetchSummary();
  }, [user?.role, token, navigate]);

  const openHistory = emp => { setSelected(emp); setModalOpen(true); };
  const closeHistory = () => { setModalOpen(false); setSelected(null); };

  const payoutAll = async empId => {
    try {
      await axios.patch(`/harvest/payout-all/${empId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchHarvests(); fetchSummary();
    } catch {
      setError('Błąd wypłaty');
    }
  };

  const history = selected
    ? harvests.filter(h => String(h.employee._id || h.employee) === selected.employeeId)
    : [];

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Wypłaty</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {user.role === 'EMPLOYER' ? (
          <div className="row">
            {summary.map(emp => {
              const canPay = emp.totalAmount > 0;
              return (
                <div key={emp.employeeId} className="col-md-4 mb-3">
                  <div className="card mb-4 shadow-sm border-primary">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                      <span>{emp.email}</span>
                      <span className="badge bg-light text-primary">{emp.totalAmount.toFixed(2)} PLN</span>
                    </div>
                    <div className="card-body">
                      <p><strong>Kg:</strong> {emp.totalKg.toFixed(2)}</p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary" onClick={() => openHistory(emp)}>
                          <FaList className="me-1"/> Historia
                        </button>
                        <button
                          className={`btn btn-light text-primary${!canPay?' disabled':''}`}
                          onClick={() => payoutAll(emp.employeeId)}
                        >
                          {canPay ? <><FaMoneyBillWave className="me-1"/> Wypłać</> : 'Wypłacono'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="table table-hover">
            <thead><tr><th>Data</th><th>kg</th><th>Kwota</th><th>Status</th><th>Data wypłaty</th></tr></thead>
            <tbody>
              {harvests.map(h => (
                <tr key={h._id}>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{h.kg}</td>
                  <td>{h.amount.toFixed(2)}</td>
                  <td><span className={`badge ${h.paidOut?'bg-success':'bg-warning text-dark'}`}>{h.paidOut?'Wypłacone':'Do wypłaty'}</span></td>
                  <td>{h.payoutDate ? new Date(h.payoutDate).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1" onClick={closeHistory}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Historia zbiorów: {selected.email}</h5>
                <button className="btn-close" onClick={closeHistory}></button>
              </div>
              <div className="modal-body"><table className="table"><thead><tr><th>Data</th><th>kg</th><th>Kwota</th><th>Status</th><th>Data wypłaty</th></tr></thead><tbody>{history.map(h=>(<tr key={h._id}><td>{new Date(h.date).toLocaleString()}</td><td>{h.kg}</td><td>{h.amount.toFixed(2)}</td><td><span className={`badge ${h.paidOut?'bg-success':'bg-warning text-dark'}`}>{h.paidOut?'Wypłacone':'Do wypłaty'}</span></td><td>{h.payoutDate?new Date(h.payoutDate).toLocaleString():'-'}</td></tr>))}</tbody></table></div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={closeHistory}>Zamknij</button></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
