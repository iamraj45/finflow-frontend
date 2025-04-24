import axios from '../utils/axios';

const apiUrl = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: `${apiUrl}/api`,
});

export const loginUser = async(payload) => {
  return API.post('/auth/login', payload);
}

export const registerUser = (registerData) => API.post('/auth/register', registerData);
