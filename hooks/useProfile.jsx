import { useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './useAuthContext';
import API_CONFIG from '../config/apiConfig';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { user, getDecodedUser } = useAuth();

  const getUserProfile = async () => {
    setLoading(true);
    console.log('Fetching user profile...');
    try {
      if (!user?.userId) {
        throw new Error('No user ID found');
      }

              const decryptedUser = await getDecodedUser(user.userId);
      const response = await apiClient.request(
        API_CONFIG.endpoints.users.getById(decryptedUser.userId)
      );
      
      // Merge decrypted user info with profile data
      const enrichedProfile = {
        ...response,
        userType: decryptedUser.userType,
        nombre: response.nombre || decryptedUser.userName
      };
      
      console.log('Profile Response:', enrichedProfile);
      setProfileData(enrichedProfile);
      return enrichedProfile;
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