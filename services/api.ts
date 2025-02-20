// services/api.ts
import axios from 'axios';

const api = axios.create({
  // For iOS simulator or web, use "http://localhost:8080"
  // For Android emulator, you might need "http://10.0.2.2:8080"
  baseURL: 'http://localhost:8080',
  withCredentials: true, // if your backend uses sessions/cookies
});

export default api;
