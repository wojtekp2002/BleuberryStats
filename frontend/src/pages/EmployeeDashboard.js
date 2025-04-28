import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar ';
import axios from 'axios';

export default function EmployeeDashboard() {
  const token = localStorage.getItem('token');
  const [harvests, setHarvests] = useState([]);

  useEffect(() => {
    axios.get('/harvest', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setHarvests(res.data));
  }, [token]);

  const totalKg = harvests.reduce((sum, h) => sum + h.kg, 0);
  const totalDue = harvests.reduce((sum, h) => sum + (h.paidOut ? 0 : h.amount), 0);
  const count = harvests.length;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary h-100">
              <div className="card-body">
                <h5 className="card-title">Zebrane kg</h5>
                <p className="display-6">{totalKg.toFixed(2)} kg</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success h-100">
              <div className="card-body">
                <h5 className="card-title">Kwota do wypłaty</h5>
                <p className="display-6">{totalDue.toFixed(2)} PLN</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-secondary h-100">
              <div className="card-body">
                <h5 className="card-title">Liczba wpisów</h5>
                <p className="display-6">{count}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Historia zbiorów</h5>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
