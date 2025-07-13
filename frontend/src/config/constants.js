export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  MESSAGE: {
    CONVERSATIONS: `${API_BASE_URL}/message/conversations`,
    MESSAGES: `${API_BASE_URL}/message/messages`,
  },
  USERS: `${API_BASE_URL}/users`,
};

export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3001';
