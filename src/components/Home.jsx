import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slides, features, areas } from '../data/data';
import Modal from './Modal';
import ImageSlider from './ImageSlider';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubArea, setSelectedSubArea] = useState(null);
  const [cardPosition, setCardPosition] = useState(null);
  const navigate = useNavigate();

  // Slideshow auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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

  return (
    <div className="home">
      {/* Hero Section with Video */}
      <section className="hero">
      <div className="hero-video-overlay"></div>
        {/* Replace slideshow with video */}
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
          <h1>Premium Real Estate Solutions</h1>
          <p>Discover your dream property with Shiva Associates - Your trusted partner in real estate excellence</p>
          <div className="cta-buttons">
            <button onClick={scrollToAreas} className="btn btn-primary">
              Explore Areas
            </button>
            <button onClick={() => navigate('/contact')} className="btn btn-secondary">
              Get In Touch
            </button>
          </div>
        </div>
        {/* Remove slide indicators if not needed */}
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us scroll-reveal">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Shiva Associates?</h2>
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

      {/* Areas Section */}
      <section id="areas" className="areas-section scroll-reveal">
        <div className="container">
          <div className="section-title">
            <h2>Areas Under Us</h2>
            <p>Explore our premium service areas with comprehensive property solutions</p>
          </div>
          <div className="main-areas-container">
            {Object.entries(areas).map(([key, area], index) => (
              <div key={key} className={`main-area-card scroll-reveal stagger-${index + 1}`}>
                <div className="main-area-header">
                  <h3>{area.name}</h3>
                  <p>{area.description}</p>
                </div>
                <div className="sub-areas-grid">
                  {area.subAreas.map((subArea) => (
                    <div
                      key={subArea.id}
                      className="sub-area-card"
                      onClick={(event) => handleSubAreaClick(key, subArea, event)}
                    >
                      <div className="sub-area-image">
                      <img src="/assets/map.webp" alt="Map View" />
                      </div>
                      <div className="sub-area-content">
                        <h4>{subArea.title}</h4>
                        <p>{subArea.description}</p>
                      </div>
                    </div>
                  ))}
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