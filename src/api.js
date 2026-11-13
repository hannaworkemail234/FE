// API service to handle all HTTP requests
const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
).replace(/\/+$/, '');

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    return { success: response.ok, status: response.status, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User API calls
export const userAPI = {
  getAll: () => apiCall('GET', '/users'),
  getById: (id) => apiCall('GET', `/users/${id}`),
  create: (user) => apiCall('POST', '/users', user),
  update: (id, user) => apiCall('PUT', `/users/${id}`, user),
  delete: (id) => apiCall('DELETE', `/users/${id}`),
};

// Product API calls
export const productAPI = {
  getAll: () => apiCall('GET', '/products'),
  getById: (id) => apiCall('GET', `/products/${id}`),
  create: (product) => apiCall('POST', '/products', product),
  update: (id, product) => apiCall('PUT', `/products/${id}`, product),
  delete: (id) => apiCall('DELETE', `/products/${id}`),
};
