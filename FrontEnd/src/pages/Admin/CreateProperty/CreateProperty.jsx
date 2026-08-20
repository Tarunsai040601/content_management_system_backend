import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../../../services/propertyService';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import '../AdminPropertyForm.css';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Apartment',
    price: '',
    city: '',
    location: '',
    fullAddress: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    amenities: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (selectedImages.length + files.length > 5) {
      toast.error('You can only upload a maximum of 5 images');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    selectedImages.forEach(image => {
      submitData.append('images', image);
    });

    try {
      setLoading(true);
      const res = await createProperty(submitData);
      if (res.data) {
        toast.success('Property created successfully!');
        navigate('/admin/properties');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-property-form-page">
      <div className="page-header">
        <h1>Add New Property</h1>
      </div>

      <form className="property-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Property Name *</label>
            <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Property Type *</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location Area *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Area (sqft) *</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms *</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Bathrooms *</label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-group">
          <label>Full Address *</label>
          <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label>Amenities (Comma separated, e.g., Pool, Gym, Parking)</label>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Pool, Gym, Parking" />
        </div>

        <div className="form-group">
          <label>Property Images (Max 5) *</label>
          <div className="image-upload-container" onClick={() => document.getElementById('imageUpload').click()}>
            <FiUploadCloud className="upload-icon" />
            <p className="upload-text">Click to browse or drag and drop images here</p>
            <p style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>Supports: JPG, PNG, WEBP</p>
            <input 
              type="file" 
              id="imageUpload" 
              className="upload-input" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img src={preview} alt={`Preview ${index}`} />
                  <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/properties')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
