import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, subArea, onViewProperties }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      // Hide navbar completely when modal is open
      const navbar = document.querySelector('.nav-container');
      if (navbar) {
        navbar.style.display = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      
      // Show navbar when modal is closed
      const navbar = document.querySelector('.nav-container');
      if (navbar) {
        navbar.style.display = 'block';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      
      // Ensure navbar is shown when component unmounts
      const navbar = document.querySelector('.nav-container');
      if (navbar) {
        navbar.style.display = 'block';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !subArea) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewProperties = () => {
    onViewProperties(subArea.areaKey);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)'
      }}
    >
      <div className="modal-content" style={{ zIndex: 2147483647 }}>
        <button 
          className="modal-close" 
          onClick={onClose}
          style={{ zIndex: 2147483647 }}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-left">
          <div className="modal-map">
            <img src="/assets/map.webp" alt="Area Map" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
            <button className="btn btn-primary" onClick={handleViewProperties}>
              View Properties in {subArea.parentArea.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;