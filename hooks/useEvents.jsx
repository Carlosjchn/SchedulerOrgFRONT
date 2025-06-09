import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './useAuthContext';
import API_CONFIG from '../config/apiConfig';

export const useSchedules = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState({});
  const { user, getDecodedUser } = useAuth();

  const formatSchedulesForAgenda = (rawSchedules) => {
    const formattedSchedules = {};
    
    rawSchedules.forEach(schedule => {
      const dateStr = schedule.fecha;
      if (!formattedSchedules[dateStr]) {
        formattedSchedules[dateStr] = [];
      }
      formattedSchedules[dateStr].push({
        id: schedule.idHorario,
        name: schedule.usuarioAsociado.nombre,
        email: schedule.usuarioAsociado.email,
        startTime: schedule.horaInicio,
        endTime: schedule.horaFin,
        height: 50,
        day: dateStr
      });
    });
    return formattedSchedules;
  };

  const getUserSchedules = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    console.log('Fetching user schedules...');
    try {
      if (!user?.userId) {
        throw new Error('No user ID found');
      }
      const decryptedUser = await getDecodedUser(user.userId);
      console.log('Using decoded user ID:', decryptedUser.userId);
      
      const response = await apiClient.request(
        API_CONFIG.endpoints.events.getByUser(decryptedUser.userId)
      );
      console.log('Raw API Response:', response);
      
      const formattedSchedules = formatSchedulesForAgenda(response);
      console.log('Formatted Schedules:', formattedSchedules);
      
      setSchedules(formattedSchedules);
      return formattedSchedules;
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.message);
      return {};
    } finally {
      setLoading(false);
      console.log('Fetch completed');
    }
  }, [user?.userId, loading, getDecodedUser]);

  const getSchedulesByMonth = async (month) => {
    setLoading(true);
    try {
      if (!user?.userId) {
        throw new Error('No user ID found');
      }
      const decryptedUser = await getDecodedUser(user.userId);
      const response = await apiClient.request(
        API_CONFIG.endpoints.events.getByMonth(decryptedUser.userId, month)
      );
      const formattedSchedules = formatSchedulesForAgenda(response);
      setSchedules(formattedSchedules);
      return formattedSchedules;
    } catch (err) {
      setError(err.message);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (date, startTime, endTime, title = 'Evento') => {
    setLoading(true);
    console.log('Creating schedule...');
    try {
      if (!user?.userId) {
        throw new Error('No user ID found');
      }
      const decryptedUser = await getDecodedUser(user.userId);
      console.log('Decrypted user info:', decryptedUser);
      
      const scheduleData = {
        titulo: title,
        idUsuario: parseInt(decryptedUser.userId) || decryptedUser.userId,
        fecha: date,
        horaInicio: `${startTime}:00`,
        horaFin: `${endTime}:00`
      };
      console.log('Schedule data to send:', scheduleData);
      const response = await apiClient.request(
        API_CONFIG.endpoints.events.create,
        {
          method: 'POST',
          body: JSON.stringify(scheduleData)
        }
      );
      console.log('Create schedule response:', response);
      
      await getUserSchedules();
      
      return response;
    } catch (err) {
      console.error('Error creating schedule:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    schedules,
    getUserSchedules,
    getSchedulesByMonth,
    createSchedule
  };
};