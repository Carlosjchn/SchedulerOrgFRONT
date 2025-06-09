import { useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './useAuthContext';
import API_CONFIG from '../config/apiConfig';

export const useEquipo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const { getDecodedUser } = useAuth();

  const getTeamByUserId = async (userId) => {
    setLoading(true);
    try {
              const decryptedUser = await getDecodedUser(userId);
      const response = await apiClient.request(
        API_CONFIG.endpoints.teams.getByUserId(decryptedUser.userId)
      );
      
      if (response) {
        const formattedTeam = {
          idEquipo: response.idEquipo,
          nombre: response.nombre,
          tipo: response.tipo,
          horaInicioAct: response.horaInicio,
          horaFinAct: response.horaFin,
          miembros: await Promise.all((response.usuarios || []).map(async user => {
            const decryptedMember = await getDecodedUser(user.idUsuario);
            return {
              idUsuario: decryptedMember.userId,
              nombre: user.nombre || decryptedMember.userName,
              email: user.email,
              userType: decryptedMember.userType
            };
          }))
        };
        console.log('Formatted team:', formattedTeam);
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
      const response = await apiClient.request(API_CONFIG.endpoints.teams.getAll);
      console.log('All teams response:', response);
      
      if (Array.isArray(response)) {
        // Decrypt and enrich all user data in the teams
        const decryptedTeams = await Promise.all(response.map(async team => ({
          ...team,
          usuarios: await Promise.all((team.usuarios || []).map(async user => {
            const decryptedMember = await getDecodedUser(user.idUsuario);
            return {
              ...user,
              idUsuario: decryptedMember.userId,
              nombre: user.nombre || decryptedMember.userName,
              userType: decryptedMember.userType
            };
          }))
        })));
        setAllTeams(decryptedTeams);
        return decryptedTeams;
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