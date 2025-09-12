import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.error('Server error - check backend logs');
    } else if (error.response?.status === 404) {
      console.error('API endpoint not found');
    } else if (!error.response) {
      console.error('Network error - check if backend is running');
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const translationAPI = {
  // Translate text
  translate: async (text) => {
    const response = await api.post('/translate', { text });
    return response.data;
  },

  // Get translation using GET method (alternative)
  translateGet: async (text) => {
    const response = await api.get(`/translate?text=${encodeURIComponent(text)}`);
    return response.data;
  },

  // Get all terms
  getAllTerms: async () => {
    const response = await api.get('/terms');
    return response.data;
  },

  // Get popular terms
  getPopularTerms: async () => {
    const response = await api.get('/terms/popular');
    return response.data;
  },

  // Search terms
  searchTerms: async (query) => {
    const response = await api.get(`/terms/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Add new term (admin feature)
  addTerm: async (term) => {
    const response = await api.post('/terms', term);
    return response.data;
  },

  // Get translation history
  getHistory: async (limit = 10) => {
    const response = await api.get(`/history?limit=${limit}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;