import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchAreas, fetchProperties, fetchPropertiesByArea } from '../services/api';
import PageTransition from './PageTransition';
import './Properties.css';

// Image Carousel Component for Frontend Property Cards
const PropertyImageCarousel = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-cycle images every 3 seconds
  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(nextImage, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="property-image">
        <span>Property Image</span>
      </div>
    );
  }

  return (
    <div className="property-image-carousel">
      <div 
        className="property-image"
        style={{
          backgroundImage: `url(http://localhost:5000${images[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {images.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <button 
              className="carousel-btn carousel-btn-prev"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <button 
              className="carousel-btn carousel-btn-next"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Image Counter */}
            <div className="image-counter">
              {currentImageIndex + 1}/{images.length}
            </div>

            {/* Dot Indicators */}
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'all');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [areas, setAreas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const areaFromUrl = searchParams.get('area');
    if (areaFromUrl && areaFromUrl !== selectedArea) {
      setSelectedArea(areaFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(areas).length > 0) {
      filterProperties();
    }
  }, [selectedArea, areas]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load areas first
      const areasData = await fetchAreas();
      setAreas(areasData);
      
      // If no areas loaded from API, load fallback
      if (Object.keys(areasData).length === 0) {
        const { areas: fallbackAreas } = await import('../data/data');
        setAreas(fallbackAreas);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load data');
      
      // Load fallback data
      try {
        const { areas: fallbackAreas, properties: fallbackProperties } = await import('../data/data');
        setAreas(fallbackAreas);
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = async () => {
    try {
      setLoading(true);
      let properties = [];

      if (selectedArea === 'all') {
        // Get all properties
        properties = await fetchProperties();
      } else {
        // Get properties for specific area
        properties = await fetchPropertiesByArea(selectedArea);
      }

      // Add area information to each property
      const propertiesWithAreaInfo = properties.map(property => ({
        ...property,
        areaName: areas[property.areaKey]?.name || property.areaKey
      }));

      setFilteredProperties(propertiesWithAreaInfo);
    } catch (error) {
      console.error('Error filtering properties:', error);
      
      // Fallback to static data
      try {
        const { properties: fallbackProperties } = await import('../data/data');
        if (selectedArea === 'all') {
          const allProperties = [];
          Object.entries(fallbackProperties).forEach(([areaKey, areaProperties]) => {
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
          const areaProperties = fallbackProperties[selectedArea] || [];
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
      } catch (fallbackError) {
        console.error('Error loading fallback properties:', fallbackError);
        setFilteredProperties([]);
      }
    } finally {
      setLoading(false);
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

  // 🆕 Navigate to property detail page
  const handleViewProperty = (property) => {
    console.log('🏠 Navigating to property details:', property.title);
    navigate(`/property/${property._id || property.id}`, { 
      state: { property, areaName: property.areaName } 
    });
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

  if (loading && Object.keys(areas).length === 0) {
    return (
      <PageTransition>
        <div className="properties-page">
          <div className="container">
            <div className="section-title">
              <h2>Loading Properties...</h2>
              <div className="loading-spinner" style={{ margin: '50px auto' }}></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="properties-page">
        <div className="container">
          <div className="section-title">
            <h2>{getPageTitle()}</h2>
            <p>{getPageDescription()}</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ef5350'
            }}>
              {error}
            </div>
          )}

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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="properties-grid">
              {filteredProperties.map((property, index) => (
                <div 
                  key={property._id || `${property.areaKey}-${index}`} 
                  className="property-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Property Image with Carousel */}
                  <PropertyImageCarousel 
                    images={property.images} 
                    title={property.title}
                  />
                  
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
                    
                    {/* 🆕 Single View Property Button */}
                    <div className="property-buttons">
                      <button
                        className="btn btn-primary view-property-btn"
                        onClick={() => handleViewProperty(property)}
                      >
                        <i className="fas fa-eye"></i>
                        View Property
                      </button>
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
                <p>
                  {selectedArea === 'all' 
                    ? "No properties found. Check back soon or contact us for the latest available properties."
                    : `No properties found in ${areas[selectedArea]?.name || selectedArea}. Try selecting a different area or contact us for more information.`
                  }
                </p>
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