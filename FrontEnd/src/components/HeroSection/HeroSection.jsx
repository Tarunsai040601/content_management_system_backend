import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Find a Place You'll Love to Call Home</h1>
          <p className="hero-subtitle">
            Discover the perfect property that fits your lifestyle. Premium real estate listings updated daily.
          </p>
          <SearchBar className="hero-search" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
