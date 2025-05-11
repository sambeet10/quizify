import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL;

const login = async (credentials) => {
  const response = await axios.post(`${API}/api/auth/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API}/api/auth/register`, userData);
  return response.data;
};

const authService = { login, register };

export default authService;