import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({ onSearch = null, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search: searchTerm, location: locationTerm });
    } else {
      // If used on home page, navigate to properties page with query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (locationTerm) params.append('location', locationTerm);
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <div className="search-input-group">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Property Name, City..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="search-divider"></div>
      
      <div className="search-input-group">
        <FiMapPin className="search-icon" />
        <input 
          type="text" 
          placeholder="Location (e.g. Gachibowli)" 
          value={locationTerm}
          onChange={(e) => setLocationTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <button type="submit" className="btn btn-primary search-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
