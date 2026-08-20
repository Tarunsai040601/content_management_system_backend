import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/HeroSection/HeroSection';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertySkeleton from '../../components/Loading/PropertySkeleton';
import { getAllProperties } from '../../services/propertyService';
import { FiCheckCircle, FiShield, FiSearch, FiLock } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getAllProperties();
        if (response.data && response.data.success) {
          // Take first 4 properties as featured
          setFeaturedProperties(response.data.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="home-page">
      <HeroSection />

      {/* Featured Properties Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Explore our handpicked selection of premium properties</p>
          </div>

          <div className="properties-grid">
            {loading ? (
              [...Array(4)].map((_, index) => <PropertySkeleton key={index} />)
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            ) : (
              <div className="empty-state">
                <p>No featured properties available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="view-all-container">
            <Link to="/properties" className="btn btn-outline view-all-btn">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">We provide full service at every step</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiCheckCircle className="feature-icon" />
              </div>
              <h3 className="feature-title">Verified Properties</h3>
              <p className="feature-desc">All our properties are thoroughly verified to ensure safe and secure transactions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiShield className="feature-icon" />
              </div>
              <h3 className="feature-title">Trusted Agents</h3>
              <p className="feature-desc">Work with experienced and highly-rated real estate professionals in your area.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiSearch className="feature-icon" />
              </div>
              <h3 className="feature-title">Easy Search</h3>
              <p className="feature-desc">Find your dream home quickly using our advanced search and filtering tools.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiLock className="feature-icon" />
              </div>
              <h3 className="feature-title">Secure Experience</h3>
              <p className="feature-desc">Your data and transactions are protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <h2>Ready to find your dream property?</h2>
          <p>Join thousands of satisfied customers who found their perfect home with us.</p>
          <Link to="/properties" className="btn btn-primary cta-btn">
            Explore Properties
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
