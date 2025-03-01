import { useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './useAuthContext';

export const useEquipo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [allTeams, setAllTeams] = useState([]);

  const getTeamByUserId = async (userId) => {
    setLoading(true);
    try {
      const response = await apiClient.request(`equipos/usuario/${userId}`);
      
      if (response) {
        const formattedTeam = {
          idEquipo: response.idEquipo,
          nombre: response.nombre,
          tipo: response.tipo,
          horaInicioAct: response.horaInicio,
          horaFinAct: response.horaFin,
          miembros: response.usuarios?.map(user => ({
            nombre: user.nombre,
            email: user.email
          })) || []
        };
        setTeamData(formattedTeam);
        return formattedTeam;
      }
      return null;
    } catch (err) {
      console.error('Error getting team:', err);
      setError('Error al obtener el equipo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllTeams = async () => {
    setLoading(true);
    try {
      const response = await apiClient.request('equipos/all');
      console.log('All teams response:', response);
      
      if (Array.isArray(response)) {
        setAllTeams(response);
        return response;
      }
      setAllTeams([]);
      return [];
    } catch (err) {
      console.error('Error getting all teams:', err);
      setError('Error al obtener los equipos disponibles');
      setAllTeams([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    teamData,
    allTeams,
    loading,
    error,
    getTeamByUserId,
    getAllTeams
  };
};