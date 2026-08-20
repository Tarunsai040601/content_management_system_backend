import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertySkeleton from '../../components/Loading/PropertySkeleton';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import SearchBar from '../../components/SearchBar/SearchBar';
import { getAllProperties } from '../../services/propertyService';
import { FiFilter } from 'react-icons/fi';
import './Properties.css';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    propertyType: '',
    price: '',
    bedrooms: ''
  });
  
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyAllFiltersAndSort();
  }, [properties, sortOption, searchParams]);

  const fetchProperties = async () => {
    try {
      const response = await getAllProperties();
      if (response.data && response.data.properties) {
        setProperties(response.data.properties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = ({ search, location }) => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    
    if (location) params.set('location', location);
    else params.delete('location');
    
    setSearchParams(params);
  };

  const applyFilters = () => {
    applyAllFiltersAndSort();
    if (isFilterDrawerOpen) setIsFilterDrawerOpen(false);
  };

  const clearFilters = () => {
    setFilters({ propertyType: '', price: '', bedrooms: '' });
    setSearchParams(new URLSearchParams());
    if (isFilterDrawerOpen) setIsFilterDrawerOpen(false);
  };

  const applyAllFiltersAndSort = () => {
    let result = [...properties];
    
    // 1. Search Query
    const searchQ = searchParams.get('search')?.toLowerCase();
    const locQ = searchParams.get('location')?.toLowerCase();
    
    if (searchQ) {
      result = result.filter(p => 
        p.propertyName.toLowerCase().includes(searchQ) || 
        p.city.toLowerCase().includes(searchQ)
      );
    }
    
    if (locQ) {
      result = result.filter(p => p.location.toLowerCase().includes(locQ));
    }
    
    // 2. Filters
    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters.price) {
      result = result.filter(p => {
        if (filters.price === 'under50') return p.price < 5000000;
        if (filters.price === '50to100') return p.price >= 5000000 && p.price <= 10000000;
        if (filters.price === 'above100') return p.price > 10000000;
        return true;
      });
    }
    
    if (filters.bedrooms) {
      result = result.filter(p => {
        if (filters.bedrooms === '4+') return p.bedrooms >= 4;
        return p.bedrooms === parseInt(filters.bedrooms);
      });
    }
    
    // 3. Sorting
    if (sortOption === 'priceLow') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceHigh') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredProperties(result);
  };

  return (
    <div className="properties-page">
      <div className="properties-header">
        <div className="container">
          <SearchBar onSearch={handleSearch} className="properties-search" />
        </div>
      </div>

      <div className="container properties-container">
        {/* Mobile Filter Button */}
        <div className="mobile-filter-bar">
          <button className="btn btn-outline" onClick={() => setIsFilterDrawerOpen(true)}>
            <FiFilter /> Filters
          </button>
          <div className="sort-container">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
              <option value="newest">Newest Listings</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="properties-content">
          {/* Sidebar Filters */}
          <div className={`filter-sidebar ${isFilterDrawerOpen ? 'open' : ''}`}>
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              applyFilters={applyFilters} 
              clearFilters={clearFilters}
              closeMobileDrawer={() => setIsFilterDrawerOpen(false)}
            />
          </div>

          {/* Overlay for mobile drawer */}
          {isFilterDrawerOpen && (
            <div className="filter-overlay" onClick={() => setIsFilterDrawerOpen(false)}></div>
          )}

          {/* Properties Grid */}
          <div className="properties-main">
            <div className="results-info">
              <span>{filteredProperties.length} Properties Found</span>
              <div className="desktop-sort">
                <span className="sort-label">Sort By:</span>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
                  <option value="newest">Newest Listings</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="main-grid">
              {loading ? (
                [...Array(6)].map((_, index) => <PropertySkeleton key={index} />)
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))
              ) : (
                <div className="empty-state">
                  <p>No properties found matching your criteria.</p>
                  <button className="btn btn-outline" onClick={clearFilters} style={{marginTop: '1rem'}}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
