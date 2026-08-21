import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Property.css";

const BASE_URL = "http://localhost:8095/api"; // update to your actual backend base URL

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bhk, setBhk] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/getAll`);
      const data = res.data.properties || [];
      setProperties(data);
      setFiltered(data);
    } catch (err) {
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))];

  const applyFilters = () => {
    let result = [...properties];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.propertyName?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q),
      );
    }

    if (propertyType) {
      result = result.filter((p) => p.propertyType === propertyType);
    }

    if (city) {
      result = result.filter((p) => p.city === city);
    }

    if (bhk) {
      result = result.filter((p) => String(p.bedrooms) === bhk);
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => {
        const price = Number(p.price);
        if (max) return price >= min && price <= max;
        return price >= min;
      });
    }

    if (sortBy === "priceLowHigh") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFiltered(result);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, propertyType, priceRange, bhk, city, sortBy, properties]);

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
    <div className="property-page">
      {/* Hero Section */}
      <section className="property-hero">
        <div className="property-hero-overlay" />
        <div className="property-hero-content">
          <h1>Find Your Dream Property</h1>
          <p>
            Curated selection of exclusive estates, modern villas, and luxury
            apartments tailored for the discerning buyer.
          </p>
        </div>

        <div className="property-search-bar">
          <div className="property-search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by city, property name, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="property-search-btn" onClick={applyFilters}>
            Search Properties
          </button>
        </div>

        <div className="property-filters">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Independent House">Independent House</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-5000000">Under ₹50L</option>
            <option value="5000000-10000000">₹50L - ₹1Cr</option>
            <option value="10000000-30000000">₹1Cr - ₹3Cr</option>
            <option value="30000000-0">Above ₹3Cr</option>
          </select>

          <select value={bhk} onChange={(e) => setBhk(e.target.value)}>
            <option value="">BHK Config</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>

          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">City</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </section>

      {/* Listings Section */}
      <section className="property-listings">
        <div className="listings-header">
          <div>
            <h2>Exclusive Listings</h2>
            <p>Discover handpicked properties matching your lifestyle.</p>
          </div>
          <button
            className="view-all-btn"
            onClick={() => {
              setSearch("");
              setPropertyType("");
              setPriceRange("");
              setBhk("");
              setCity("");
              setSortBy("");
            }}
          >
            View All Properties →
          </button>
        </div>

        {loading && <p className="status-text">Loading properties...</p>}
        {error && <p className="status-text error">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="status-text">No properties found.</p>
        )}

        <div className="property-grid">
          {filtered.map((p) => (
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
              {selectedProperty.images &&
              selectedProperty.images.length > 0 ? (
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

export default Property;