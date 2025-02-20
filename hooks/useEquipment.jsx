import { useState } from 'react';
import apiClient from '../services/apiClient';
import API_CONFIG from '../config/apiConfig';

export const useEquipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllEquipment = async () => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.equipment.getAll;
      const equipment = await apiClient.request(endpoint);
      return equipment;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEquipmentByName = async (name) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.equipment.getByName(name);
      const equipment = await apiClient.request(endpoint);
      return equipment;
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
    getAllEquipment,
    getEquipmentByName
  };
};