import React, { useState, useEffect } from 'react';

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-overlay active">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className={`page-transition ${isVisible ? 'active' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition;