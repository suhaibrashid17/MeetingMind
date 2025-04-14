import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h2>🚫 403 - Unauthorized</h2>
      <p>You don't have permission to view this page.</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default Unauthorized;
