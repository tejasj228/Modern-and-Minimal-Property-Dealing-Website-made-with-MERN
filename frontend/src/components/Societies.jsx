// frontend/src/components/Societies.jsx - New societies page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import Modal from './Modal';
import './Societies.css';

const Societies = () => {
  const { areaKey, subAreaId } = useParams();
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [areaInfo, setAreaInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardPosition, setCardPosition] = useState(null);

  useEffect(() => {
    loadSocieties();
  }, [areaKey, subAreaId]);

  const loadSocieties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🏘️ Loading societies for area: ${areaKey}, sub-area: ${subAreaId}`);
      
      const response = await fetch(`http://localhost:5000/api/societies/${areaKey}/${subAreaId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSocieties(data.data.societies || []);
        setAreaInfo({
          areaName: data.data.areaName,
          subAreaName: data.data.subAreaName,
          subAreaDescription: data.data.subAreaDescription
        });
        console.log('✅ Societies loaded successfully:', data.data.societies.length);
      } else {
        throw new Error(data.message || 'Failed to load societies');
      }
    } catch (error) {
      console.error('❌ Error loading societies:', error);
      setError(error.message);
      // Load fallback data
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    // Fallback society data for demo
    const fallbackSocieties = [
      {
        id: 1,
        name: 'Green Valley Apartments',
        description: 'Premium residential complex with modern amenities and excellent connectivity.',
        mapImage: null,
        amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', '24/7 Power Backup'],
        contact: {
          phone: '+91-9811186086',
          email: 'info@greenvalley.com'
        }
      },
      {
        id: 2,
        name: 'Royal Heights Society',
        description: 'Luxury housing society offering world-class facilities and premium lifestyle.',
        mapImage: null,
        amenities: ['Club House', 'Tennis Court', 'Children Play Area', 'Garden', 'CCTV'],
        contact: {
          phone: '+91-9811186083',
          email: 'contact@royalheights.com'
        }
      }
    ];
    
    setSocieties(fallbackSocieties);
    setAreaInfo({
      areaName: 'Sample Area',
      subAreaName: 'Sample Sub-Area',
      subAreaDescription: 'This is sample data as the backend connection failed.'
    });
    console.log('⚠️ Using fallback society data');
  };

  const handleSocietyClick = (society, event) => {
    console.log('🏘️ Society card clicked:', society.name);
    
    // Get the clicked card element position
    const cardElement = event.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const cardAbsolutePosition = {
      y: rect.top + scrollTop - 100,
      x: rect.left,
      element: cardElement
    };
    
    setCardPosition(cardAbsolutePosition);
    setSelectedSociety(society);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSociety(null);
      setTimeout(() => {
        setCardPosition(null);
      }, 1000);
    }, 300);
  };

  const getSocietyImage = (society) => {
    if (society.mapImage) {
      return `http://localhost:5000${society.mapImage}`;
    }
    return '/assets/map.webp';
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="societies-page">
          <div className="container">
            <div className="section-title">
              <h2>Loading Societies...</h2>
              <div className="loading-spinner" style={{ margin: '50px auto' }}></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="societies-page">
        <div className="container">
          {/* Back Navigation */}
          <div className="back-navigation">
            <button 
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
              Back
            </button>
          </div>

          {/* Page Header */}
          <div className="section-title">
            <h2>{areaInfo.subAreaName} Societies</h2>
            <p>{areaInfo.subAreaDescription}</p>
            <div className="breadcrumb">
              <span>{areaInfo.areaName}</span>
              <i className="fas fa-chevron-right"></i>
              <span>{areaInfo.subAreaName}</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Societies Grid */}
          {societies.length > 0 ? (
            <div className="societies-grid">
              {societies.map((society, index) => (
                <div
                  key={society.id}
                  className="society-card"
                  onClick={(event) => handleSocietyClick(society, event)}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="society-image">
                    <img 
                      src={getSocietyImage(society)}
                      alt={`${society.name} Map`}
                      onError={(e) => {
                        e.target.src = '/assets/map.webp';
                      }}
                    />
                  </div>
                  
                  <div className="society-content">
                    <h3>{society.name}</h3>
                    <p className="society-description">{society.description}</p>
                    
                    {/* Amenities */}
                    {society.amenities && society.amenities.length > 0 && (
                      <div className="amenities-preview">
                        <div className="amenities-list">
                          {society.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="amenity-tag">
                              <i className="fas fa-check"></i>
                              {amenity}
                            </span>
                          ))}
                          {society.amenities.length > 3 && (
                            <span className="amenity-tag more">
                              +{society.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Contact Info */}
                    {society.contact && (
                      <div className="contact-preview">
                        {society.contact.phone && (
                          <span className="contact-item">
                            <i className="fas fa-phone"></i>
                            {society.contact.phone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-societies">
              <div className="no-societies-content">
                <i className="fas fa-building"></i>
                <h3>No Societies Available</h3>
                <p>
                  We're currently updating our listings for this area. 
                  Please check back soon or contact us for the latest available societies.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Society Modal */}
        <SocietyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          society={selectedSociety}
          cardPosition={cardPosition}
        />
      </div>
    </PageTransition>
  );
};

// 🆕 Society Modal Component (similar to existing Modal but for societies)
const SocietyModal = ({ isOpen, onClose, society, cardPosition }) => {
  const wasModalOpen = React.useRef(false);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      wasModalOpen.current = true;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else if (wasModalOpen.current) {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      
      if (cardPosition && cardPosition.y !== undefined) {
        setTimeout(() => {
          window.scrollTo({
            top: cardPosition.y,
            left: 0,
            behavior: 'smooth'
          });
        }, 100);
      }
      
      wasModalOpen.current = false;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose, cardPosition]);

  if (!isOpen || !society) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getMapImage = () => {
    if (society.mapImage) {
      return `http://localhost:5000${society.mapImage}`;
    }
    return '/assets/map.webp';
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-left">
          <div className="modal-map">
            <img 
              src={getMapImage()}
              alt={`${society.name} map`}
              style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = '/assets/map.webp';
              }}
            />
          </div>
        </div>

        <div className="modal-right">
          <h2>{society.name}</h2>
          <p className="modal-description">{society.description}</p>
          
          {/* Amenities */}
          {society.amenities && society.amenities.length > 0 && (
            <div className="modal-amenities">
              <h4>Amenities</h4>
              <div className="amenities-grid">
                {society.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <i className="fas fa-check"></i>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Contact Information */}
          {society.contact && (
            <div className="modal-contact">
              <h4>Contact Information</h4>
              <div className="contact-info">
                {society.contact.phone && (
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>{society.contact.phone}</span>
                  </div>
                )}
                {society.contact.email && (
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{society.contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="modal-button">
            <button 
              className="btn btn-secondary modal-map-btn" 
              onClick={() => {
                const mapUrl = society.mapImage 
                  ? `http://localhost:5000${society.mapImage}`
                  : '/assets/map.webp';
                window.open(mapUrl, '_blank');
              }}
            >
              Open Map in New Tab
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                window.location.href = '/contact';
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Societies;