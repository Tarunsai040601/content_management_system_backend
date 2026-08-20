import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { FiHeart } from 'react-icons/fi';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = () => {
      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(favs);
    };

    fetchFavorites();
    // Listen for storage changes if in another tab
    window.addEventListener('storage', fetchFavorites);
    return () => window.removeEventListener('storage', fetchFavorites);
  }, []);

  return (
    <div className="favorites-page">
      <div className="page-header">
        <div className="container">
          <h1><FiHeart className="header-icon" /> Your Favorites</h1>
          <p>Properties you've saved for later</p>
        </div>
      </div>

      <div className="container">
        {favorites.length > 0 ? (
          <div className="properties-grid">
            {favorites.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiHeart className="empty-icon" />
            <h2>No Favorites Yet</h2>
            <p>You haven't saved any properties to your favorites yet.</p>
            <Link to="/properties" className="btn btn-primary mt-4">
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
