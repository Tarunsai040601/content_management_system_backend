import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyByName, updateProperty } from '../../../services/propertyService';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import '../AdminPropertyForm.css';

const EditProperty = () => {
  const navigate = useNavigate();
  const { propertyName } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
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
  
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyByName(propertyName);
        if (res.data && res.data.success) {
          const property = res.data.data;
          setFormData({
            propertyName: property.propertyName,
            propertyType: property.propertyType,
            price: property.price,
            city: property.city,
            location: property.location,
            fullAddress: property.fullAddress,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            description: property.description,
            amenities: property.amenities ? property.amenities.join(', ') : ''
          });
          setExistingImages(property.images || []);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch property details');
        navigate('/admin/properties');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProperty();
  }, [propertyName, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (existingImages.length + selectedImages.length + files.length > 5) {
      toast.error('You can only have a maximum of 5 images total');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); 
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };
  
  const removeExistingImage = (index) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingImages.length === 0 && selectedImages.length === 0) {
      toast.error('Please have at least one image');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // In a real app, backend needs to know which existing images to keep.
    // Assuming backend handles it, or we pass existingImages array.
    // For this implementation, we will append new images and maybe pass existingImage urls.
    submitData.append('existingImages', JSON.stringify(existingImages));

    selectedImages.forEach(image => {
      submitData.append('images', image);
    });

    try {
      setLoading(true);
      const res = await updateProperty(propertyName, submitData);
      if (res.data) {
        toast.success('Property updated successfully!');
        navigate('/admin/properties');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div style={{padding: '2rem'}}>Loading property details...</div>;

  return (
    <div className="admin-property-form-page">
      <div className="page-header">
        <h1>Edit Property</h1>
      </div>

      <form className="property-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Property Name * (Readonly - Used as ID by backend)</label>
            <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} required readOnly style={{backgroundColor: '#e2e8f0'}} />
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
          <label>Amenities (Comma separated)</label>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Pool, Gym, Parking" />
        </div>

        <div className="form-group">
          <label>Property Images (Max 5 total) *</label>
          
          <div className="image-upload-container" onClick={() => document.getElementById('imageUpload').click()}>
            <FiUploadCloud className="upload-icon" />
            <p className="upload-text">Click to add more images</p>
            <input 
              type="file" 
              id="imageUpload" 
              className="upload-input" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>

          {(existingImages.length > 0 || imagePreviews.length > 0) && (
            <div className="image-previews">
              {/* Existing Images */}
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="image-preview-item">
                  <img src={img} alt={`Existing ${index}`} />
                  <button type="button" className="remove-image-btn" onClick={() => removeExistingImage(index)}>
                    <FiX />
                  </button>
                  <div style={{position:'absolute', bottom:0, width:'100%', background:'rgba(0,0,0,0.5)', color:'white', fontSize:'0.7rem', textAlign:'center'}}>Current</div>
                </div>
              ))}
              
              {/* New Images */}
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="image-preview-item">
                  <img src={preview} alt={`New Preview ${index}`} />
                  <button type="button" className="remove-image-btn" onClick={() => removeNewImage(index)}>
                    <FiX />
                  </button>
                  <div style={{position:'absolute', bottom:0, width:'100%', background:'rgba(16,185,129,0.8)', color:'white', fontSize:'0.7rem', textAlign:'center'}}>New</div>
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
            {loading ? 'Updating...' : 'Update Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
