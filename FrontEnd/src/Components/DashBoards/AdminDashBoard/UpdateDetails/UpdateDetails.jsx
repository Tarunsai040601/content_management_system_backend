import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./UpdateDetails.css";

const API_BASE_URL = "http://localhost:8095/api";

const UpdateDetails = () => {
  const navigate = useNavigate();
  const { propertyName } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    price: "",
    city: "",
    location: "",
    fullAddress: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    amenities: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/get/${encodeURIComponent(propertyName)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const data = await response.json();

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
          throw new Error(data.message || "Failed to fetch property details");
        }
        
        const prop = data.property || data;

        setFormData({
          propertyName: prop.propertyName || "",
          propertyType: prop.propertyType || "",
          price: prop.price || "",
          city: prop.city || "",
          location: prop.location || "",
          fullAddress: prop.fullAddress || "",
          bedrooms: prop.bedrooms || "",
          bathrooms: prop.bathrooms || "",
          area: prop.area || "",
          description: prop.description || "",
          amenities: Array.isArray(prop.amenities) ? prop.amenities.join(", ") : (prop.amenities || ""),
        });
        
        if (prop.images) {
          setImagePreview(prop.images);
        }

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Could not fetch property details.",
          confirmButtonColor: "#263c33",
        });
        navigate("/admin-home/show-details");
      } finally {
        setFetching(false);
      }
    };

    if (propertyName) {
      fetchProperty();
    }
  }, [propertyName, navigate]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreview(previews);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Admin login session not found.",
        confirmButtonColor: "#263c33",
      });

      navigate("/");
      return;
    }

    if (
      !formData.propertyName.trim() ||
      !formData.propertyType ||
      !formData.price ||
      !formData.city.trim() ||
      !formData.location.trim() ||
      !formData.fullAddress.trim() ||
      !formData.bedrooms ||
      !formData.bathrooms ||
      !formData.area ||
      !formData.description.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all required property details.",
        confirmButtonColor: "#263c33",
      });

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("propertyName", formData.propertyName.trim());
      data.append("propertyType", formData.propertyType);
      data.append("price", formData.price);
      data.append("city", formData.city.trim());
      data.append("location", formData.location.trim());
      data.append("fullAddress", formData.fullAddress.trim());
      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("area", formData.area);
      data.append("description", formData.description.trim());
      data.append("amenities", formData.amenities);

      // Multiple images
      if (images.length > 0) {
        images.forEach((image) => {
          data.append("images", image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/update/${encodeURIComponent(propertyName)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Please login again as admin.",
            confirmButtonColor: "#263c33",
          });

          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");

          navigate("/");
          return;
        }

        throw new Error(result.message || "Failed to update property");
      }

      await Swal.fire({
        icon: "success",
        title: "Property Updated!",
        text: result.message || "Property updated successfully.",
        confirmButtonText: "View Properties",
        confirmButtonColor: "#263c33",
      });

      navigate("/admin-home/show-details");
    } catch (error) {
      console.error("Update Property Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Unable to update property.",
        confirmButtonColor: "#263c33",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="update-details-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <h2>Loading property details...</h2>
      </div>
    );
  }

  return (
    <div className="update-details-page">
      <div className="update-details-background"></div>

      <div className="update-details-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="update-details-header">
          <div>
            <span className="update-details-overline">ESTORA ADMIN</span>

            <h1>Update Property</h1>

            <p>Modify and update an existing property listing.</p>
          </div>

          <button
            type="button"
            className="update-details-back-btn"
            onClick={() => navigate("/admin-home/show-details")}
          >
            ← View Properties
          </button>
        </div>

        {/* =========================
            FORM CARD
        ========================= */}

        <form className="update-details-form-card" onSubmit={handleSubmit}>
          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <div className="update-details-section">
            <div className="update-details-section-title">
              <span>01</span>

              <div>
                <h2>Basic Information</h2>
                <p>Enter the main property details.</p>
              </div>
            </div>

            <div className="update-details-grid">
              <div className="update-details-field">
                <label>Property Name *</label>

                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g. Skyline Luxury Villa"
                />
              </div>

              <div className="update-details-field">
                <label>Property Type *</label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="update-details-field">
                <label>Price *</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                />
              </div>

              <div className="update-details-field">
                <label>City *</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                />
              </div>

              <div className="update-details-field">
                <label>Location *</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Gachibowli"
                />
              </div>

              <div className="update-details-field">
                <label>Full Address *</label>

                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="Complete property address"
                />
              </div>
            </div>
          </div>

          {/* =========================
              PROPERTY DETAILS
          ========================= */}

          <div className="update-details-section">
            <div className="update-details-section-title">
              <span>02</span>

              <div>
                <h2>Property Details</h2>
                <p>Specify size and room information.</p>
              </div>
            </div>

            <div className="update-details-grid">
              <div className="update-details-field">
                <label>Bedrooms *</label>

                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="0"
                />
              </div>

              <div className="update-details-field">
                <label>Bathrooms *</label>

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  min="0"
                />
              </div>

              <div className="update-details-field">
                <label>Area *</label>

                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 2400 sq.ft"
                />
              </div>

              <div className="update-details-field update-details-full">
                <label>Amenities</label>

                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Swimming Pool, Gym, Parking, Garden"
                />

                <small>Separate multiple amenities with commas.</small>
              </div>

              <div className="update-details-field update-details-full">
                <label>Description *</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the property..."
                  rows="6"
                />
              </div>
            </div>
          </div>

          {/* =========================
              IMAGES
          ========================= */}

          <div className="update-details-section">
            <div className="update-details-section-title">
              <span>03</span>

              <div>
                <h2>Property Images</h2>
                <p>Upload multiple property images (optional, overwrites existing).</p>
              </div>
            </div>

            <label className="update-details-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <div className="update-details-upload-icon">↑</div>

              <strong>Choose New Images</strong>

              <span>PNG, JPG, JPEG supported</span>
            </label>

            {imagePreview.length > 0 && (
              <div className="update-details-preview-grid">
                {imagePreview.map((image, index) => (
                  <div className="update-details-preview" key={index}>
                    <img src={image} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="update-details-actions">
            <button
              type="button"
              className="update-details-cancel"
              onClick={() => navigate("/admin-home/show-details")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-details-submit"
              disabled={loading}
            >
              {loading ? "Updating Property..." : "Update Property →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDetails;
