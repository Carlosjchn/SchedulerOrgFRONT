import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/apiConfig';

const apiClient = {
  async request(endpoint, options = {}) {
    const baseUrl = API_CONFIG.getBaseUrl();
    const url = `${baseUrl}/${endpoint}`;

    // Get stored auth token
    const auth = await AsyncStorage.getItem('auth');
    const token = auth ? JSON.parse(auth).token : null;
    //'ngrok-skip-browser-warning': 'true',
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;