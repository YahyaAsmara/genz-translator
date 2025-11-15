import axios from 'axios';

const resolveApiBase = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api`;
  }

  return 'http://localhost:8080/api';
};

const API_BASE = resolveApiBase();

let accessToken = null;
let refreshToken = null;

export const setAuthTokens = ({ accessToken: incomingAccess, refreshToken: incomingRefresh }) => {
  accessToken = incomingAccess || accessToken;
  refreshToken = incomingRefresh || refreshToken;
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
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
    } else if (error.response?.status === 401) {
      console.warn('Unauthorized - tokens may be stale.');
    }

    return Promise.reject(error);
  }
);

// API functions
export const translationAPI = {
  translate: async (text) => {
    const response = await api.post('/translate', { text });
    return response.data;
  },
  translateGet: async (text) => {
    const response = await api.get(`/translate?text=${encodeURIComponent(text)}`);
    return response.data;
  },
  getAllTerms: async () => {
    const response = await api.get('/terms');
    return response.data;
  },
  getPopularTerms: async () => {
    const response = await api.get('/terms/popular');
    return response.data;
  },
  searchTerms: async (query) => {
    const response = await api.get(`/terms/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
  addTerm: async (term) => {
    const response = await api.post('/terms', term);
    return response.data;
  },
  getHistory: async (limit = 10) => {
    const response = await api.get(`/history?limit=${limit}`);
    return response.data;
  },
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export const authAPI = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },
  refresh: async () => {
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

export const profileAPI = {
  me: async () => {
    const response = await api.get('/profiles/me');
    return response.data;
  },
  update: async (payload) => {
    const response = await api.put('/profiles/me', payload);
    return response.data;
  }
};

export const communityAPI = {
  getVibes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.persona) params.append('persona', filters.persona);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.visibility) params.append('visibility', filters.visibility);
    const query = params.toString();
    const response = await api.get(`/community/vibes${query ? `?${query}` : ''}`);
    return response.data;
  },
  shareVibe: async (payload) => {
    const response = await api.post('/community/vibes', payload);
    return response.data;
  },
  reactToVibe: async (vibeId, pulseType) => {
    const response = await api.post(`/community/vibes/${vibeId}/react`, { pulseType });
    return response.data;
  },
  remixVibe: async (vibeId, remixText) => {
    const response = await api.post(`/community/vibes/${vibeId}/remix`, { remixText });
    return response.data;
  },
  getRemixes: async (vibeId) => {
    const response = await api.get(`/community/vibes/${vibeId}/remixes`);
    return response.data;
  }
};

export default api;