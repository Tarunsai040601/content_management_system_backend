import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <p>&copy; {new Date().getFullYear()} ESTORA. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
