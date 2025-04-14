import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Welcome to MeetingMind</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
