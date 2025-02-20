import { useState } from 'react';
import apiClient from '../services/apiClient';
import API_CONFIG from '../config/apiConfig';

export const useSchedules = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserSchedules = async (userId) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.schedules.getByUser(userId);
      const schedules = await apiClient.request(endpoint);
      return schedules;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMonthSchedules = async (userId, month) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.schedules.getByMonth(userId, month);
      const schedules = await apiClient.request(endpoint);
      return schedules;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.endpoints.schedules.create;
      const newSchedule = await apiClient.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(scheduleData)
      });
      return newSchedule;
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
    getUserSchedules,
    getMonthSchedules,
    createSchedule
  };
};