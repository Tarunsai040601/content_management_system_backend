import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiMaximize } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFav = favorites.some((fav) => fav._id === property._id);
    setIsFavorite(isFav);
  }, [property._id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (isFavorite) {
      const newFavs = favorites.filter((fav) => fav._id !== property._id);
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      setIsFavorite(false);
      toast.success('Removed from favorites');
    } else {
      favorites.push(property);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success('Added to favorites');
    }
  };

  const handlePropertyClick = () => {
    // Save to recently viewed
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const newViewed = [property, ...viewed.filter(p => p._id !== property._id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Fallback if images array is empty or undefined
  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="property-card">
      <Link to={`/property/${property.propertyName}`} onClick={handlePropertyClick}>
        <div className="property-img-container">
          <img src={imageUrl} alt={property.propertyName} className="property-img" loading="lazy" />
          <div className="property-type-badge">{property.propertyType}</div>
          <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
            <FiHeart className={isFavorite ? 'heart-filled' : ''} />
          </button>
        </div>
        
        <div className="property-content">
          <div className="property-price">{formatPrice(property.price)}</div>
          <h3 className="property-title">{property.propertyName}</h3>
          
          <div className="property-location">
            <FiMapPin /> {property.location}, {property.city}
          </div>
          
          <div className="property-features">
            <div className="feature">
              <FaBed /> <span>{property.bedrooms} Beds</span>
            </div>
            <div className="feature">
              <FaBath /> <span>{property.bathrooms} Baths</span>
            </div>
            <div className="feature">
              <FiMaximize /> <span>{property.area} sqft</span>
            </div>
          </div>
          
          <div className="property-footer">
            <span className="btn btn-outline view-details-btn">View Details</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
