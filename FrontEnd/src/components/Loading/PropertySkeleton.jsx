import React from 'react';
import './PropertySkeleton.css';

const PropertySkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img"></div>
      <div className="skeleton-content">
        <div className="skeleton-line price"></div>
        <div className="skeleton-line title"></div>
        <div className="skeleton-line location"></div>
        
        <div className="skeleton-features">
          <div className="skeleton-feature"></div>
          <div className="skeleton-feature"></div>
          <div className="skeleton-feature"></div>
        </div>
        
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
};

export default PropertySkeleton;
