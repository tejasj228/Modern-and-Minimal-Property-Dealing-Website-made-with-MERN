import React, { useState, useEffect } from "react";
import { fetchSliderImages } from "../services/api";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback images if API fails
  const fallbackImages = [
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1296&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  useEffect(() => {
    loadSliderImages();
  }, []);

  // 🆕 FIXED: Helper function to get correct image URL
  const getImageUrl = (item) => {
    // If imageUrl is already a full URL (Cloudinary), return as-is
    if (item.imageUrl && item.imageUrl.startsWith('http')) {
      return item.imageUrl;
    }
    // If it's a relative path, add localhost (for old local uploads)
    return `http://localhost:5000${item.imageUrl}`;
  };

  const loadSliderImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🖼️ Loading slider images from API...');
      
      // Try to fetch from API
      const response = await fetchSliderImages();
      
      console.log('🖼️ API Response:', response);
      
      if (response && response.length > 0) {
        // Convert API response to image URLs
        const imageUrls = response.map((item, index) => {
          const url = getImageUrl(item);
          console.log(`🖼️ Image ${index + 1}:`, {
            title: item.title,
            original: item.imageUrl,
            computed: url
          });
          return url;
        });
        
        setImages(imageUrls);
        console.log('✅ Loaded slider images from API:', imageUrls.length);
      } else {
        // Use fallback images
        setImages(fallbackImages);
        console.log('⚠️ No slider images from API, using fallback images');
      }
    } catch (error) {
      console.error('❌ Error loading slider images:', error);
      setError('Failed to load slider images');
      // Use fallback images on error
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  // Create multiple copies of images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];

  if (loading) {
    return (
      <div className="scrolling-slider">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '18px'
        }}>
          Loading slider images...
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Slider error:', error, '- Using fallback images');
  }

  return (
    <div className="scrolling-slider">
      <div className="scrolling-track">
        {duplicatedImages.map((image, index) => (
          <div key={index} className="scrolling-item">
            <img 
              src={image} 
              alt={`Property ${index % images.length + 1}`}
              onError={(e) => {
                // If image fails to load, replace with a fallback
                console.warn('❌ Image failed to load:', image);
                const fallbackIndex = index % fallbackImages.length;
                if (e.target.src !== fallbackImages[fallbackIndex]) {
                  e.target.src = fallbackImages[fallbackIndex];
                }
              }}
              onLoad={() => {
                console.log('✅ Image loaded successfully:', image);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;