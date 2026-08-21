import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AdminShowDeatails.css";

const API_BASE_URL = "http://localhost:8095/api";

const AdminShowDeatails = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [city, setCity] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // =========================
  // FETCH ADMIN PROPERTIES
  // =========================

  const fetchProperties = useCallback(async () => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/getAdminProperties`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      console.log("Admin Properties:", data);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again as admin.",
          confirmButtonColor: "#263c33",
        });

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch properties");
      }

      setProperties(data.properties || []);
    } catch (error) {
      console.error("Fetch Properties Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load",
        text: error.message || "Failed to fetch properties.",
        confirmButtonColor: "#263c33",
      });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // =========================
  // CITIES
  // =========================

  const cities = useMemo(() => {
    const cityList = properties
      .map((property) => property.city)
      .filter(Boolean);

    return [...new Set(cityList)];
  }, [properties]);

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((property) => {
        return (
          property.propertyName?.toLowerCase().includes(searchValue) ||
          property.propertyType?.toLowerCase().includes(searchValue) ||
          property.city?.toLowerCase().includes(searchValue) ||
          property.location?.toLowerCase().includes(searchValue)
        );
      });
    }

    if (propertyType !== "all") {
      result = result.filter(
        (property) => property.propertyType === propertyType,
      );
    }

    if (city !== "all") {
      result = result.filter((property) => property.city === city);
    }

    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sortBy === "priceLow") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortBy === "priceHigh") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return result;
  }, [properties, search, propertyType, city, sortBy]);

  // =========================
  // DELETE PROPERTY
  // =========================

  const handleDelete = async (property) => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/");
      return;
    }

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete Property?",
      html: `
        <p>
          Are you sure you want to delete
          <strong>${property.propertyName}</strong>?
        </p>
        <p style="font-size:13px;color:#777;">
          This action cannot be undone.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#a33a3a",
      cancelButtonColor: "#263c33",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        `${API_BASE_URL}/delete/${encodeURIComponent(property.propertyName)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        Swal.close();

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        await Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again as admin.",
          confirmButtonColor: "#263c33",
        });

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete property");
      }

      setProperties((prev) => prev.filter((item) => item._id !== property._id));

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: data.message || "Property deleted successfully.",
        confirmButtonColor: "#263c33",
      });
    } catch (error) {
      console.error("Delete Property Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message || "Unable to delete property.",
        confirmButtonColor: "#263c33",
      });
    }
  };

  // =========================
  // UPDATE
  // =========================

  const handleUpdate = (property) => {
    navigate(
      `/admin-home/show-details/${encodeURIComponent(property.propertyName)}`,
    );
  };

  // =========================
  // PRICE FORMAT
  // =========================

  const formatPrice = (price) => {
    const number = Number(price);

    if (Number.isNaN(number)) {
      return price;
    }

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="admin-show-page">
      <div className="admin-show-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-show-header">
          <div>
            <span className="admin-show-overline">ESTORA ADMIN</span>

            <h1>Your Properties</h1>

            <p>Manage all properties created from your admin account.</p>
          </div>

          <button
            className="admin-show-add-btn"
            onClick={() => navigate("/admin-home/add-details")}
          >
            <span>+</span>
            Add Property
          </button>
        </div>

        {/* =========================
            STAT
        ========================= */}

        <div className="admin-show-stat">
          <div>
            <strong>{properties.length}</strong>

            <span>Total Properties</span>
          </div>

          <div>
            <strong>{filteredProperties.length}</strong>

            <span>Showing</span>
          </div>
        </div>

        {/* =========================
            FILTER BAR
        ========================= */}

        <div className="admin-show-filter">
          <div className="admin-show-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search property, city, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && <button onClick={() => setSearch("")}>×</button>}
          </div>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="all">All Property Types</option>

            {[
              ...new Set(
                properties
                  .map((property) => property.propertyType)
                  .filter(Boolean),
              ),
            ].map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>

          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="all">All Cities</option>

            {cities.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest First</option>

            <option value="oldest">Oldest First</option>

            <option value="priceLow">Price: Low to High</option>

            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="admin-show-loading">
            <div className="admin-show-spinner"></div>

            <p>Loading properties...</p>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================= */}

        {!loading && properties.length === 0 && (
          <div className="admin-show-empty">
            <div className="admin-empty-icon">⌂</div>

            <h2>No Properties Yet</h2>

            <p>Start by adding your first property listing.</p>

            <button onClick={() => navigate("/add-details")}>
              Add First Property →
            </button>
          </div>
        )}

        {/* =========================
            NO SEARCH RESULT
        ========================= */}

        {!loading &&
          properties.length > 0 &&
          filteredProperties.length === 0 && (
            <div className="admin-show-empty">
              <div className="admin-empty-icon">⌕</div>

              <h2>No Matching Properties</h2>

              <p>Try changing your search or filters.</p>

              <button
                onClick={() => {
                  setSearch("");
                  setPropertyType("all");
                  setCity("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* =========================
            PROPERTY GRID
        ========================= */}

        {!loading && filteredProperties.length > 0 && (
          <div className="admin-show-grid">
            {filteredProperties.map((property) => (
              <article className="admin-property-card" key={property._id}>
                {/* Image */}

                <div className="admin-property-image">
                  {property.images?.length > 0 ? (
                    <img src={property.images[0]} alt={property.propertyName} />
                  ) : (
                    <div className="admin-no-image">No Image</div>
                  )}

                  <span className="admin-property-type">
                    {property.propertyType}
                  </span>

                  <span className="admin-property-price">
                    ₹ {formatPrice(property.price)}
                  </span>
                </div>

                {/* Content */}

                <div className="admin-property-content">
                  <h2>{property.propertyName}</h2>

                  <p className="admin-property-location">
                    <span>⌖</span>
                    {property.location}, {property.city}
                  </p>

                  <p className="admin-property-address">
                    {property.fullAddress}
                  </p>

                  {/* Details */}

                  <div className="admin-property-details">
                    <div>
                      <strong>{property.bedrooms}</strong>
                      <span>Beds</span>
                    </div>

                    <div>
                      <strong>{property.bathrooms}</strong>
                      <span>Baths</span>
                    </div>

                    <div>
                      <strong>{property.area}</strong>
                      <span>Area</span>
                    </div>
                  </div>

                  {/* Amenities */}

                  {property.amenities?.length > 0 && (
                    <div className="admin-property-amenities">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index}>{amenity}</span>
                      ))}

                      {property.amenities.length > 3 && (
                        <span>+{property.amenities.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}

                  <div className="admin-property-actions">
                    <button
                      className="admin-update-btn"
                      onClick={() => handleUpdate(property)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(property)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShowDeatails;
