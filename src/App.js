import React from 'react';
import './App.css';
import UserTable from './components/UserTable';
import ProductTable from './components/ProductTable';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <h1 className="navbar-title">📊 CRUD Management System</h1>
        <p className="navbar-subtitle">Users & Products Dashboard</p>
      </nav>

      <div className="dashboard-container">
        <div className="tables-grid">
          <div className="table-section">
            <UserTable />
          </div>
          <div className="table-section">
            <ProductTable />
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>✓ Connected to Backend API on http://localhost:3000</p>
      </footer>
    </div>
  );
}

export default App;
