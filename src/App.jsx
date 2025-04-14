import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import AdminPanel from './views/AdminPanel';
import Unauthorized from './views/Unauthorized';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Welcome to MeetingMind</h1>
        </header>
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Fallback */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
