import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Frontend API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
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
    console.log('📊 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Frontend API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend server is not running on localhost:5000');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - check if backend is running');
    } else if (error.response?.status === 404) {
      console.error('🔍 API endpoint not found');
    }
    
    return Promise.reject(error);
  }
);

// Fetch all areas
export const fetchAreas = async () => {
  try {
    console.log('🏢 Fetching areas from backend...');
    const response = await api.get('/areas');
    console.log('🏢 Areas fetched successfully:', response.data.data);
    return response.data.data || {}; // Returns the areas object
  } catch (error) {
    console.error('❌ Error fetching areas:', error);
    console.warn('⚠️ Falling back to empty areas object');
    // Return fallback data if API fails
    return {};
  }
};

// Fetch all properties
export const fetchProperties = async (areaKey = '') => {
  try {
    const url = areaKey ? `/properties/area/${areaKey}` : '/properties';
    console.log(`🏠 Fetching properties from: ${url}`);
    const response = await api.get(url);
    console.log('🏠 Properties fetched successfully:', response.data);
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
    console.log(`🏠 Properties for ${areaKey} fetched successfully:`, response.data);
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
    console.log('🖼️ Slider images fetched successfully:', response.data);
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
    console.log('✅ Backend health check passed:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    throw new Error('Backend server is not responding');
  }
};

export default api;