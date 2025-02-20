import { useState } from 'react';
import apiClient from '../services/apiClient';
import API_CONFIG from '../config/apiConfig';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.users.getAll;
      const users = await apiClient.request(endpoint);
      return users;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.users.create;
      const newUser = await apiClient.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return newUser;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.users.update(id);
      const updatedUser = await apiClient.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      return updatedUser;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllUsers,
    createUser,
    updateUser
  };
};