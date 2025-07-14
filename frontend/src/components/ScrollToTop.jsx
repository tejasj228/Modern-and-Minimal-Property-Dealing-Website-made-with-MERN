import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check scroll position
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check if modal is open
    const checkModalState = () => {
      const modalOpen = document.body.classList.contains('modal-open');
      setIsModalOpen(modalOpen);
    };

    // Add scroll listener
    window.addEventListener('scroll', toggleVisibility);
    
    // Check modal state periodically
    const modalChecker = setInterval(checkModalState, 100);

    // Initial checks
    toggleVisibility();
    checkModalState();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      clearInterval(modalChecker);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible && !isModalOpen ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="fas fa-chevron-up"></i>
    </button>
  );
};

export default ScrollToTop;