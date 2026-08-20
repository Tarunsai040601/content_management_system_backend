import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProperties, deleteProperty } from '../../../services/propertyService';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminProperties.css';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, propertyName: null });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await getAdminProperties();
      if (res.data && res.data.success) {
        setProperties(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (propertyName) => {
    setDeleteModal({ show: true, propertyName });
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteProperty(deleteModal.propertyName);
      if (res.data) {
        toast.success('Property deleted successfully');
        setProperties(properties.filter(p => p.propertyName !== deleteModal.propertyName));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete property');
    } finally {
      setDeleteModal({ show: false, propertyName: null });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="admin-properties-page">
      <div className="page-header-flex">
        <div>
          <h1>Manage Properties</h1>
          <p>View, edit, or delete your property listings.</p>
        </div>
        <Link to="/admin/properties/create" className="btn btn-primary">
          <FiPlus /> Add New Property
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <p>No properties found.</p>
            <Link to="/admin/properties/create" className="btn btn-outline" style={{marginTop: '1rem'}}>
              Create your first property
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property._id}>
                  <td>
                    <img 
                      src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/60'} 
                      alt={property.propertyName} 
                      className="table-img" 
                    />
                  </td>
                  <td className="font-medium">{property.propertyName}</td>
                  <td><span className="badge">{property.propertyType}</span></td>
                  <td>{property.city}</td>
                  <td className="font-bold">{formatPrice(property.price)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/properties/edit/${property.propertyName}`} className="btn-icon edit" title="Edit">
                        <FiEdit2 />
                      </Link>
                      <button className="btn-icon delete" onClick={() => handleDeleteClick(property.propertyName)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete property "{deleteModal.propertyName}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteModal({ show: false, propertyName: null })}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
