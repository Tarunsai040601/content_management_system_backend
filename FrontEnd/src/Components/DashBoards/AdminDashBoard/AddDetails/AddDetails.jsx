import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AddDetails.css";

const API_BASE_URL = "https://content-management-system-backend-g705.onrender.com/api";

const AddDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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

    // =========================
    // VALIDATION
    // =========================

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
      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: data,
      });

      const result = await response.json();

      console.log("Create Property Response:", result);

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

        throw new Error(result.message || "Failed to create property");
      }

      await Swal.fire({
        icon: "success",
        title: "Property Added!",
        text: result.message || "Property created successfully.",
        confirmButtonText: "View Properties",
        confirmButtonColor: "#263c33",
      });

      // Reset form
      setFormData({
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

      setImages([]);
      setImagePreview([]);

      navigate("/admin-home/show-details");
    } catch (error) {
      console.error("Create Property Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Unable to create property.",
        confirmButtonColor: "#263c33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-details-page">
      <div className="add-details-background"></div>

      <div className="add-details-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="add-details-header">
          <div>
            <span className="add-details-overline">ESTORA ADMIN</span>

            <h1>Add New Property</h1>

            <p>Create and publish a new property listing.</p>
          </div>

          <button
            type="button"
            className="add-details-back-btn"
            onClick={() => navigate("/admin-home/show-details")}
          >
            ← View Properties
          </button>
        </div>

        {/* =========================
            FORM CARD
        ========================= */}

        <form className="add-details-form-card" onSubmit={handleSubmit}>
          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <div className="add-details-section">
            <div className="add-details-section-title">
              <span>01</span>

              <div>
                <h2>Basic Information</h2>
                <p>Enter the main property details.</p>
              </div>
            </div>

            <div className="add-details-grid">
              <div className="add-details-field">
                <label>Property Name *</label>

                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g. Skyline Luxury Villa"
                />
              </div>

              <div className="add-details-field">
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

              <div className="add-details-field">
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

              <div className="add-details-field">
                <label>City *</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                />
              </div>

              <div className="add-details-field">
                <label>Location *</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Gachibowli"
                />
              </div>

              <div className="add-details-field">
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

          <div className="add-details-section">
            <div className="add-details-section-title">
              <span>02</span>

              <div>
                <h2>Property Details</h2>
                <p>Specify size and room information.</p>
              </div>
            </div>

            <div className="add-details-grid">
              <div className="add-details-field">
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

              <div className="add-details-field">
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

              <div className="add-details-field">
                <label>Area *</label>

                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 2400 sq.ft"
                />
              </div>

              <div className="add-details-field add-details-full">
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

              <div className="add-details-field add-details-full">
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

          <div className="add-details-section">
            <div className="add-details-section-title">
              <span>03</span>

              <div>
                <h2>Property Images</h2>
                <p>Upload multiple property images.</p>
              </div>
            </div>

            <label className="add-details-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <div className="add-details-upload-icon">↑</div>

              <strong>Choose Property Images</strong>

              <span>PNG, JPG, JPEG supported</span>
            </label>

            {imagePreview.length > 0 && (
              <div className="add-details-preview-grid">
                {imagePreview.map((image, index) => (
                  <div className="add-details-preview" key={index}>
                    <img src={image} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="add-details-actions">
            <button
              type="button"
              className="add-details-cancel"
              onClick={() => navigate("/admin-home/show-details")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-details-submit"
              disabled={loading}
            >
              {loading ? "Creating Property..." : "Create Property →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDetails;
