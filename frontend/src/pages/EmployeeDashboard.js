import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavbarComp';
import axios from 'axios';

export default function EmployeeDashboard() {
  const [harvests, setHarvests] = useState([]);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    const { data } = await axios.get('/harvest', { headers: { Authorization: `Bearer ${token}` } });
    setHarvests(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalKg = harvests.reduce((sum,h)=>sum+h.kg,0);
  const totalDue= harvests.filter(h=>!h.paidOut).reduce((sum,h)=>sum+h.amount,0);

  return (
    <>
      <Navbar />
      <div className="main-background">
        <div className="container py-5">
          <h1 className="mb-4" style={{fontWeight:'bold'}}>Twoje statystyki:</h1>

          {/* Statystyki */}
          <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-4">
              <div className="card card-custom text-center">
                <div className="card-body">
                  <h5 className="card-title">Suma kg</h5>
                  <p className="display-6">{totalKg.toFixed(2)} kg</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card card-custom text-center">
                <div className="card-body">
                  <h5 className="card-title">Do wypłaty</h5>
                  <p className="display-6">{totalDue.toFixed(2)} PLN</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historia wpisów */}
          <div className="card card-custom">
            <div className="card-body">
              <h5 className="card-title mb-4">Historia wpisów</h5>
              <div className="table-responsive">
                <table className="table table-hover table-custom">
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
                        <td>{new Date(h.date).toLocaleString()}</td>
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
        </div>
      </div>
    </>
  );
}
