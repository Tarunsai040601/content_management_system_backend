import React, { useState, useEffect } from 'react';
import { getAdminProperties } from '../../../services/propertyService';
import { FiHome, FiGrid, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    apartments: 0,
    villas: 0,
    commercial: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real scenario, there might be a dedicated stats API.
      // Here, we fetch the admin's properties and compute the stats.
      const response = await getAdminProperties();
      if (response.data && response.data.success) {
        const properties = response.data.data;
        
        const counts = {
          total: properties.length,
          apartments: properties.filter(p => p.propertyType === 'Apartment').length,
          villas: properties.filter(p => p.propertyType === 'Villa').length,
          commercial: properties.filter(p => p.propertyType === 'Commercial').length,
          houses: properties.filter(p => p.propertyType === 'Independent House').length,
        };
        
        setStats(counts);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here is a summary of your property listings.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FiGrid className="stat-icon" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Properties</p>
            <h3 className="stat-value">{loading ? '...' : stats.total}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <FiHome className="stat-icon" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Apartments</p>
            <h3 className="stat-value">{loading ? '...' : stats.apartments}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <FiTrendingUp className="stat-icon" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Villas & Houses</p>
            <h3 className="stat-value">{loading ? '...' : (stats.villas + (stats.houses || 0))}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <FiDollarSign className="stat-icon" />
          </div>
          <div className="stat-details">
            <p className="stat-label">Commercial</p>
            <h3 className="stat-value">{loading ? '...' : stats.commercial}</h3>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <p>Navigate to different sections using the sidebar to manage your real estate portfolio.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
