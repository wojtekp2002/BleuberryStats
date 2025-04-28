import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar ';
import axios from 'axios';

export default function EmployerDashboard() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [harvests, setHarvests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newHarvest, setNewHarvest] = useState({ employeeId:'', kg:'' });

  useEffect(() => {
    axios.get('/harvest', { headers:{Authorization:`Bearer ${token}`} })
      .then(res => setHarvests(res.data));
    axios.get(`/users?employer=${user.id}`, { headers:{Authorization:`Bearer ${token}`} })
      .then(res => setEmployees(res.data));
  }, [token, user.id]);

  const totalKg = harvests.reduce((sum,h)=> sum+h.kg,0);
  const totalDue = harvests.reduce((sum,h)=> sum+(h.paidOut?0:h.amount),0);
  const employeeCount = employees.length;

  const handleAdd = e => {
    e.preventDefault();
    axios.post('/harvest', newHarvest,{headers:{Authorization:`Bearer ${token}`}})
      .then(res => {
        setHarvests([res.data.harvest,...harvests]);
        setNewHarvest({employeeId:'',kg:''});
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Dodaj wpis</h5>
                <form onSubmit={handleAdd}>
                  <div className="mb-2">
                    <label className="form-label">Pracownik</label>
                    <select className="form-select" value={newHarvest.employeeId}
                            onChange={e=>setNewHarvest({...newHarvest,employeeId:e.target.value})} required>
                      <option value="">-- wybierz --</option>
                      {employees.map(emp=>(
                        <option key={emp._id} value={emp._id}>{emp.username||emp.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">kg</label>
                    <input type="number" className="form-control" value={newHarvest.kg}
                           onChange={e=>setNewHarvest({...newHarvest,kg:e.target.value})} required/>
                  </div>
                  <button className="btn btn-primary w-100">Dodaj</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card text-white bg-primary">
                  <div className="card-body">
                    <h6>Zebrane kg (wszyscy)</h6>
                    <p className="h3">{totalKg.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-success">
                  <div className="card-body">
                    <h6>Kwota do wypłaty</h6>
                    <p className="h3">{totalDue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-secondary">
                  <div className="card-body">
                    <h6>Liczba pracowników</h6>
                    <p className="h3">{employeeCount}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5>Wpisy wszystkich</h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Pracownik</th><th>Data</th><th>kg</th><th>Kwota</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {harvests.map(h=>(
                        <tr key={h._id}>
                          <td>{h.employee.username||h.employee.email}</td>
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
        </div>
      </div>
    </>
  );
}
