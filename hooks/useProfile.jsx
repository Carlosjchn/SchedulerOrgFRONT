import { useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './useAuthContext';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { user } = useAuth();

  const getUserProfile = async () => {
    setLoading(true);
    console.log('Fetching user profile...');
    try {
      if (!user?.token) {
        throw new Error('No user token found');
      }

      const response = await apiClient.request(`usuarios/id/${user.token}`);
      console.log('Profile Response:', response);

      setProfileData(response);
      return response;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatTeamSchedule = (team) => {
    if (!team) return null;
    
    return {
      id: team.idEquipo,
      name: team.nombre,
      type: team.tipo,
      startTime: team.horaInicioAct,
      endTime: team.horaFinAct
    };
  };

  return {
    loading,
    error,
    profileData,
    getUserProfile,
    formatTeamSchedule
  };
};