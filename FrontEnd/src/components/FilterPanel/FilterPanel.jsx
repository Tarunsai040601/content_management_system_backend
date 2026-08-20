import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, setFilters, applyFilters, clearFilters, closeMobileDrawer }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        {closeMobileDrawer && (
          <button className="close-drawer-btn" onClick={closeMobileDrawer}>&times;</button>
        )}
      </div>

      <div className="filter-group">
        <label>Property Type</label>
        <select name="propertyType" value={filters.propertyType} onChange={handleChange} className="filter-select">
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Independent House">Independent House</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <select name="price" value={filters.price} onChange={handleChange} className="filter-select">
          <option value="">Any Price</option>
          <option value="under50">Under ₹50 Lakhs</option>
          <option value="50to100">₹50 Lakhs – ₹1 Crore</option>
          <option value="above100">Above ₹1 Crore</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Bedrooms</label>
        <select name="bedrooms" value={filters.bedrooms} onChange={handleChange} className="filter-select">
          <option value="">Any</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4+">4+ BHK</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn btn-primary btn-block" onClick={applyFilters}>Apply Filters</button>
        <button className="btn btn-outline btn-block" onClick={clearFilters}>Clear</button>
      </div>
    </div>
  );
};

export default FilterPanel;
