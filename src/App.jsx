import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './redux/authSlice';

import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import AdminPanel from './views/AdminPanel';
import Unauthorized from './views/Unauthorized';
import ProtectedRoute from './views/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        <header className="app-header">
          <h1>Welcome to MeetingMind</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
                <ProtectedRoute roles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;