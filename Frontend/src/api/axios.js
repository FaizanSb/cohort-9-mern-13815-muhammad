import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend ka base URL
  withCredentials: true, // cookies ko allow karne ke liye
});

export default api;