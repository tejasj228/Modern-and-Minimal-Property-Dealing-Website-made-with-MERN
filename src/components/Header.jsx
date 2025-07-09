import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add actual search functionality here
    }
  };

  const handlePropertiesClick = () => {
    navigate('/properties');
    setIsMenuOpen(false);
  };

  const handleAreaClick = (area) => {
    navigate(`/properties?area=${area}`);
    setIsMenuOpen(false);
  };

  const handleNavClick = (path) => {
    if (path) navigate(path);
    setIsMenuOpen(false);
  };

  // Get current page for highlighting
  const getCurrentPage = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/contact') return 'contact';
    if (location.pathname === '/properties' || location.pathname.startsWith('/listings')) return 'properties';
    return '';
  };

  const currentPage = getCurrentPage();

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="mobile-header">
          <button className="mobile-hamburger" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/" className="mobile-logo">
            Shiva Associates
          </Link>
          <button 
            className="mobile-theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-sidebar-header">
            <h3>Shiva Associates</h3>
            <button className="sidebar-close" onClick={toggleMenu}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="mobile-sidebar-content">
            <div className="mobile-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>

            <nav className="mobile-nav">
              <Link 
                to="/" 
                onClick={() => handleNavClick()}
                className={currentPage === 'home' ? 'active' : ''}
              >
                <i className="fas fa-home"></i>
                Home
              </Link>
              
              <div className="mobile-nav-section">
                <button 
                  onClick={handlePropertiesClick}
                  className={currentPage === 'properties' ? 'active' : ''}
                >
                  <i className="fas fa-building"></i>
                  Properties
                </button>
                <div className="mobile-subnav">
                  <button onClick={() => handleAreaClick('central-noida')}>
                    Central Noida
                  </button>
                  <button onClick={() => handleAreaClick('noida-expressway')}>
                    Noida Expressway
                  </button>
                  <button onClick={() => handleAreaClick('yamuna-expressway')}>
                    Yamuna Expressway
                  </button>
                </div>
              </div>

              <Link 
                to="/contact" 
                onClick={() => handleNavClick()}
                className={currentPage === 'contact' ? 'active' : ''}
              >
                <i className="fas fa-envelope"></i>
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMenuOpen && <div className="mobile-overlay" onClick={toggleMenu}></div>}
      </>
    );
  }

  // Desktop Navigation
  return (
    <div className="nav-container">
      <nav className="navbar">
        <Link to="/" className="logo">
          Shiva Associates
        </Link>

        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={currentPage === 'home' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handlePropertiesClick(); }}
              className={currentPage === 'properties' ? 'active' : ''}
            >
              Properties
            </a>
            <div className="dropdown">
              <a href="#" onClick={() => handleAreaClick('central-noida')}>
                Central Noida Properties
              </a>
              <a href="#" onClick={() => handleAreaClick('noida-expressway')}>
                Expressway Properties
              </a>
              <a href="#" onClick={() => handleAreaClick('yamuna-expressway')}>
                Yamuna Expressway Properties
              </a>
            </div>
          </li>
          <li>
            <Link 
              to="/contact"
              className={currentPage === 'contact' ? 'active' : ''}
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="search-container">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-box"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Header;