import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Favorites.css";

const BASE_URL = "http://localhost:8095/api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("customerToken");
      if (!token) {
        setError("Please login to view favorites");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/user/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(res.data.favorites || []);
    } catch (err) {
      setError("Failed to load favorites. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId, e) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) return;

      await axios.post(
        `${BASE_URL}/user/toggle-favorite/${propertyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(favorites.filter((f) => f._id !== propertyId));
      if (selectedProperty && selectedProperty._id === propertyId) {
        closeDetails();
      }
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const openDetails = (property) => {
    setSelectedProperty(property);
    setActiveImage(0);
    document.body.style.overflow = "hidden";
  };

  const closeDetails = () => {
    setSelectedProperty(null);
    setActiveImage(0);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="favorites-page">
      <section className="favorites-header">
        <div className="favorites-header-content">
          <h1>Your Saved Properties</h1>
          <p>Review and manage the properties you've loved.</p>
        </div>
      </section>

      <section className="property-listings">
        {loading && <p className="status-text">Loading favorites...</p>}
        {error && <p className="status-text error">{error}</p>}
        {!loading && !error && favorites.length === 0 && (
          <div className="no-favorites-container">
            <span className="no-favorites-icon">💔</span>
            <h2>No favorites yet</h2>
            <p>Go to the properties page and click the heart icon on properties you like.</p>
          </div>
        )}

        <div className="property-grid">
          {favorites.map((p) => (
            <div className="property-card" key={p._id}>
              <div className="property-card-img">
                {p.images && p.images.length > 0 ? (
                  <img src={p.images[0]} alt={p.propertyName} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <span
                  className={`property-badge ${
                    p.status === "sold" ? "badge-sold" : "badge-available"
                  }`}
                >
                  {p.status === "sold" ? "Sold" : "Available"}
                </span>
                <button
                  className="favorite-btn favorited"
                  onClick={(e) => removeFavorite(p._id, e)}
                  title="Remove from favorites"
                >
                  ❤️
                </button>
              </div>

              <div className="property-card-body">
                <h3>{p.propertyName}</h3>
                <p className="property-location">
                  {p.location}, {p.city}
                </p>
                <p className="property-price">{formatPrice(p.price)}</p>

                <div className="property-meta">
                  <span>{p.bedrooms} Bed</span>
                  <span>{p.bathrooms} Bath</span>
                  <span>{p.area} sq.ft</span>
                </div>

                <button
                  className="view-details-btn"
                  onClick={() => openDetails(p)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details Modal */}
      {selectedProperty && (
        <div className="property-modal-overlay" onClick={closeDetails}>
          <div
            className="property-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeDetails}>
              ✕
            </button>

            <div className="modal-image-section">
              {selectedProperty.images && selectedProperty.images.length > 0 ? (
                <>
                  <img
                    src={selectedProperty.images[activeImage]}
                    alt={selectedProperty.propertyName}
                    className="modal-main-image"
                  />
                  {selectedProperty.images.length > 1 && (
                    <div className="modal-thumbnails">
                      {selectedProperty.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${selectedProperty.propertyName} ${idx + 1}`}
                          className={`modal-thumb ${
                            idx === activeImage ? "active" : ""
                          }`}
                          onClick={() => setActiveImage(idx)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image modal-no-image">No Image</div>
              )}
            </div>

            <div className="modal-details-section">
              <span
                className={`property-badge ${
                  selectedProperty.status === "sold"
                    ? "badge-sold"
                    : "badge-available"
                }`}
              >
                {selectedProperty.status === "sold" ? "Sold" : "Available"}
              </span>

              <button
                className="favorite-btn-modal favorited"
                onClick={(e) => removeFavorite(selectedProperty._id, e)}
              >
                ❤️ Remove from Favorites
              </button>

              <h2>{selectedProperty.propertyName}</h2>
              <p className="modal-address">{selectedProperty.fullAddress}</p>
              <p className="modal-price">
                {formatPrice(selectedProperty.price)}
              </p>

              <div className="modal-meta-grid">
                <div className="modal-meta-item">
                  <span className="meta-label">Type</span>
                  <span className="meta-value">
                    {selectedProperty.propertyType}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="meta-label">Bedrooms</span>
                  <span className="meta-value">
                    {selectedProperty.bedrooms}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="meta-label">Bathrooms</span>
                  <span className="meta-value">
                    {selectedProperty.bathrooms}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="meta-label">Area</span>
                  <span className="meta-value">
                    {selectedProperty.area} sq.ft
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="meta-label">City</span>
                  <span className="meta-value">{selectedProperty.city}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="meta-label">Location</span>
                  <span className="meta-value">
                    {selectedProperty.location}
                  </span>
                </div>
              </div>

              <div className="modal-description">
                <h4>Description</h4>
                <p>{selectedProperty.description}</p>
              </div>

              {selectedProperty.amenities &&
                selectedProperty.amenities.length > 0 && (
                  <div className="modal-amenities">
                    <h4>Amenities</h4>
                    <div className="amenities-list">
                      {selectedProperty.amenities.map((a, idx) => (
                        <span key={idx} className="amenity-chip">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
