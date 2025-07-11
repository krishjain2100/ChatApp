import { API_BASE_URL } from '../config/constants.js';


const request = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Try to parse as JSON, fall back to text if it fails
    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.message || data || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Re-throw with more context
    throw new Error(error.message || 'Network request failed');
  }
};

/**
 * GET request
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export const get = (endpoint, options = {}) => {
  return request(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * POST request
 * @param {string} endpoint - The API endpoint
 * @param {any} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export const post = (endpoint, data = null, options = {}) => {
  return request(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : null,
    ...options,
  });
};

/**
 * PUT request
 * @param {string} endpoint - The API endpoint
 * @param {any} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export const put = (endpoint, data = null, options = {}) => {
  return request(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : null,
    ...options,
  });
};

/**
 * DELETE request
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export const del = (endpoint, options = {}) => {
  return request(endpoint, {
    method: 'DELETE',
    ...options,
  });
};

// Default export for convenience
export default {
  get,
  post,
  put,
  delete: del,
};
