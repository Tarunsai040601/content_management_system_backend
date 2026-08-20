import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { customerToken } = useAuth();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // We get user info from localStorage if we saved it on login
    const savedUser = JSON.parse(localStorage.getItem('customerUser'));
    if (savedUser) setUser(savedUser);

    const favs = JSON.parse(localStorage.getItem('customerFavorites')) || [];
    setFavorites(favs.slice(0, 3));

    const recent = JSON.parse(localStorage.getItem('customerRecentlyViewed')) || [];
    setRecentlyViewed(recent.slice(0, 3));
  }, []);

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user ? user.name : 'Customer'}!</h1>
          <p>Find your perfect property.</p>
          <div className="search-quick-link">
            <Link to="/properties" className="btn btn-primary">Search Properties...</Link>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        <div className="dashboard-sidebar">
          <div className="profile-card">
            <h3>My Profile</h3>
            <div className="profile-info">
              <p><strong>Name:</strong> {user ? user.name : 'N/A'}</p>
              <p><strong>Email:</strong> {user ? user.email : 'N/A'}</p>
              <p><strong>Role:</strong> {user ? user.role : 'Customer'}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <section className="dashboard-section">
            <div className="section-header-flex">
              <h2>Your Favorites</h2>
              <Link to="/favorites" className="view-all-link">View All</Link>
            </div>
            {favorites.length > 0 ? (
              <div className="dashboard-grid">
                {favorites.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>
            ) : (
              <p className="empty-text">No favorites yet.</p>
            )}
          </section>

          <section className="dashboard-section">
            <div className="section-header-flex">
              <h2>Recently Viewed</h2>
              <Link to="/recently-viewed" className="view-all-link">View All</Link>
            </div>
            {recentlyViewed.length > 0 ? (
              <div className="dashboard-grid">
                {recentlyViewed.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>
            ) : (
              <p className="empty-text">No recently viewed properties.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
