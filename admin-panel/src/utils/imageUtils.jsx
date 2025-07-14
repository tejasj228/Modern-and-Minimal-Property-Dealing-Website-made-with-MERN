// admin-panel/src/utils/imageUtils.js
/**
 * Utility functions for handling image URLs consistently across the admin panel
 */

// Get the correct backend URL from environment variables
const getBackendUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

/**
 * Convert any image URL to the correct format
 * @param {string} imageUrl - The image URL (can be relative path or full URL)
 * @returns {string} - The correct full URL
 */
export const getImageUrl = (imageUrl) => {
  // Return empty string or placeholder if no URL provided
  if (!imageUrl) {
    return '';
  }

  // If it's already a full URL (Cloudinary, external CDN, etc.), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative path, construct the full URL
  if (imageUrl.startsWith('/')) {
    return `${getBackendUrl()}${imageUrl}`;
  }

  // If it doesn't start with '/', add it
  return `${getBackendUrl()}/${imageUrl}`;
};

/**
 * Get a placeholder image URL
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = () => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Ctext x="150" y="100" font-family="Arial, sans-serif" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
};

/**
 * Handle image loading errors
 * @param {Event} event - The error event
 * @param {string} originalUrl - The original image URL for debugging
 */
export const handleImageError = (event, originalUrl = '') => {
  console.error('❌ Image failed to load:', originalUrl);
  
  // Set placeholder image
  event.target.src = getPlaceholderImage();
  
  // Add error styling
  event.target.style.backgroundColor = '#f5f5f5';
  event.target.style.border = '1px solid #ddd';
};

/**
 * Preload an image and return a promise
 * @param {string} imageUrl - The image URL to preload
 * @returns {Promise} - Promise that resolves when image loads
 */
export const preloadImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = getImageUrl(imageUrl);
  });
};

/**
 * Check if an image URL is valid by trying to load it
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} - Promise that resolves to true if valid
 */
export const validateImageUrl = async (imageUrl) => {
  try {
    await preloadImage(imageUrl);
    return true;
  } catch (error) {
    console.warn('Invalid image URL:', imageUrl);
    return false;
  }
};