import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
      <img src="/images/logo.png" alt="Company Logo" className="company-logo" />
      <h2 style={{ margin: '0 0 0 10px' }}>Quality Control Dashboard</h2>
    </nav>
  );
};

export default Navbar;
