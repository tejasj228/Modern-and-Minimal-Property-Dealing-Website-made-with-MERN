// frontend/src/components/Societies.jsx - Fixed modal navbar hiding and mobile visibility
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import './Societies.css';

// Enhanced Society Modal Component with Navbar Hiding and Mobile Fixes
const SocietyModal = ({ isOpen, onClose, society, cardPosition }) => {
  const wasModalOpen = React.useRef(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      console.log('📂 Society modal opening - hiding navbar and preventing scroll');
      wasModalOpen.current = true;
      setCurrentImageIndex(0); // Reset to first image
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      // 🆕 HIDE ALL NAVIGATION ELEMENTS
      // Hide desktop navbar
      const navbar = document.querySelector('.nav-container');
      if (navbar) {
        navbar.style.display = 'none';
        console.log('✅ Desktop navbar hidden');
      }
      
      // Hide mobile header
      const mobileHeader = document.querySelector('.mobile-header');
      if (mobileHeader) {
        mobileHeader.style.display = 'none';
        console.log('✅ Mobile header hidden');
      }
      
      // Hide mobile sidebar
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      if (mobileSidebar) {
        mobileSidebar.style.display = 'none';
        console.log('✅ Mobile sidebar hidden');
      }
      
    } else if (wasModalOpen.current) {
      console.log('📂 Society modal closing - restoring navbar and scroll');
      
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      
      // 🆕 RESTORE ALL NAVIGATION ELEMENTS
      // Show desktop navbar
      const navbar = document.querySelector('.nav-container');
      if (navbar) {
        navbar.style.display = 'block';
        console.log('✅ Desktop navbar restored');
      }
      
      // Show mobile header
      const mobileHeader = document.querySelector('.mobile-header');
      if (mobileHeader) {
        mobileHeader.style.display = 'flex';
        console.log('✅ Mobile header restored');
      }
      
      // Show mobile sidebar
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      if (mobileSidebar) {
        mobileSidebar.style.display = '';
        console.log('✅ Mobile sidebar restored');
      }
      
      // Scroll back to the card position after a small delay
      if (cardPosition && cardPosition.y !== undefined) {
        setTimeout(() => {
          console.log('🎯 Scrolling back to card position:', cardPosition.y);
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
      
      // Ensure navbar is always restored on cleanup
      const navbar = document.querySelector('.nav-container');
      if (navbar) navbar.style.display = 'block';
      
      const mobileHeader = document.querySelector('.mobile-header');
      if (mobileHeader) mobileHeader.style.display = 'flex';
      
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      if (mobileSidebar) mobileSidebar.style.display = '';
    };
  }, [isOpen, onClose, cardPosition]);

  if (!isOpen || !society) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get all available images (gallery + map)
  const getAllImages = () => {
    const images = [];
    if (society.images && society.images.length > 0) {
      society.images.forEach(img => {
        images.push(`http://localhost:5000${img}`);
      });
    }
    if (society.mapImage) {
      images.push(`http://localhost:5000${society.mapImage}`);
    }
    if (images.length === 0) {
      images.push('/assets/map.webp');
    }
    return images;
  };

  const allImages = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="modal-overlay society-modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content society-modal">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-left">
          <div className="modal-gallery">
            <img 
              src={allImages[currentImageIndex]}
              alt={`${society.name} - Image ${currentImageIndex + 1}`}
              style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = '/assets/map.webp';
              }}
            />
            
            {/* Gallery Navigation */}
            {allImages.length > 1 && (
              <>
                <button className="gallery-nav gallery-prev" onClick={prevImage}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="gallery-nav gallery-next" onClick={nextImage}>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className="gallery-counter">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="modal-right">
          <h2>{society.name}</h2>
          <p className="modal-description">{society.description}</p>
          
          {/* Gallery Info */}
          {society.images && society.images.length > 0 && (
            <div className="modal-gallery-info">
              <h4>Photo Gallery</h4>
              <p>{society.images.length} images available</p>
            </div>
          )}
          
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
                const mapUrl = allImages[currentImageIndex];
                window.open(mapUrl, '_blank');
              }}
            >
              Open Image in New Tab
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

// Enhanced Image Slider Component for Societies
const SocietiesImageSlider = ({ societies = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Create slides array from all society images
  const slides = [];
  societies.forEach(society => {
    if (society.images && society.images.length > 0) {
      society.images.forEach(image => {
        slides.push({
          image: `http://localhost:5000${image}`,
          societyName: society.name,
          societyId: society.id
        });
      });
    } else if (society.mapImage) {
      // Fallback to map image if no gallery images
      slides.push({
        image: `http://localhost:5000${society.mapImage}`,
        societyName: society.name,
        societyId: society.id
      });
    }
  });

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <div className="societies-slider no-images">
        <div className="no-images-content">
          <i className="fas fa-images"></i>
          <h3>No Society Images Available</h3>
          <p>Images will appear here once societies are added with gallery photos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="societies-slider">
      <div className="slider-container">
        {/* Main Image */}
        <div className="slider-main">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].societyName}
            className="slider-image"
            onError={(e) => {
              e.target.src = '/assets/map.webp';
            }}
          />
          
          {/* Overlay with Society Name */}
          <div className="slider-overlay">
            <div className="slider-content">
              <h2 className="society-name">{slides[currentSlide].societyName}</h2>
              <div className="slide-counter">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button 
                className="slider-nav prev" 
                onClick={prevSlide}
                aria-label="Previous image"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="slider-nav next" 
                onClick={nextSlide}
                aria-label="Next image"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}

          {/* Play/Pause Button */}
          {slides.length > 1 && (
            <button 
              className="slider-play-pause"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
            </button>
          )}
        </div>

        {/* Thumbnails/Dots */}
        {slides.length > 1 && (
          <div className="slider-thumbnails">
            {slides.map((slide, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                aria-label={`Go to ${slide.societyName} image`}
              >
                <span className="thumbnail-label">{slide.societyName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
      // Load fallback data with sample images
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    // Enhanced fallback society data with sample images
    const fallbackSocieties = [
      {
        id: 1,
        name: 'Green Valley Apartments',
        description: 'Premium residential complex with modern amenities and excellent connectivity.',
        mapImage: null,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
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
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800'
        ],
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
    console.log('⚠️ Using fallback society data with sample images');
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
    // Priority: 1. First gallery image, 2. Map image, 3. Default
    if (society.images && society.images.length > 0) {
      return `http://localhost:5000${society.images[0]}`;
    } else if (society.mapImage) {
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
              {/* <span>{areaInfo.areaName}</span> */}
              {/* <i className="fas fa-chevron-right"></i> */}
              {/* <span>{areaInfo.subAreaName}</span> */}
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Enhanced Image Slider */}
          <SocietiesImageSlider societies={societies} />

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
                      alt={`${society.name} Image`}
                      onError={(e) => {
                        e.target.src = '/assets/map.webp';
                      }}
                    />
                    {/* Image Counter Badge */}
                    {society.images && society.images.length > 0 && (
                      <div className="image-count-badge">
                        <i className="fas fa-images"></i>
                        {society.images.length}
                      </div>
                    )}
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

        {/* Enhanced Society Modal */}
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

export default Societies;