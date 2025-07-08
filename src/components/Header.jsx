import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search functionality here
      console.log('Searching for:', searchQuery);
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

  return (
    <div className="nav-container">
      <nav className="navbar">
        <Link to="/" className="logo">
          Shiva Associates
        </Link>

        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <a href="#" onClick={(e) => { e.preventDefault(); handlePropertiesClick(); }}>
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
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
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

        <div className="mobile-menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      </nav>
    </div>
  );
};

export default Header;