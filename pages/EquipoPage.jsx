import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from '@rneui/themed';
import { useEquipo } from '../hooks/useEquipo';
import { useAuth } from '../hooks/useAuthContext';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import TeamDetails from '../components/equipo/TeamDetails';
import AvailableTeams from '../components/equipo/AvailableTeams';

const EquipoPage = () => {
  const { user } = useAuth();
  const { teamData, allTeams, loading, error, getTeamByUserId, getAllTeams } = useEquipo();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  useEffect(() => {
    const loadData = async () => {
      if (user?.token) {
        try {
          // Primero intentamos obtener el equipo del usuario
          const userTeam = await getTeamByUserId(user.token);
          
          // Si no tiene equipo, obtenemos todos los equipos disponibles
          if (!userTeam) {
            await getAllTeams();
          }
        } catch (error) {
          console.error('Error cargando datos:', error);
        }
      }
    };
    loadData();
  }, [user]);
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Card containerStyle={[styles.noTeamCard, { backgroundColor: theme.card }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </Card>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {teamData ? (
        <TeamDetails teamData={teamData} theme={theme} styles={styles} />
      ) : (
        <AvailableTeams allTeams={allTeams} theme={theme} styles={styles} />
      )}
    </ScrollView>
  );
};

// Add these new styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  teamHeader: {
    alignItems: 'center',
  },
  teamAvatar: {
    marginBottom: 10,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  teamType: {
    fontSize: 16,
  },
  infoCard: {
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scheduleInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 15,
  },
  membersCard: {
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },
  divider: {
    marginBottom: 15,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  memberAvatar: {
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 14,
  },
  noTeamCard: {
    borderRadius: 15,
    padding: 30,
    margin: 15,
    alignItems: 'center',
  },
  noTeamText: {
    fontSize: 18,
    marginTop: 15,
    textAlign: 'center',
  },
  availableTeamsCard: {
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
  },
  teamInfo: {
    marginLeft: 15,
  },
});

export default EquipoPage;