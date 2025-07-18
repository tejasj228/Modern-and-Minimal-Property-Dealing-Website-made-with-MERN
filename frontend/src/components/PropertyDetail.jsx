import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
=======
  // 🆕 FIXED: Helper function to get correct image URL
  const getImageUrl = (imageUrl) => {
    // If it's already a full URL (Cloudinary), return as-is
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // If it's a relative path, add localhost (for old local uploads)
    return `http://localhost:5000${imageUrl}`;
  };

>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
  useEffect(() => {
    // Get property data from navigation state or fetch from API
    if (location.state?.property) {
      setProperty(location.state.property);
      setAreaName(location.state.areaName || '');
      setLoading(false);
<<<<<<< HEAD
=======
      
      console.log('🏠 Property loaded from state:', location.state.property.title);
      console.log('🏠 Property images:', location.state.property.images);
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
    } else {
      // If no state data, you can fetch property by ID from API
      // For now, redirect back to properties
      console.log('No property data found, redirecting...');
      navigate('/properties');
    }
  }, [id, location.state, navigate]);

  // 🆕 AUTO-CYCLING SLIDESHOW - Added useEffect for auto image cycling
  useEffect(() => {
    if (property?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [property?.images?.length]);

  const nextImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // 🆕 FUNCTIONAL CONTACT METHODS
  const handlePhoneCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="property-detail-page">
          <div className="container">
            <div className="loading-spinner" style={{ margin: '100px auto' }}></div>
            <p style={{ textAlign: 'center' }}>Loading property details...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!property) {
    return (
      <PageTransition>
        <div className="property-detail-page">
          <div className="container">
            <div className="error-message">
              <h2>Property Not Found</h2>
              <p>The property you're looking for could not be found.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/properties')}
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

<<<<<<< HEAD
=======
  // 🆕 FIXED: Get current image URL using helper function
  const currentImageUrl = property.images && property.images.length > 0 
    ? getImageUrl(property.images[currentImageIndex]) 
    : null;

>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
  return (
    <PageTransition>
      <div className="property-detail-page">
        <div className="container">
          {/* Back Button */}
          <div className="back-navigation">
            <button 
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Properties
            </button>
          </div>

          {/* Property Header */}
          <div className="property-header">
            <div className="property-title-section">
              <h1>{property.title}</h1>
              <div className="property-location">
                <i className="fas fa-map-marker-alt"></i>
                {property.location}
              </div>
              <div className="property-area-badge">
                <i className="fas fa-building"></i>
                {areaName}
              </div>
            </div>
            <div className="property-price-section">
              <div className="property-price">{property.price}</div>
            </div>
          </div>

          {/* Property Images Gallery */}
          <div className="property-gallery">
            {property.images && property.images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="main-image-container">
                  <img
<<<<<<< HEAD
                    src={`http://localhost:5000${property.images[currentImageIndex]}`}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="main-image"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder-property.jpg';
                    }}
=======
                    src={currentImageUrl}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="main-image"
                    onError={(e) => {
                      console.error('❌ Property detail image failed to load:', currentImageUrl);
                      e.target.src = '/assets/placeholder-property.jpg';
                    }}
                    onLoad={() => {
                      console.log('✅ Property detail image loaded:', currentImageUrl);
                    }}
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
                  />
                  
                  {/* Navigation Arrows */}
                  {property.images.length > 1 && (
                    <>
                      <button className="gallery-nav gallery-prev" onClick={prevImage}>
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button className="gallery-nav gallery-next" onClick={nextImage}>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="image-counter">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {property.images.length > 1 && (
                  <div className="thumbnail-gallery">
<<<<<<< HEAD
                    {property.images.map((image, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => goToImage(index)}
                      >
                        <img
                          src={`http://localhost:5000${image}`}
                          alt={`${property.title} - Thumbnail ${index + 1}`}
                          onError={(e) => {
                            e.target.src = '/assets/placeholder-property.jpg';
                          }}
                        />
                      </div>
                    ))}
=======
                    {property.images.map((image, index) => {
                      const thumbnailUrl = getImageUrl(image);
                      return (
                        <div
                          key={index}
                          className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => goToImage(index)}
                        >
                          <img
                            src={thumbnailUrl}
                            alt={`${property.title} - Thumbnail ${index + 1}`}
                            onError={(e) => {
                              console.error('❌ Thumbnail failed to load:', thumbnailUrl);
                              e.target.src = '/assets/placeholder-property.jpg';
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 🆕 ADDED: Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ 
                    fontSize: '12px', 
                    padding: '10px', 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    color: 'white',
                    marginTop: '10px',
                    borderRadius: '4px'
                  }}>
                    <strong>Debug Info:</strong><br />
                    Current Image: {currentImageIndex + 1}/{property.images.length}<br />
                    URL: {currentImageUrl}
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
                  </div>
                )}
              </>
            ) : (
              <div className="no-images">
                <i className="fas fa-image"></i>
                <p>No images available for this property</p>
              </div>
            )}
          </div>

          {/* Property Details Grid */}
          <div className="property-details-grid">
            {/* Left Column - Main Details */}
            <div className="property-main-details">
              {/* Property Features */}
              <div className="detail-section">
                <h3>Property Features</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <i className="fas fa-bed"></i>
                    <span>{property.beds} Bedrooms</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-bath"></i>
                    <span>{property.baths} Bathrooms</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-expand-arrows-alt"></i>
                    <span>{property.area}</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-home"></i>
                    <span>Ready to Move</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="detail-section">
                  <h3>Description</h3>
                  <p className="property-description">{property.description}</p>
                </div>
              )}

              {/* Additional Features */}
              {property.features && property.features.length > 0 && (
                <div className="detail-section">
                  <h3>Additional Features</h3>
                  <div className="features-list">
                    {property.features.map((feature, index) => (
                      <div key={index} className="feature-tag">
                        <i className="fas fa-check"></i>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact & Actions */}
            <div className="property-sidebar">
              {/* Contact Card */}
              <div className="contact-card">
                <h3>Interested in this property?</h3>
                <p>Contact us for more details and to schedule a viewing.</p>
                
                <div className="contact-actions">
                  <button 
                    className="btn btn-primary contact-btn"
                    onClick={() => navigate('/contact')}
                  >
                    <i className="fas fa-phone"></i>
                    Contact Us
                  </button>
                  
                  <div className="contact-info">
                    {/* 🆕 FUNCTIONAL PHONE BUTTON */}
                    <button
                      onClick={() => handlePhoneCall('+919811186086')}
                      className="contact-item contact-item-button"
                    >
                      <i className="fas fa-phone"></i>
                      <span>+91-9811186086</span>
                    </button>
                    {/* 🆕 FUNCTIONAL EMAIL BUTTON */}
                    <button
                      onClick={() => handleEmail('pawan127jitendra@gmail.com')}
                      className="contact-item contact-item-button"
                    >
                      <i className="fas fa-envelope"></i>
                      <span>pawan127jitendra@gmail.com</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* External Links */}
              {(property.links?.acres99 || property.links?.magicbricks) && (
                <div className="external-links-card">
                  <h3>View on Other Platforms</h3>
                  <div className="external-links">
                    {property.links?.acres99 && (
                      <a 
                        href={property.links.acres99} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        View on 99acres
                      </a>
                    )}
                    {property.links?.magicbricks && (
                      <a 
                        href={property.links.magicbricks} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        View on MagicBricks
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Property Info */}
              <div className="property-info-card">
                <h3>Property Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Property Type:</span>
                    <span className="value">Residential</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Area:</span>
                    <span className="value">{areaName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className="value">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PropertyDetail;