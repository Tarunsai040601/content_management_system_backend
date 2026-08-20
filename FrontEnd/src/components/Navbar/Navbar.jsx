import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { isCustomerAuth, logoutCustomer } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutCustomer();
    navigate('/');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Real<span>Estate</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/properties" className="nav-links" onClick={closeMenu}>Properties</Link>
          </li>
          {isCustomerAuth && (
            <>
              <li className="nav-item">
                <Link to="/favorites" className="nav-links" onClick={closeMenu}>Favorites</Link>
              </li>
              <li className="nav-item">
                <Link to="/recently-viewed" className="nav-links" onClick={closeMenu}>Recently Viewed</Link>
              </li>
            </>
          )}

          {isCustomerAuth ? (
            <li className="nav-item nav-btn-container">
              <button className="btn btn-outline" onClick={() => { handleLogout(); closeMenu(); }}>Logout</button>
            </li>
          ) : (
            <>
              <li className="nav-item nav-btn-container">
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
              </li>
              <li className="nav-item nav-btn-container">
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
