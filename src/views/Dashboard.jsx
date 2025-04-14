import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h2>Welcome, {user?.username}!</h2>
      <p>You are logged in as <strong>{user?.role}</strong>.</p>

      {/* Placeholder for meeting history, analytics, tasks, etc. */}
      <div style={{ marginTop: '2rem' }}>
        <p>📊 Meeting analytics and task overview will be shown here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
