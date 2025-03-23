import { useState } from 'react'
import './App.css'
import Login from './views/Login.jsx';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome to MeetingMind</h1>
      </header>
      <main className="app-main">
        <Login />
      </main>
    </div>
  )
}

export default App