// frontend/src/services/api.js - Fixed API URLs
import axios from 'axios';

// 🆕 FIXED API URL - Use the correct backend URL from env file
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🌐 Frontend API Base URL:', API_BASE_URL);
console.log('🌐 Environment:', process.env.NODE_ENV);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 🆕 ADDED CORS SUPPORT
  withCredentials: false // Set to false for CORS
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Frontend API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📊 Request config:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      timeout: config.timeout
    });
    return config;
  },
  (error) => {
    console.error('❌ Frontend API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Frontend API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Frontend API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL
    });
    
    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend server is not running or unreachable');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - check backend connection and CORS');
    } else if (error.response?.status === 404) {
      console.error('🔍 API endpoint not found');
    } else if (error.response?.status === 500) {
      console.error('💥 Internal server error');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Request timeout - server took too long to respond');
    }
    
    return Promise.reject(error);
  }
);

// 🆕 DEDICATED CONTACT FORM SUBMISSION FUNCTION
export const submitContactForm = async (formData) => {
  try {
    console.log('📧 Submitting contact form with data:', formData);
    
    const response = await api.post('/contacts', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      interest: formData.interest?.trim() || '',
      message: formData.message.trim()
    });
    
    console.log('✅ Contact form submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Contact form submission failed:', error);
    throw error;
  }
};

// Fetch all areas
export const fetchAreas = async () => {
  try {
    console.log('🏢 Fetching areas from backend...');
    const response = await api.get('/areas');
    console.log('🏢 Areas fetched successfully');
    return response.data.data || {}; // Returns the areas object
  } catch (error) {
    console.error('❌ Error fetching areas:', error);
    console.warn('⚠️ Falling back to empty areas object');
    return {};
  }
};

// Fetch all properties
export const fetchProperties = async (areaKey = '') => {
  try {
    const url = areaKey ? `/properties/area/${areaKey}` : '/properties';
    console.log(`🏠 Fetching properties from: ${url}`);
    const response = await api.get(url);
    console.log('🏠 Properties fetched successfully');
    return response.data.data || []; // Returns the properties array
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    console.warn('⚠️ Falling back to empty properties array');
    return [];
  }
};

// Fetch properties by area
export const fetchPropertiesByArea = async (areaKey) => {
  try {
    console.log(`🏠 Fetching properties for area: ${areaKey}`);
    const response = await api.get(`/properties/area/${areaKey}`);
    console.log(`🏠 Properties for ${areaKey} fetched successfully`);
    return response.data.data || [];
  } catch (error) {
    console.error(`❌ Error fetching properties for area ${areaKey}:`, error);
    console.warn('⚠️ Falling back to empty properties array');
    return [];
  }
};

// Fetch slider images
export const fetchSliderImages = async () => {
  try {
    console.log('🖼️ Fetching slider images from backend...');
    const response = await api.get('/uploads/slider');
    console.log('🖼️ Slider images fetched successfully');
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error fetching slider images:', error);
    console.warn('⚠️ Falling back to default images');
    // Return fallback images if API fails
    return [
      {
        title: 'Modern House',
        imageUrl: 'https://images.unsplash.com/photo-1592394675778-4239b838fb2c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        altText: 'Modern House'
      },
      {
        title: 'Luxury Villa',
        imageUrl: 'https://images.unsplash.com/photo-1673447620374-05f8b4842b41?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        altText: 'Luxury Villa'
      }
    ];
  }
};

// Health check
export const checkBackendHealth = async () => {
  try {
    console.log('🔍 Checking backend health...');
    const response = await api.get('/health');
    console.log('✅ Backend health check passed');
    return response.data;
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    throw new Error('Backend server is not responding');
  }
};

export default api;