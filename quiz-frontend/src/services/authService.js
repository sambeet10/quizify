import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const login = async (credentials) => {
  const response = await axios.post(`${API}/auth/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API}/auth/register`, userData);
  return response.data;
};

const authService = { login, register };

export default authService;