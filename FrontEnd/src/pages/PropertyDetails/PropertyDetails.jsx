import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyByName } from '../../services/propertyService';
import { FiMapPin, FiHeart, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import { BiArea } from 'react-icons/bi';
import toast from 'react-hot-toast';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { propertyName } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyName]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await getPropertyByName(propertyName);
      if (response.data && response.data.success) {
        const data = response.data.data;
        setProperty(data);
        
        // Check if favorite
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.some((fav) => fav._id === data._id));

        // Add to recently viewed
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const newViewed = [data, ...viewed.filter(p => p._id !== data._id)].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
      }
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('You need administrator privileges to view full property details (backend restriction).');
      } else {
        setError('Failed to load property details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!property) return;
    
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="loader">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error-container">
        <h2>Oops!</h2>
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/properties')}>Back to Properties</button>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="property-details-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="details-header">
          <div className="title-section">
            <div className="type-badge">{property.propertyType}</div>
            <h1>{property.propertyName}</h1>
            <p className="location"><FiMapPin /> {property.fullAddress}</p>
          </div>
          <div className="price-section">
            <h2>{formatPrice(property.price)}</h2>
            <div className="action-buttons">
              <button className={`btn-icon ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
                <FiHeart className={isFavorite ? 'filled' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={property.images && property.images.length > 0 ? property.images[activeImage] : 'https://via.placeholder.com/800x500?text=No+Image'} 
              alt={property.propertyName} 
            />
          </div>
          {property.images && property.images.length > 1 && (
            <div className="thumbnail-list">
              {property.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="details-content">
          <div className="main-content-col">
            <section className="detail-section">
              <h3>Overview</h3>
              <div className="quick-stats">
                <div className="stat">
                  <FaBed className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">{property.bedrooms}</span>
                    <span className="stat-label">Bedrooms</span>
                  </div>
                </div>
                <div className="stat">
                  <FaBath className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">{property.bathrooms}</span>
                    <span className="stat-label">Bathrooms</span>
                  </div>
                </div>
                <div className="stat">
                  <BiArea className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">{property.area}</span>
                    <span className="stat-label">Square Feet</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h3>Description</h3>
              <p className="description-text">{property.description}</p>
            </section>

            {property.amenities && property.amenities.length > 0 && (
              <section className="detail-section">
                <h3>Amenities</h3>
                <ul className="amenities-list">
                  {property.amenities.map((amenity, idx) => (
                    <li key={idx}><FiCheck className="check-icon" /> {amenity}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="sidebar-col">
            <div className="contact-card">
              <h3>Interested in this property?</h3>
              <p>Contact our real estate agent to schedule a viewing or get more details.</p>
              <button className="btn btn-primary btn-block contact-btn" onClick={() => toast.success('Agent will contact you soon!')}>
                Contact Agent
              </button>
              <div className="agent-info">
                <p>Or call directly:</p>
                <strong>+1 (555) 987-6543</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
