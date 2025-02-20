import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getBaseUrl, endpoints } from '../config/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedAuth = Platform.OS === 'web'
        ? localStorage.getItem('auth')
        : await AsyncStorage.getItem('auth');
      
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
      }
    } catch (err) {
      console.error('Error loading stored auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const storeAuth = async (authData) => {
    try {
      const authString = JSON.stringify(authData);
      if (Platform.OS === 'web') {
        localStorage.setItem('auth', authString);
      } else {
        await AsyncStorage.setItem('auth', authString);
      }
    } catch (err) {
      console.error('Error storing auth:', err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/${endpoints.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          nombreoremail: email,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const authData = {
        token: data.token,
        userName: data.userName,
        userType: data.userType
      };
      setUser(authData);
      await storeAuth(authData);
      return true;
    } catch (err) {
      if (err.message === 'Network request failed') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred during login');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('auth');
      } else {
        await AsyncStorage.removeItem('auth');
      }
    } catch (err) {
      console.error('Error removing stored auth:', err);
    }
  };

  const register = async (nombre, email, contrasena, tipo) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/${endpoints.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          email,
          contrasena,
          tipo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return true;
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
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