import React from 'react';
import { useParams } from 'react-router-dom';
import { properties, areas } from '../data/data';
import './Listings.css';

const Listings = () => {
  const { area } = useParams();
  const areaData = areas[area];
  const propertyList = properties[area] || [];

  if (!areaData) {
    return (
      <div className="listings-page">
        <div className="container">
          <div className="section-title">
            <h2>Area Not Found</h2>
            <p>The requested area could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-page">
      <div className="container">
        <div className="section-title">
          <h2>{areaData.name} Properties</h2>
          <p>{areaData.description}</p>
        </div>

        {propertyList.length > 0 ? (
          <div className="listings-grid">
            {propertyList.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  <span>Property Image</span>
                </div>
                <div className="property-details">
                  <div className="property-price">{property.price}</div>
                  <div className="property-title">{property.title}</div>
                  <div className="property-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {property.location}
                  </div>
                  <div className="property-features">
                    <div className="feature">
                      <i className="fas fa-bed"></i>
                      {property.beds} Beds
                    </div>
                    <div className="feature">
                      <i className="fas fa-bath"></i>
                      {property.baths} Baths
                    </div>
                    <div className="feature">
                      <i className="fas fa-expand-arrows-alt"></i>
                      {property.area}
                    </div>
                  </div>
                  <div className="property-buttons">
                    <a 
                      href="https://99acres.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-small btn-primary"
                    >
                      99acres
                    </a>
                    <a 
                      href="https://magicbricks.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-small btn-outline"
                    >
                      MagicBricks
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-properties">
            <div className="no-properties-content">
              <i className="fas fa-home"></i>
              <h3>No Properties Available</h3>
              <p>We're currently updating our listings for this area. Please check back soon or contact us for the latest available properties.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;