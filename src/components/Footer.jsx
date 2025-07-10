import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToAreas = () => {
    if (window.location.pathname === '/') {
      const areasSection = document.getElementById('areas');
      if (areasSection) {
        areasSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const areasSection = document.getElementById('areas');
        if (areasSection) {
          areasSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleAreaClick = (area) => {
    navigate(`/listings/${area}`);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Pawan Buildhome</h3>
            <p>
              Your trusted partner in real estate excellence. We provide premium 
              property solutions across key locations in NCR.
            </p>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <i className="fas fa-envelope"></i>
                <span>pawan127jitendra@gmail.com</span>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-phone"></i>
                <span>+91-9811186086</span>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-phone"></i>
                <span>+91-9811186083</span>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>S-1 Skytech Matrott Market, Sector-76, Noida (U.P) 201307</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <a href="#areas" onClick={(e) => { e.preventDefault(); scrollToAreas(); }}>
              Our Areas
            </a>
            <a href="#" onClick={() => handleAreaClick('central-noida')}>
              Property Listings
            </a>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-section">
            <h3>Our Areas</h3>
            <a href="#" onClick={() => handleAreaClick('central-noida')}>
              Central Noida
            </a>
            <a href="#" onClick={() => handleAreaClick('noida-expressway')}>
              Noida Expressway
            </a>
            <a href="#" onClick={() => handleAreaClick('yamuna-expressway')}>
              Yamuna Expressway
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Pawan Buildhome. All rights reserved.</p>
          <div className="footer-social">
            <span>Follow us:</span>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/pawan.buildhome?igsh=MXNib2M3NmdlcDdlZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;