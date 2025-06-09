import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Text, Avatar, Divider, Icon, Button } from '@rneui/themed';
import { useAuth } from '../hooks/useAuthContext';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

// Simple Badge component since it might not be available in @rneui/themed
const SimpleBadge = ({ value, status, containerStyle }) => {
  const getBadgeColor = (status) => {
    switch (status) {
      case 'warning': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'primary': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={[{
      backgroundColor: getBadgeColor(status),
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'center',
    }, containerStyle]}>
      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
        {value}
      </Text>
    </View>
  );
};

const PerfilPage = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const { profileData, getUserProfile, loading } = useProfile();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getUserProfile();
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert(
          "Error",
          "No se pudo cargar el perfil. Por favor, intente nuevamente."
        );
      }
    };

    if (user?.userId) {
      fetchProfile();
    }
  }, [user?.userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getUserProfile();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async () => {
    Alert.alert(
      "Eliminar Usuario",
      "¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              Alert.alert("Éxito", "Se ha borrado el usuario con éxito");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert(
                "Error",
                "No se pudo eliminar el usuario. Por favor, intente nuevamente."
              );
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'No disponible';
    return timeString.slice(0, 5); // HH:MM format
  };

  const getNextSchedule = () => {
    if (!profileData?.eventosUser) return null;
    const now = new Date();
    const futureSchedules = profileData.eventosUser.filter(event => new Date(event.fecha) >= now);
    return futureSchedules.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];
  };

  const getCompletedSchedules = () => {
    if (!profileData?.eventosUser) return 0;
    const now = new Date();
    return profileData.eventosUser.filter(event => new Date(event.fecha) < now).length;
  };

  const getWeeklyHours = () => {
    if (!profileData?.eventosUser) return 0;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return profileData.eventosUser
      .filter(event => {
        const scheduleDate = new Date(event.fecha);
        return scheduleDate >= oneWeekAgo && scheduleDate <= now;
      })
      .reduce((total, event) => {
        const start = new Date(`2000-01-01T${event.horaInicio}`);
        const end = new Date(`2000-01-01T${event.horaFin}`);
        const hours = (end - start) / (1000 * 60 * 60);
        return total + hours;
      }, 0);
  };

  if (loading && !profileData) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Cargando perfil...</Text>
      </View>
    );
  }

  const nextSchedule = getNextSchedule();
  const completedSchedules = getCompletedSchedules();
  const weeklyHours = getWeeklyHours();

  // Debug logs
  console.log('Profile Data:', profileData);
  console.log('Events User:', profileData?.eventosUser);
  console.log('Next Schedule:', nextSchedule);
  console.log('Completed Schedules:', completedSchedules);
  console.log('Weekly Hours:', weeklyHours);

      return (
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
      >
      {/* Header Card con información básica */}
      <Card containerStyle={[styles.headerCard, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh" type="material" color={theme.primary} size={24} />
        </TouchableOpacity>
        
        <View style={styles.avatarContainer}>
          <Avatar
            size={120}
            rounded
            icon={{ name: 'user', type: 'font-awesome' }}
            containerStyle={[styles.avatar, { backgroundColor: theme.primary }]}
          />
          <SimpleBadge
            value={user?.userType === 'admin' ? 'ADMIN' : 'USER'}
            status={user?.userType === 'admin' ? 'warning' : 'success'}
            containerStyle={styles.badgeContainer}
          />
          <Text style={[styles.userName, { color: theme.text }]}>
            {profileData?.nombre || user?.userName}
          </Text>
          <Text style={[styles.userTitle, { color: theme.subText }]}>
            {user?.userType === 'admin' ? 'Administrador' : 'Usuario'}
          </Text>
        </View>

        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoItem}>
            <Icon name="email" type="material" color={theme.primary} size={20} />
            <Text style={[styles.quickInfoText, { color: theme.subText }]} numberOfLines={1}>
              {profileData?.email || 'No disponible'}
            </Text>
          </View>
          <View style={styles.quickInfoItem}>
            <Icon name="fingerprint" type="material" color={theme.primary} size={20} />
            <Text style={[styles.quickInfoText, { color: theme.subText }]}>
              ID: {user?.userId}
            </Text>
          </View>
        </View>
      </Card>

      {/* Estadísticas de Actividad */}
      <Card containerStyle={[styles.statsCard, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Icon name="analytics" type="material" color={theme.primary} size={24} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Actividad</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Icon name="event" type="material" color={theme.primary} size={24} />
            </View>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {profileData?.eventosUser?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Total Eventos</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
            </View>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
              {completedSchedules}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Completados</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FF9800' + '20' }]}>
              <Icon name="schedule" type="material" color="#FF9800" size={24} />
            </View>
            <Text style={[styles.statNumber, { color: '#FF9800' }]}>
              {profileData?.eventosUser?.filter(event => new Date(event.fecha) >= new Date()).length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Próximos</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#2196F3' + '20' }]}>
              <Icon name="hourglass-empty" type="material" color="#2196F3" size={24} />
            </View>
            <Text style={[styles.statNumber, { color: '#2196F3' }]}>
              {weeklyHours.toFixed(1)}h
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Esta Semana</Text>
          </View>
        </View>
      </Card>

      {/* Próximo Horario */}
      {nextSchedule && (
        <Card containerStyle={[styles.nextScheduleCard, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="upcoming" type="material" color={theme.primary} size={24} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximo Horario</Text>
          </View>
          
          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleTitle}>
              <Icon name="event-note" type="material" color={theme.primary} size={20} />
              <Text style={[styles.scheduleTitleText, { color: theme.text }]}>
                {nextSchedule.titulo}
              </Text>
            </View>
            <View style={styles.scheduleDate}>
              <Icon name="calendar-today" type="material" color={theme.primary} size={20} />
              <Text style={[styles.scheduleDateText, { color: theme.text }]}>
                {formatDate(nextSchedule.fecha)}
              </Text>
            </View>
            <View style={styles.scheduleTime}>
              <Icon name="access-time" type="material" color={theme.primary} size={20} />
              <Text style={[styles.scheduleTimeText, { color: theme.text }]}>
                {formatTime(nextSchedule.horaInicio)} - {formatTime(nextSchedule.horaFin)}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Información del Equipo */}
      {profileData?.equipos && profileData.equipos.length > 0 && (
        <Card containerStyle={[styles.teamCard, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="groups" type="material" color={theme.primary} size={24} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mi Equipo</Text>
          </View>
          
          <View style={styles.teamDetails}>
            <View style={styles.teamMainInfo}>
              <Text style={[styles.teamName, { color: theme.text }]}>
                {profileData.equipos[0].nombreEquipo}
              </Text>
              <SimpleBadge
                value={profileData.equipos[0].rol}
                status="primary"
                containerStyle={styles.teamTypeBadge}
              />
            </View>

            <View style={styles.teamInfo}>
              <View style={styles.infoRow}>
                <Icon name="badge" type="material" color={theme.primary} size={20} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  ID del Equipo: {profileData.equipos[0].idEquipo}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="person" type="material" color={theme.primary} size={20} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  Rol: {profileData.equipos[0].rol}
                </Text>
              </View>
            </View>

            {profileData.equipos.length > 1 && (
              <View style={styles.additionalTeams}>
                <Text style={[styles.teamMembersTitle, { color: theme.text }]}>
                  Otros equipos ({profileData.equipos.length - 1})
                </Text>
                {profileData.equipos.slice(1, 3).map((team, index) => (
                  <View key={index} style={styles.additionalTeamItem}>
                    <Text style={[styles.additionalTeamName, { color: theme.subText }]}>
                      {team.nombreEquipo} - {team.rol}
                    </Text>
                  </View>
                ))}
                {profileData.equipos.length > 3 && (
                  <Text style={[styles.moreMembersText, { color: theme.subText }]}>
                    +{profileData.equipos.length - 3} equipos más
                  </Text>
                )}
              </View>
            )}
          </View>
        </Card>
      )}

      {/* Configuraciones y Acciones */}
      <Card containerStyle={[styles.actionsCard, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Icon name="settings" type="material" color={theme.primary} size={24} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Configuración</Text>
        </View>
        
        <View style={styles.actionsList}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Equipo')}
          >
            <Icon name="group" type="material" color={theme.primary} size={20} />
            <Text style={[styles.actionText, { color: theme.text }]}>Ver mi equipo</Text>
            <Icon name="chevron-right" type="material" color={theme.subText} size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Horarios')}
          >
            <Icon name="calendar-month" type="material" color={theme.primary} size={20} />
            <Text style={[styles.actionText, { color: theme.text }]}>Mis horarios</Text>
            <Icon name="chevron-right" type="material" color={theme.subText} size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => {
              Alert.alert('Información', 'Función de notificaciones próximamente disponible');
            }}
          >
            <Icon name="notifications" type="material" color={theme.primary} size={20} />
            <Text style={[styles.actionText, { color: theme.text }]}>Notificaciones</Text>
            <Icon name="chevron-right" type="material" color={theme.subText} size={20} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Información del Sistema */}
      <Card containerStyle={[styles.systemCard, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Icon name="info" type="material" color={theme.primary} size={24} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Información del Sistema</Text>
        </View>
        
        <View style={styles.systemInfo}>
          <View style={styles.systemItem}>
            <Text style={[styles.systemLabel, { color: theme.subText }]}>Versión de la app:</Text>
            <Text style={[styles.systemValue, { color: theme.text }]}>1.0.0</Text>
          </View>
          <View style={styles.systemItem}>
            <Text style={[styles.systemLabel, { color: theme.subText }]}>Tema actual:</Text>
            <Text style={[styles.systemValue, { color: theme.text }]}>
              {isDarkMode ? 'Oscuro' : 'Claro'}
            </Text>
          </View>
          <View style={styles.systemItem}>
            <Text style={[styles.systemLabel, { color: theme.subText }]}>Última actualización:</Text>
            <Text style={[styles.systemValue, { color: theme.text }]}>
              {new Date().toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
      </Card>
      
      {/* Botón de eliminar usuario */}
      <Button
        title="Eliminar Usuario"
        icon={{ name: 'delete', type: 'material', color: 'white' }}
        buttonStyle={[styles.deleteButton, { backgroundColor: '#CC0000' }]}
        containerStyle={styles.buttonContainer}
        onPress={handleDeleteUser}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  headerCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
    position: 'relative',
  },
  refreshButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 10,
    elevation: 3,
  },
  badgeContainer: {
    position: 'absolute',
    top: 85,
    left: width / 2 + 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userTitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  quickInfoContainer: {
    gap: 10,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  quickInfoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  nextScheduleCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  scheduleInfo: {
    gap: 10,
  },
  scheduleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTitleText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  scheduleDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDateText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTimeText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  teamCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  teamDetails: {
    gap: 15,
  },
  teamMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  teamTypeBadge: {
    marginLeft: 10,
  },
  teamSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamScheduleText: {
    fontSize: 14,
    marginLeft: 8,
  },
  teamInfo: {
    gap: 10,
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
  teamMembers: {
    gap: 10,
  },
  teamMembersTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  membersList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberItem: {
    alignItems: 'center',
    maxWidth: 60,
  },
  memberAvatar: {
    marginBottom: 4,
  },
  memberName: {
    fontSize: 10,
    textAlign: 'center',
  },
  additionalTeams: {
    gap: 8,
  },
  additionalTeamItem: {
    paddingVertical: 4,
  },
  additionalTeamName: {
    fontSize: 14,
  },
  moreMembersText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionsCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  actionsList: {
    gap: 5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  systemCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  systemInfo: {
    gap: 10,
  },
  systemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemLabel: {
    fontSize: 14,
  },
  systemValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 30,
  },
  deleteButton: {
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#CC0000',
  },
});

export default PerfilPage;