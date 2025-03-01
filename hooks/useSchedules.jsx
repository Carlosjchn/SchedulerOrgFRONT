import { useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './useAuthContext';

export const useSchedules = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState({});
  const { user } = useAuth();
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
  const getUserSchedules = async () => {
    setLoading(true);
    console.log('Fetching user schedules...');
    try {
      if (!user?.token) {
        throw new Error('No user token found');
      }
      console.log('User token:', user.token);
      const response = await apiClient.request(`horarios/idUsuario/${user.token}`);
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
  };
  const getSchedulesByMonth = async (month) => {
    setLoading(true);
    try {
      const response = await apiClient.request(`horarios/mes/${month}`);
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
  // Add new createSchedule function
  const createSchedule = async (date, startTime, endTime) => {
    setLoading(true);
    console.log('Creating schedule...');
    try {
      if (!user?.token) {
        throw new Error('No user token found');
      }
      const scheduleData = {
        fecha: date,
        horaInicio: `${startTime}:00`,
        horaFin: `${endTime}:00`,
        usuarioAsociado: {
          idUsuario: user.token
        }
      };
      console.log('Schedule data:', scheduleData);
      const response = await apiClient.request('horarios/crear', {
        method: 'POST',
        body: JSON.stringify(scheduleData)
      });
      console.log('Create schedule response:', response);
      
      // Refresh schedules after creating new one
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
    createSchedule // Add the new function to the return object
  };
};