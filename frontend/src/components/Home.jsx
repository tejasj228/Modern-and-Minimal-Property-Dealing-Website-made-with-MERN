import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { features } from '../data/data'; // Keep features as static for now
<<<<<<< HEAD
import { fetchAreas, checkBackendHealth } from '../services/api';
=======
import { fetchAreas, checkBackendHealth, getImageUrl } from '../services/api'; // 🆕 Import from api.js
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
import Modal from './Modal';
import ImageSlider from './ImageSlider';
import './Home.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubArea, setSelectedSubArea] = useState(null);
  const [cardPosition, setCardPosition] = useState(null);
  const [areas, setAreas] = useState({});
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const navigate = useNavigate();

  // Load areas from API
  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      
      // Check if backend is connected
      try {
        await checkBackendHealth();
        setBackendConnected(true);
        console.log('✅ Backend connected successfully');
      } catch (error) {
        setBackendConnected(false);
        console.warn('⚠️ Backend not connected, using fallback data');
      }

      // Fetch areas from API
      const areasData = await fetchAreas();
      
      if (Object.keys(areasData).length > 0) {
        setAreas(areasData);
        console.log('📊 Loaded areas from API:', Object.keys(areasData).length);
      } else {
        // Fallback to static data if API fails
        const { areas: fallbackAreas } = await import('../data/data');
        setAreas(fallbackAreas);
        console.log('📊 Using fallback areas data');
      }
    } catch (error) {
      console.error('Error loading areas:', error);
      // Load fallback data
      try {
        const { areas: fallbackAreas } = await import('../data/data');
        setAreas(fallbackAreas);
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Scroll reveal animation
  useEffect(() => {
    const revealElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', revealElements);
    revealElements(); // Initial check

    return () => window.removeEventListener('scroll', revealElements);
  }, []);

  const handleSubAreaClick = (areaKey, subArea, event) => {
    console.log('🎯 Card clicked - capturing position');
    
    // Get the clicked card element
    const cardElement = event.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate the absolute position of the card
    const cardAbsolutePosition = {
      y: rect.top + scrollTop - 100, // Offset a bit above the card for better view
      x: rect.left,
      element: cardElement
    };
    
    console.log('📍 Card position captured:', cardAbsolutePosition);
    setCardPosition(cardAbsolutePosition);
    
    const areaData = areas[areaKey];
    const subAreaData = {
      ...subArea,
      parentArea: areaData,
      areaKey: areaKey
    };
    
    // Set both states immediately to avoid delays
    setSelectedSubArea(subAreaData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('🔒 Closing modal - position will be restored');
    setIsModalOpen(false);
    // Clear selected subarea after modal closes
    setTimeout(() => {
      setSelectedSubArea(null);
      // Clear card position after a delay to ensure modal is fully closed
      setTimeout(() => {
        setCardPosition(null);
      }, 1000);
    }, 300);
  };

  const handleViewListings = (areaKey) => {
    navigate(`/properties?area=${areaKey}`);
  };

  const scrollToAreas = () => {
    document.getElementById('areas').scrollIntoView({ behavior: 'smooth' });
  };

<<<<<<< HEAD
  // Function to get the correct image for sub-area cards
  const getSubAreaImage = (subArea) => {
    if (subArea.mapImage) {
      console.log('🗺️ Using uploaded map for card:', subArea.mapImage);
      return `http://localhost:5000${subArea.mapImage}`;
=======
  // 🆕 FIXED: Function to get the correct image for sub-area cards
  const getSubAreaImage = (subArea) => {
    if (subArea.mapImage) {
      console.log('🗺️ Using uploaded map for card:', subArea.mapImage);
      return getImageUrl(subArea.mapImage); // Use helper function from api.js
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
    } else {
      console.log('🗺️ Using default map for card');
      return '/assets/map.webp';
    }
  };

  if (loading) {
    return (
      <div className="home">
        <section className="hero">
          <div className="hero-video-overlay"></div>
          <video
            className="hero-video"
            src="/assets/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
            }}
          />
          <div className="hero-content">
            <h1>
              Premium <span className="highlight-accent">Real Estate</span> Solutions
            </h1>
            <p>Loading your premium property experience...</p>
            <div className="cta-buttons">
              <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home">
<<<<<<< HEAD
      {/* Backend Status Indicator (only in development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          background: backendConnected ? '#4caf50' : '#ff9800',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {backendConnected ? '✅ API Connected' : '⚠️ Using Static Data'}
        </div>
      )} */}

=======
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
      {/* Hero Section with Video */}
      <section className="hero">
        <div className="hero-video-overlay"></div>
        <video
          className="hero-video"
          src="/assets/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
        <div className="hero-content">
          <h1>
            Premium <span className="highlight-accent">Real Estate</span> Solutions
          </h1>
          <p>Discover your dream property with Pawan Buildhome - Your trusted partner in real estate excellence</p>
          <div className="cta-buttons">
            <button onClick={scrollToAreas} className="btn btn-primary">
              Explore Areas
            </button>
            <button onClick={() => navigate('/contact')} className="btn btn-secondary">
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us scroll-reveal">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Pawan Buildhome?</h2>
            <p>Experience excellence in real estate with our premium services and expertise</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={feature.id} className={`feature-card scroll-reveal stagger-${index + 1}`}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="slider-section scroll-reveal">
        <div className="container">
          <ImageSlider />
        </div>
      </section>

      {/* Areas Section - Now powered by API with Dynamic Maps */}
      <section id="areas" className="areas-section scroll-reveal">
        <div className="container">
          <div className="section-title">
            <h2>Areas Under Us</h2>
            <p>Explore our premium service areas with comprehensive property solutions</p>
<<<<<<< HEAD
            {backendConnected && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              </p>
            )}
=======
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
          </div>
          <div className="main-areas-container">
            {Object.entries(areas).map(([key, area], index) => (
              <div key={key} className={`main-area-card scroll-reveal stagger-${index + 1}`}>
                <div className="main-area-header">
                  <h3>{area.name}</h3>
                  <p>{area.description}</p>
                </div>
                <div className="sub-areas-grid">
                  {area.subAreas?.map((subArea) => (
                    <div
                      key={subArea.id}
                      className="sub-area-card"
                      onClick={(event) => handleSubAreaClick(key, subArea, event)}
                    >
                      <div className="sub-area-image">
                        <img 
                          src={getSubAreaImage(subArea)}
                          alt={`${subArea.title} Map`}
                          onLoad={() => {
                            console.log('✅ Sub-area card image loaded:', subArea.title);
                          }}
                          onError={(e) => {
                            console.error('❌ Sub-area card image failed:', subArea.title);
                            // Fallback to default map if uploaded map fails
                            if (subArea.mapImage && e.target.src !== '/assets/map.webp') {
                              console.log('🔄 Falling back to default map for card');
                              e.target.src = '/assets/map.webp';
                            }
                          }}
                        />
                      </div>
                      <div className="sub-area-content">
                        <h4>{subArea.title}</h4>
                        <p>{subArea.description}</p>
                      </div>
                    </div>
                  )) || (
                    <div style={{ 
                      padding: '20px', 
                      textAlign: 'center', 
                      color: '#666',
                      background: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      <p>No sub-areas configured yet</p>
                    </div>
                  )}
                </div>
                <div className="main-area-footer">
                  <button
                    className="view-all-properties-btn"
                    onClick={() => handleViewListings(key)}
                  >
                    View All {area.name} Properties
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subArea={selectedSubArea}
        cardPosition={cardPosition}
        onViewProperties={(areaKey) => {
          handleCloseModal();
          handleViewListings(areaKey);
        }}
      />
    </div>
  );
};

export default Home;