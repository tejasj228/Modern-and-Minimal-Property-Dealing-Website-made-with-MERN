import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { properties, areas } from '../data/data';
import PageTransition from './PageTransition';
import './Properties.css';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'all');
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    filterProperties();
  }, [selectedArea]);

  // Update selectedArea when URL changes
  useEffect(() => {
    const areaFromUrl = searchParams.get('area');
    if (areaFromUrl && areaFromUrl !== selectedArea) {
      setSelectedArea(areaFromUrl);
    }
  }, [searchParams]);

  const filterProperties = () => {
    if (selectedArea === 'all') {
      // Combine all properties from all areas
      const allProperties = [];
      Object.entries(properties).forEach(([areaKey, areaProperties]) => {
        const areaData = areas[areaKey];
        if (areaData) {
          areaProperties.forEach(property => {
            allProperties.push({
              ...property,
              areaKey,
              areaName: areaData.name
            });
          });
        }
      });
      setFilteredProperties(allProperties);
    } else {
      const areaProperties = properties[selectedArea] || [];
      const areaData = areas[selectedArea];
      if (areaData) {
        const propertiesWithArea = areaProperties.map(property => ({
          ...property,
          areaKey: selectedArea,
          areaName: areaData.name
        }));
        setFilteredProperties(propertiesWithArea);
      } else {
        setFilteredProperties([]);
      }
    }
  };

  const handleAreaChange = (areaKey) => {
    setSelectedArea(areaKey);
    if (areaKey === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ area: areaKey });
    }
  };

  const getPageTitle = () => {
    if (selectedArea === 'all') {
      return 'All Properties';
    }
    return areas[selectedArea]?.name + ' Properties' || 'Properties';
  };

  const getPageDescription = () => {
    if (selectedArea === 'all') {
      return 'Browse all available properties across our premium locations';
    }
    return areas[selectedArea]?.description || 'Explore premium properties in this area';
  };

  return (
    <PageTransition>
      <div className="properties-page">
        <div className="container">
          <div className="section-title">
            <h2>{getPageTitle()}</h2>
            <p>{getPageDescription()}</p>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-container">
              <h3>Filter by Area:</h3>
              <div className="area-filters">
                <button
                  className={`filter-btn ${selectedArea === 'all' ? 'active' : ''}`}
                  onClick={() => handleAreaChange('all')}
                >
                  All Areas
                </button>
                {Object.entries(areas).map(([key, area]) => (
                  <button
                    key={key}
                    className={`filter-btn ${selectedArea === key ? 'active' : ''}`}
                    onClick={() => handleAreaChange(key)}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="properties-grid">
              {filteredProperties.map((property, index) => (
                <div 
                  key={`${property.areaKey}-${property.id}`} 
                  className="property-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
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
                    <div className="property-area-badge">
                      <i className="fas fa-building"></i>
                      {property.areaName}
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
    </PageTransition>
  );
};

export default Properties;