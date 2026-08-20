import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section brand">
          <Link to="/" className="footer-logo">
            <FiHome className="logo-icon" /> Real<span>Estate</span>
          </Link>
          <p className="footer-desc">
            Your premium destination for finding the perfect home, apartment, or commercial space. We make real estate simple and beautiful.
          </p>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <ul>
            <li><FiMapPin /> 123 Real Estate Ave, Suite 100</li>
            <li><FiPhone /> +1 (555) 123-4567</li>
            <li><FiMail /> info@realestate.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
