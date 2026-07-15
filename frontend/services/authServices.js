import axios from 'axios';
import { API_URL } from '../config/api';

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username: username,
    password: password
  });
  console.log('Login response:', response.data); // Log the response data for debugging
  return response.data; 
};