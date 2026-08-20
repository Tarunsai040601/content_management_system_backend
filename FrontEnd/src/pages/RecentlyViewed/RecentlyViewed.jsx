import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { FiClock } from 'react-icons/fi';
// css can reuse favorites css logic
import '../Favorites/Favorites.css';

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchRecent = () => {
      const recent = JSON.parse(localStorage.getItem('customerRecentlyViewed')) || [];
      setRecentlyViewed(recent);
    };

    fetchRecent();
  }, []);

  return (
    <div className="favorites-page">
      <div className="page-header">
        <div className="container">
          <h1><FiClock className="header-icon" style={{color: 'var(--accent-color)'}}/> Recently Viewed</h1>
          <p>Properties you've looked at recently</p>
        </div>
      </div>

      <div className="container">
        {recentlyViewed.length > 0 ? (
          <div className="properties-grid">
            {recentlyViewed.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiClock className="empty-icon" />
            <h2>No History</h2>
            <p>You haven't viewed any properties recently.</p>
            <Link to="/properties" className="btn btn-primary mt-4">
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
