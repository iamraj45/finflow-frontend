import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: `${apiUrl}/api`,
});

export const loginUser = (loginData) => API.post('/auth/login', loginData);
export const registerUser = (registerData) => API.post('/auth/register', registerData);
