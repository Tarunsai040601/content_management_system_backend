import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h1>Building Trust, One Home at a Time</h1>
          <p>
            Welcome to Estora Real Estate, where our passion for exceptional living spaces meets 
            unparalleled dedication to our clients.
          </p>
        </div>
      </div>

      <div className="about-main">
        <section className="about-section">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Founded with a vision to redefine the real estate experience, Estora has grown 
              from a boutique agency into a leading force in luxury real estate. We believe that 
              finding a home is more than a transaction; it's a life-changing milestone. 
            </p>
            <p>
              Over the years, we have curated a portfolio of the most exquisite properties, 
              ensuring that every client finds a space that perfectly aligns with their lifestyle, 
              aspirations, and dreams.
            </p>
          </div>
          <div className="about-image-placeholder story-image">
            <span className="emoji-icon">🏛️</span>
          </div>
        </section>

        <section className="about-section reverse">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide an unmatched level of service and expertise in the 
              real estate market. We strive to empower our clients with comprehensive market 
              insights, innovative marketing strategies, and a seamless buying or selling journey.
            </p>
            <p>
              Integrity, transparency, and excellence are the core values that drive everything 
              we do. We don't just sell properties; we build lasting relationships.
            </p>
          </div>
          <div className="about-image-placeholder mission-image">
            <span className="emoji-icon">🎯</span>
          </div>
        </section>

        <section className="about-stats">
          <div className="stat-card">
            <h3>10+</h3>
            <p>Years of Experience</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Properties Sold</p>
          </div>
          <div className="stat-card">
            <h3>$2B+</h3>
            <p>Sales Volume</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Client Satisfaction</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
