import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, subArea, onViewProperties, cardPosition }) => {
  const wasModalOpen = useRef(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      console.log('📂 Modal opening, card position:', cardPosition);
      console.log('📂 Sub-area data:', subArea);
      wasModalOpen.current = true;
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      // Hide desktop navbar
      const navbar = document.querySelector('.nav-container');
      if (navbar) navbar.style.display = 'none';
      
      // Hide mobile header and sidebar
      const mobileHeader = document.querySelector('.mobile-header');
      if (mobileHeader) mobileHeader.style.display = 'none';
      
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      if (mobileSidebar) mobileSidebar.style.display = 'none';
      
    } else if (wasModalOpen.current) {
      console.log('📂 Modal closing, restoring position to:', cardPosition);
      
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      
      // Show desktop navbar
      const navbar = document.querySelector('.nav-container');
      if (navbar) navbar.style.display = 'block';
      
      // Show mobile header and sidebar
      const mobileHeader = document.querySelector('.mobile-header');
      if (mobileHeader) mobileHeader.style.display = 'flex';
      
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      if (mobileSidebar) mobileSidebar.style.display = '';
      
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
      
      // Show desktop navbar
      const navbar = document.querySelector('.nav-container');
      if (navbar) navbar.style.display = 'block';
      
      // Show mobile header and sidebar
      const mobileHeader = document.querySelector('.mobile-header');
      if (mobileHeader) mobileHeader.style.display = 'flex';
      
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      if (mobileSidebar) mobileSidebar.style.display = '';
    };
  }, [isOpen, onClose, cardPosition]);

  if (!isOpen || !subArea) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewProperties = () => {
    onViewProperties(subArea.areaKey);
  };

  // Determine which map image to show
  const getMapImage = () => {
    // Priority: 1. Sub-area's uploaded map, 2. Default map
    if (subArea.mapImage) {
      console.log('🗺️ Using uploaded map:', subArea.mapImage);
      return `http://localhost:5000${subArea.mapImage}`;
    } else {
      console.log('🗺️ Using default map');
      return '/assets/map.webp';
    }
  };

  const mapImageSrc = getMapImage();

  return (
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <button 
          className="modal-close" 
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-left">
          <div className="modal-map">
            <img 
              src={mapImageSrc}
              alt={`${subArea.title} map`} 
              style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
              onLoad={() => {
                console.log('✅ Map image loaded successfully:', mapImageSrc);
              }}
              onError={(e) => {
                console.error('❌ Map image failed to load:', mapImageSrc);
                // Fallback to default map if uploaded map fails
                if (subArea.mapImage && e.target.src !== '/assets/map.webp') {
                  console.log('🔄 Falling back to default map');
                  e.target.src = '/assets/map.webp';
                }
              }}
            />
          </div>
        </div>

        <div className="modal-right">
          <h2>{subArea.title}</h2>
          <div className="modal-description">
            <p className="modal-area-name">{subArea.parentArea.name}</p>
            <p className="modal-subarea-desc">{subArea.description}</p>
            <div className="modal-area-info">
              <h4>About {subArea.parentArea.name}</h4>
              <p>{subArea.parentArea.description}</p>
            </div>
          </div>
          <div className="modal-button">
            <button 
              className="btn btn-secondary modal-map-btn" 
              onClick={() => {
                const mapUrl = subArea.mapImage 
                  ? `http://localhost:5000${subArea.mapImage}`
                  : '/assets/map.webp';
                window.open(mapUrl, '_blank');
              }}
            >
              Open Map in New Tab
            </button>
            <button className="btn btn-primary" onClick={handleViewProperties}>
              View Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;