import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fetch all areas
export const fetchAreas = async () => {
  try {
    const response = await api.get('/areas');
    return response.data.data; // Returns the areas object
  } catch (error) {
    console.error('Error fetching areas:', error);
    // Return fallback data if API fails
    return {};
  }
};

// Fetch all properties
export const fetchProperties = async (areaKey = '') => {
  try {
    const url = areaKey ? `/properties/area/${areaKey}` : '/properties';
    const response = await api.get(url);
    return response.data.data; // Returns the properties array
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

// Fetch properties by area
export const fetchPropertiesByArea = async (areaKey) => {
  try {
    const response = await api.get(`/properties/area/${areaKey}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching properties by area:', error);
    return [];
  }
};

// Fetch slider images
export const fetchSliderImages = async () => {
  try {
    const response = await api.get('/uploads/slider');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching slider images:', error);
    // Return fallback images if API fails
    return [
      {
        title: 'Modern House',
        imageUrl: 'https://images.unsplash.com/photo-1592394675778-4239b838fb2c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        altText: 'Modern House'
      }
    ];
  }
};

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api;