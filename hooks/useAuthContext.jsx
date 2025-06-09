import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../config/apiConfig';
import { Platform } from 'react-native';

const TOKEN_KEY = '@auth_token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize JWT processing (no crypto needed)
  const initializeAuth = async () => {
    try {
      setLoading(true);
      console.log(`Initializing JWT authentication for ${Platform.OS}`);
      setIsInitialized(true);
      return true;
    } catch (err) {
      console.warn('Auth initialization failed:', err.message);
      setIsInitialized(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Decode JWT token and extract user information
  const decodeJWT = async (token) => {
    console.log('🔍 Decoding JWT token on platform:', Platform.OS);
    
    try {
      // Validate JWT format
      if (!token.includes('.') || token.split('.').length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      console.log('✅ Valid JWT format detected');
      
      // Decode JWT payload (middle part)
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      console.log('✅ Successfully decoded JWT payload');
      console.log('JWT payload keys:', Object.keys(payload));
      
      return {
        userId: payload.userId || payload.sub || payload.id || 'user',
        userName: payload.userName || payload.name || payload.nombre || 'Usuario',
        userType: payload.userType || payload.role || payload.type || 'user',
        token
      };
      
    } catch (err) {
      console.error('❌ JWT decode failed:', err.message);
      
      // Try parsing as plain JSON as fallback
      try {
        console.log('🔄 Trying to parse as plain JSON');
        const parsed = JSON.parse(token);
        return {
          userId: parsed.userId || parsed.id || 'user',
          userName: parsed.userName || parsed.name || parsed.nombre || 'Usuario',
          userType: parsed.userType || 'user',
          token
        };
      } catch (jsonError) {
        console.error('❌ JSON parse also failed:', jsonError.message);
        
        // Final fallback
        return {
          userId: 'user',
          userName: 'Usuario',
          userType: 'user',
          token
        };
      }
    }
  };

  // Check if user is already logged in
  const checkAuthState = async () => {
    try {
      const tokenString = await AsyncStorage.getItem(TOKEN_KEY);
      if (tokenString) {
        const { token } = JSON.parse(tokenString);
        if (token) {
          const userData = await decodeJWT(token);
          setUser(userData);
        }
      }
    } catch (err) {
      console.error('Auth state check error:', err);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize app authentication state
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
        await checkAuthState();
      } catch (err) {
        console.error('Initialization error:', err);
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // Login handler
  const login = async (email, password) => {
    if (!isInitialized) {
      throw new Error('Authentication system not initialized');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${getBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': Platform.OS === 'web' ? 'web' : 'mobile',
          'X-Platform': Platform.OS,
        },
        body: JSON.stringify({
          nombreoremail: email,
          contrasena: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('Server did not provide an authentication token');
      }

      // Debug: Log token info
      console.log('=== TOKEN DEBUG INFO ===');
      console.log('Platform:', Platform.OS);
      console.log('Token length:', data.token.length);
      console.log('Token starts with:', data.token.substring(0, 50));
      console.log('Token ends with:', data.token.substring(data.token.length - 20));
      console.log('Is JWT-like (has dots):', data.token.includes('.'));
      console.log('========================');

      try {
        const userData = await decodeJWT(data.token);
        console.log('Successfully processed JWT token for user:', userData.userName);
        // Store token securely
        await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify({ token: data.token }));
        setUser(userData);
        return true;
      } catch (tokenError) {
        console.error('JWT processing error:', tokenError);
        console.warn('Continuing with basic token handling');
        // Fallback: store token and create basic user object
        await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify({ token: data.token }));
        setUser({
          userId: 'user',
          userName: 'Usuario',
          userType: 'user',
          token: data.token
        });
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    if (!isInitialized) {
      throw new Error('Authentication system not initialized');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${getBaseUrl()}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          email,
          contrasena: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get auth header for API requests
  const getAuthHeader = () => {
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };

  // Helper function to get decoded user information
  const getDecodedUser = async (data) => {
    console.log('🔍 Getting decoded user info on platform:', Platform.OS);
    
    // If the data matches our stored user, return stored user info
    if (user?.userId === data || user?.userName === data) {
      console.log('✅ Using cached user info');
      return {
        userId: user.userId,
        userName: user.userName,
        userType: user.userType
      };
    }

    // Try to decode as JWT token
    try {
      if (data.includes('.') && data.split('.').length === 3) {
        console.log('🔓 Decoding as JWT token');
        const userInfo = await decodeJWT(data);
        return {
          userId: userInfo.userId,
          userName: userInfo.userName,
          userType: userInfo.userType
        };
      }
    } catch (jwtError) {
      console.log('❌ JWT decode failed:', jwtError.message);
    }

    // Try to parse as JSON
    try {
      console.log('📄 Trying to parse as JSON');
      const parsed = JSON.parse(data);
      return {
        userId: parsed.userId || parsed.id || 'user',
        userName: parsed.userName || parsed.name || parsed.nombre || data,
        userType: parsed.userType || 'user'
      };
    } catch (jsonError) {
      console.log('❌ JSON parse failed:', jsonError.message);
    }

    // Fallback: treat as plain text
    console.log('🔄 Using fallback - treating as plain text');
    return {
      userId: data,
      userName: data,
      userType: 'user'
    };
  };

  const value = {
    user,
    loading,
    error,
    isInitialized,
    login,
    logout,
    register,
    getAuthHeader,
    isAuthenticated: !!user,
    getDecodedUser
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