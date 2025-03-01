import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../config/apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthState = async () => {
    try {
      const tokenString = await AsyncStorage.getItem('userToken');
      if (tokenString) {
        const userData = JSON.parse(tokenString);
        setUser({
          token: userData.token,
          nombre: userData.nombre
        });
      }
    } catch (err) {
      console.error('Error checking auth state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreoremail: email,
          contrasena: password,
        }),
      });
  
      const data = await response.json();
      console.log("Data: " + JSON.stringify(data));
      if (!response.ok) {
        console.log("Data: " + JSON.stringify(data
        ));
        throw new Error(data.message || 'Login failed');
      }

      const userData = {
        token: data.token,
        nombre: data.userName || email
      };
      console.log("User Data: " + JSON.stringify(userData));  
      await AsyncStorage.setItem('userToken', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const requestBody = {
        nombre: name,
        email: email,
        contrasena: password
      };
      console.log('Register Request:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${getBaseUrl()}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      const rawResponse = await response.text();
      console.log('Raw Response:', rawResponse);

      // Check if response is successful
      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // If we got here, registration was successful
      if (rawResponse.includes('Usuario registrado correctamente')) {
        return true;
      }

      // Try to parse as JSON if it's not the success message
      try {
        const data = JSON.parse(rawResponse);
        if (data.message) {
          throw new Error(data.message);
        }
      } catch (parseError) {
        // If not JSON and not success message, throw error
        if (!rawResponse.includes('Usuario registrado correctamente')) {
          throw new Error('Invalid response from server');
        }
      }

      return true;
    } catch (err) {
      console.error('Register Error:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register // Add register to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};