<<<<<<< HEAD
// frontend/src/components/Modal.jsx - Updated with "View Areas" button
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
=======
// frontend/src/components/Modal.jsx - Fixed with api.js helper
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api'; // 🆕 Import from api.js
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
import './Modal.css';

const Modal = ({ isOpen, onClose, subArea, onViewProperties, cardPosition }) => {
  const wasModalOpen = useRef(false);
  const navigate = useNavigate();

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

<<<<<<< HEAD
  // 🆕 NEW: Handle "View Areas" button click
=======
  // 🆕 Handle "View Areas" button click
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
  const handleViewAreas = () => {
    console.log('🏘️ Navigating to societies page for:', subArea);
    onClose(); // Close modal first
    // Navigate to societies page with areaKey and subAreaId
    navigate(`/societies/${subArea.areaKey}/${subArea.id}`);
  };

<<<<<<< HEAD
  // Determine which map image to show
=======
  // 🆕 FIXED: Determine which map image to show using helper function from api.js
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
  const getMapImage = () => {
    // Priority: 1. Sub-area's uploaded map, 2. Default map
    if (subArea.mapImage) {
      console.log('🗺️ Using uploaded map:', subArea.mapImage);
<<<<<<< HEAD
      return `http://localhost:5000${subArea.mapImage}`;
=======
      return getImageUrl(subArea.mapImage); // Use helper function from api.js
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
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
<<<<<<< HEAD
                console.log('✅ Map image loaded successfully:', mapImageSrc);
              }}
              onError={(e) => {
                console.error('❌ Map image failed to load:', mapImageSrc);
                // Fallback to default map if uploaded map fails
                if (subArea.mapImage && e.target.src !== '/assets/map.webp') {
                  console.log('🔄 Falling back to default map');
=======
                console.log('✅ Modal map image loaded successfully:', mapImageSrc);
              }}
              onError={(e) => {
                console.error('❌ Modal map image failed to load:', mapImageSrc);
                // Fallback to default map if uploaded map fails
                if (subArea.mapImage && e.target.src !== '/assets/map.webp') {
                  console.log('🔄 Modal falling back to default map');
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
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
<<<<<<< HEAD
                  ? `http://localhost:5000${subArea.mapImage}`
=======
                  ? getImageUrl(subArea.mapImage) // Use helper function from api.js
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
                  : '/assets/map.webp';
                window.open(mapUrl, '_blank');
              }}
            >
              Open Map in New Tab
            </button>
<<<<<<< HEAD
            {/* 🆕 UPDATED: Changed from "View Listings" to "View Areas" */}
=======
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
            <button className="btn btn-primary" onClick={handleViewAreas}>
              View Areas Under {subArea.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;