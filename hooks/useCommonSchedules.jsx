import { useState } from 'react';
import apiClient from '../services/apiClient';
import API_CONFIG from '../config/apiConfig';

export const useCommonSchedules = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commonSchedules, setCommonSchedules] = useState([]);

  const getCommonSchedulesByTeamId = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching common schedules for team:', teamId);
      const response = await apiClient.request(
        API_CONFIG.endpoints.commonSchedules.getByTeamId(teamId)
      );
      
      console.log('Common schedules response:', response);
      setCommonSchedules(response || []);
      return response || [];
    } catch (err) {
      console.error('Error getting common schedules:', err);
      setError('Error al obtener los horarios comunes del equipo');
      setCommonSchedules([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingEvents = (schedules) => {
    if (!schedules || schedules.length === 0) return [];
    
    const now = new Date();
    const allEvents = [];
    
    schedules.forEach(schedule => {
      schedule.horarios?.forEach(horario => {
        horario.eventos?.forEach(evento => {
          if (new Date(evento.fecha) >= now) {
            allEvents.push({
              ...evento,
              horarioComun: schedule.nombre,
              horarioNombre: horario.nombre
            });
          }
        });
      });
    });
    
    return allEvents.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };

  const getTeamStatistics = (schedules) => {
    if (!schedules || schedules.length === 0) {
      return {
        totalCommonSchedules: 0,
        totalEvents: 0,
        upcomingEvents: 0,
        uniqueParticipants: 0
      };
    }

    let totalEvents = 0;
    let upcomingEvents = 0;
    const participants = new Set();
    const now = new Date();

    schedules.forEach(schedule => {
      schedule.horarios?.forEach(horario => {
        if (horario.usuarioAsociado) {
          participants.add(horario.usuarioAsociado.idUsuario);
        }
        
        horario.eventos?.forEach(evento => {
          totalEvents++;
          if (new Date(evento.fecha) >= now) {
            upcomingEvents++;
          }
          if (evento.usuarioAsociado) {
            participants.add(evento.usuarioAsociado.idUsuario);
          }
        });
      });
    });

    return {
      totalCommonSchedules: schedules.length,
      totalEvents,
      upcomingEvents,
      uniqueParticipants: participants.size
    };
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM format
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return {
    loading,
    error,
    commonSchedules,
    getCommonSchedulesByTeamId,
    getUpcomingEvents,
    getTeamStatistics,
    formatTime,
    formatDate
  };
}; 