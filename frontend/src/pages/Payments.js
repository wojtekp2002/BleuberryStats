import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function PaymentsPage() {
  const navigate = useNavigate();

  //token
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  const token = localStorage.getItem('token');

  const [harvests, setHarvests] = useState([]); // dla pracownika
  const [summary, setSummary]   = useState([]); // dla pracodawcy
  const [error, setError]       = useState('');

  //Fetch history (pracownik) lub summary (pracodawca)
  const fetchHarvests = async () => {
    try {
      const { data } = await axios.get(
        '/harvest',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHarvests(data);
    } catch (err) {
      console.error(err);
      setError('Nie można pobrać historii.');
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(
        '/harvest/summary',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError('Nie można pobrać podsumowania.');
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    if (user.role === 'EMPLOYER') {
      fetchSummary();
    } else {
      fetchHarvests();
    }
  }, [navigate, user, token]);

  //Wypłacenie pracownikowi
  const payoutAll = async employeeId => {
    try {
      await axios.patch(
        `/harvest/payout-all/${employeeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSummary();
    } catch (err) {
      console.error(err);
      setError('Błąd podczas wypłaty.');
    }
  };

  //Obliczenie sumy dla pracownika
  const totalDue = harvests
    .filter(h => !h.paidOut)
    .reduce((sum, h) => sum + h.amount, 0);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Wypłaty</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {user.role === 'EMPLOYER' ? (
          //Widok pracodawcy
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Pracownik (email)</th>
                  <th>kg</th>
                  <th>Kwota</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                {summary.map(s => (
                  <tr key={s.employeeId}>
                    <td>{s.email}</td>
                    <td>{s.totalKg.toFixed(2)}</td>
                    <td>{s.totalAmount.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => payoutAll(s.employeeId)}
                      >
                        Wypłacono
                      </button>
                    </td>
                  </tr>
                ))}
                {!summary.length && (
                  <tr>
                    <td colSpan="4" className="text-center">Brak wypłat</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          //Widok pracownika
          <>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Do wypłaty</h5>
                <p className="h3">{totalDue.toFixed(2)} PLN</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Historia wypłat</h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>kg</th>
                        <th>Kwota</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {harvests.map(h => (
                        <tr key={h._id}>
                          <td>{new Date(h.date).toLocaleDateString()}</td>
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
                          <td colSpan="4" className="text-center">Brak historii</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
