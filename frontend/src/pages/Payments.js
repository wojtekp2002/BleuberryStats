import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar ';
import axios from 'axios';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get('/harvest/summary');
      setSummary(data);
    } catch (err) {
      console.error('Błąd pobierania podsumowania:', err);
      setError('Brak uprawnień lub problem z siecią.');
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/');
      return;
    }
    fetchSummary();
  }, [navigate, user]);

  const payoutAll = async (employeeId) => {
    try {
      await axios.patch(`/harvest/payout-all/${employeeId}`);
      fetchSummary();
    } catch (err) {
      console.error('Błąd wypłaty:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-3">Wypłaty</h2>
        {error
          ? <div className="alert alert-danger">{error}</div>
          : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Email</th>
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
          )
        }
      </div>
    </>
  );
}
