import React from 'react';
import { useSelector } from 'react-redux';

const AdminPanel = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Welcome, <strong>{user?.username}</strong>! You're logged in as an <strong>Admin</strong>.</p>

      {/* Admin functionality can go here: user management, task assignment, etc. */}
      <div style={{ marginTop: '2rem' }}>
        <p> admin controls and organization analytics will be displayed here.</p>
      </div>
    </div>
  );
};

export default AdminPanel;
