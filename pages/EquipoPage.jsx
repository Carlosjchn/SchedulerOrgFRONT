import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Text, Icon, Avatar, Divider, Button } from '@rneui/themed';
import { useEquipo } from '../hooks/useEquipo';
import { useCommonSchedules } from '../hooks/useCommonSchedules';
import { useAuth } from '../hooks/useAuthContext';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

// Simple Badge component
const SimpleBadge = ({ value, status, containerStyle }) => {
  const getBadgeColor = (status) => {
    switch (status) {
      case 'warning': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'primary': return '#2196F3';
      case 'error': return '#F44336';
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

const EquipoPage = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { teamData, loading: teamLoading, getTeamByUserId } = useEquipo();
  const { 
    commonSchedules, 
    loading: schedulesLoading, 
    getCommonSchedulesByTeamId, 
    getUpcomingEvents, 
    getTeamStatistics,
    formatTime,
    formatDate 
  } = useCommonSchedules();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, [user]);

  useEffect(() => {
    if (teamData?.idEquipo) {
      loadCommonSchedules();
    }
  }, [teamData]);

  const loadTeamData = async () => {
    if (user?.token) {
      try {
        console.log('Loading team data for user:', user.userId);
        await getTeamByUserId(user.token);
      } catch (error) {
        console.error('Error loading team data:', error);
        Alert.alert('Error', 'No se pudo cargar la información del equipo');
      }
    }
  };

  const loadCommonSchedules = async () => {
    if (teamData?.idEquipo) {
      try {
        console.log('Loading common schedules for team:', teamData.idEquipo);
        await getCommonSchedulesByTeamId(teamData.idEquipo);
      } catch (error) {
        console.error('Error loading common schedules:', error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTeamData();
      if (teamData?.idEquipo) {
        await loadCommonSchedules();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const transformCommonScheduleToWeeklyFormat = (horarioComun) => {
    console.log('Transforming common schedule:', horarioComun);
    
    const weeklySchedule = {
      'Lunes': [],
      'Martes': [],
      'Miércoles': [],
      'Jueves': [],
      'Viernes': [],
      'Sábado': [],
      'Domingo': []
    };

    // Extract all events from the common schedule
    const allEvents = [];
    horarioComun.horarios?.forEach(horario => {
      horario.eventos?.forEach(evento => {
        allEvents.push({
          ...evento,
          horarioNombre: horario.nombre,
          usuarioAsociado: evento.usuarioAsociado
        });
      });
    });

    console.log('All events extracted:', allEvents);

    // Group events by day of week based on their actual dates
    allEvents.forEach(evento => {
      const eventDate = new Date(evento.fecha + 'T00:00:00'); // Ensure proper date parsing
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayName = dayNames[eventDate.getDay()];

      console.log(`Event "${evento.titulo}" on ${evento.fecha} is on ${dayName} (day ${eventDate.getDay()})`);

      if (weeklySchedule[dayName] && evento.usuarioAsociado) {
        weeklySchedule[dayName].push({
          workerId: evento.usuarioAsociado.idUsuario.toString(),
          startTime: evento.horaInicio,
          endTime: evento.horaFin,
          title: evento.titulo,
          workerName: evento.usuarioAsociado.nombre,
          originalDate: evento.fecha
        });
      }
    });

    // Log the distribution of events by day
    Object.entries(weeklySchedule).forEach(([day, events]) => {
      if (events.length > 0) {
        console.log(`${day}: ${events.length} events`);
      }
    });

    console.log('Transformed weekly schedule:', weeklySchedule);
    return weeklySchedule;
  };

  const createMembersFromSchedule = (horarioComun) => {
    const membersMap = new Map();
    
    horarioComun.horarios?.forEach(horario => {
      horario.eventos?.forEach(evento => {
        if (evento.usuarioAsociado) {
          const userId = evento.usuarioAsociado.idUsuario.toString();
          if (!membersMap.has(userId)) {
            membersMap.set(userId, {
              id: userId,
              nombre: evento.usuarioAsociado.nombre,
              email: evento.usuarioAsociado.email || `${evento.usuarioAsociado.nombre.toLowerCase().replace(' ', '')}@example.com`,
              originalId: evento.usuarioAsociado.idUsuario
            });
          }
        }
      });
    });

    const members = Array.from(membersMap.values());
    console.log('Created members from schedule:', members);
    return members;
  };

  const handleCommonSchedulePress = (horarioComun) => {
    try {
      console.log('Navigating to WeeklySchedulePage with common schedule:', horarioComun.nombre);
      
      const weeklyScheduleData = transformCommonScheduleToWeeklyFormat(horarioComun);
      const scheduleMembers = createMembersFromSchedule(horarioComun);
      
      if (scheduleMembers.length === 0) {
        Alert.alert(
          'Sin participantes',
          'Este horario común no tiene participantes asignados.',
          [{ text: 'OK' }]
        );
        return;
      }

      const scheduleData = {
        commonSchedule: weeklyScheduleData,
        teamInfo: {
          id: teamData?.idEquipo,
          name: teamData?.nombre,
          type: teamData?.tipo
        },
        commonScheduleName: horarioComun.nombre
      };

      navigation.navigate('WeeklySchedule', {
        scheduleData: scheduleData,
        teamName: `${teamData?.nombre} - ${horarioComun.nombre}`,
        members: scheduleMembers
      });

    } catch (error) {
      console.error('Error navigating to weekly schedule:', error);
      Alert.alert(
        'Error',
        'No se pudo cargar el horario común. Por favor, intente nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const loading = teamLoading || schedulesLoading;

  if (loading && !teamData) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Cargando equipo...</Text>
      </View>
    );
  }

  if (!teamData) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <Card containerStyle={[styles.noTeamCard, { backgroundColor: theme.card }]}>
          <Icon name="group-off" type="material" color={theme.subText} size={80} />
          <Text style={[styles.noTeamText, { color: theme.text }]}>
            No perteneces a ningún equipo
          </Text>
          <Text style={[styles.noTeamSubtext, { color: theme.subText }]}>
            Contacta con tu administrador para ser asignado a un equipo
          </Text>
        </Card>
      </ScrollView>
    );
  }

  const upcomingEvents = getUpcomingEvents(commonSchedules);
  const statistics = getTeamStatistics(commonSchedules);

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
      {/* Header del Equipo */}
      <Card containerStyle={[styles.headerCard, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh" type="material" color={theme.primary} size={24} />
        </TouchableOpacity>
        
        <View style={styles.teamHeader}>
          <Avatar
            size={100}
            rounded
            icon={{ name: 'groups', type: 'material' }}
            containerStyle={[styles.teamAvatar, { backgroundColor: theme.primary }]}
          />
          <Text style={[styles.teamName, { color: theme.text }]}>{teamData.nombre}</Text>
          <SimpleBadge
            value={teamData.tipo}
            status="primary"
            containerStyle={styles.teamTypeBadge}
          />
          
          {teamData.horaInicioAct && (
            <View style={styles.teamSchedule}>
              <Icon name="schedule" type="material" color={theme.subText} size={18} />
              <Text style={[styles.teamScheduleText, { color: theme.subText }]}>
                {formatTime(teamData.horaInicioAct)} - {formatTime(teamData.horaFinAct)}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Estadísticas del Equipo */}
      <Card containerStyle={[styles.statsCard, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Icon name="analytics" type="material" color={theme.primary} size={24} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Estadísticas</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Icon name="schedule" type="material" color={theme.primary} size={24} />
            </View>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {statistics.totalCommonSchedules}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Horarios Comunes</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Icon name="event" type="material" color="#4CAF50" size={24} />
            </View>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
              {statistics.totalEvents}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Total Eventos</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FF9800' + '20' }]}>
              <Icon name="upcoming" type="material" color="#FF9800" size={24} />
            </View>
            <Text style={[styles.statNumber, { color: '#FF9800' }]}>
              {statistics.upcomingEvents}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Próximos</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#9C27B0' + '20' }]}>
              <Icon name="people" type="material" color="#9C27B0" size={24} />
            </View>
            <Text style={[styles.statNumber, { color: '#9C27B0' }]}>
              {statistics.uniqueParticipants}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Participantes</Text>
          </View>
        </View>
      </Card>

      {/* Miembros del Equipo */}
      {teamData.miembros && teamData.miembros.length > 0 && (
        <Card containerStyle={[styles.membersCard, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="group" type="material" color={theme.primary} size={24} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Miembros ({teamData.miembros.length})
            </Text>
          </View>
          
          <View style={styles.membersList}>
            {teamData.miembros.map((miembro, index) => (
              <View key={index} style={styles.memberRow}>
                <Avatar
                  size={45}
                  rounded
                  title={miembro.nombre?.charAt(0) || 'U'}
                  containerStyle={[styles.memberAvatar, { backgroundColor: theme.primary }]}
                />
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: theme.text }]}>{miembro.nombre}</Text>
                  <Text style={[styles.memberEmail, { color: theme.subText }]}>{miembro.email}</Text>
                  <SimpleBadge
                    value={miembro.userType || 'USUARIO'}
                    status={miembro.userType === 'admin' ? 'warning' : 'success'}
                    containerStyle={styles.memberBadge}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Próximos Eventos */}
      {upcomingEvents.length > 0 && (
        <Card containerStyle={[styles.eventsCard, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="event-available" type="material" color={theme.primary} size={24} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Próximos Eventos ({upcomingEvents.length})
            </Text>
          </View>
          
          <View style={styles.eventsList}>
            {upcomingEvents.slice(0, 5).map((evento, index) => (
              <View key={index} style={styles.eventRow}>
                <View style={styles.eventLeft}>
                  <View style={styles.eventDate}>
                    <Text style={[styles.eventDateText, { color: theme.primary }]}>
                      {formatDate(evento.fecha)}
                    </Text>
                    <Text style={[styles.eventTimeText, { color: theme.subText }]}>
                      {formatTime(evento.horaInicio)} - {formatTime(evento.horaFin)}
                    </Text>
                  </View>
                </View>
                <View style={styles.eventRight}>
                  <Text style={[styles.eventTitle, { color: theme.text }]} numberOfLines={1}>
                    {evento.titulo}
                  </Text>
                  <Text style={[styles.eventUser, { color: theme.subText }]} numberOfLines={1}>
                    {evento.usuarioAsociado?.nombre}
                  </Text>
                  <Text style={[styles.eventSchedule, { color: theme.primary }]} numberOfLines={1}>
                    {evento.horarioComun}
                  </Text>
                </View>
              </View>
            ))}
            
            {upcomingEvents.length > 5 && (
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={[styles.viewMoreText, { color: theme.primary }]}>
                  Ver {upcomingEvents.length - 5} eventos más
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      )}

      {/* Horarios Comunes */}
      {commonSchedules.length > 0 && (
        <Card containerStyle={[styles.schedulesCard, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="schedule" type="material" color={theme.primary} size={24} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Horarios Comunes ({commonSchedules.length})
            </Text>
          </View>
          
          <View style={styles.schedulesList}>
            {commonSchedules.map((horarioComun, index) => (
              <TouchableOpacity
                key={index}
                style={styles.scheduleItem}
                onPress={() => handleCommonSchedulePress(horarioComun)}
                activeOpacity={0.7}
              >
                <View style={styles.scheduleHeader}>
                  <Text style={[styles.scheduleTitle, { color: theme.text }]}>
                    {horarioComun.nombre}
                  </Text>
                  <View style={styles.scheduleHeaderRight}>
                    <SimpleBadge
                      value={`${horarioComun.horarios?.length || 0} horarios`}
                      status="primary"
                      containerStyle={styles.scheduleBadge}
                    />
                    <Icon name="chevron-right" type="material" color={theme.primary} size={20} />
                  </View>
                </View>
                
                {horarioComun.horarios?.slice(0, 2).map((horario, horarioIndex) => (
                  <View key={horarioIndex} style={styles.horarioItem}>
                    <Icon name="person" type="material" color={theme.primary} size={16} />
                    <Text style={[styles.horarioName, { color: theme.subText }]}>
                      {horario.nombre} - {horario.usuarioAsociado?.nombre}
                    </Text>
                  </View>
                ))}
                
                {horarioComun.horarios?.length > 2 && (
                  <Text style={[styles.moreHorarios, { color: theme.subText }]}>
                    +{horarioComun.horarios.length - 2} horarios más
                  </Text>
                )}
                
                <View style={styles.clickHint}>
                  <Text style={[styles.clickHintText, { color: theme.primary }]}>
                    📅 Toca para ver en calendario semanal
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {/* Sin datos */}
      {commonSchedules.length === 0 && !schedulesLoading && (
        <Card containerStyle={[styles.noDataCard, { backgroundColor: theme.card }]}>
          <Icon name="schedule" type="material" color={theme.subText} size={60} />
          <Text style={[styles.noDataText, { color: theme.text }]}>
            No hay horarios comunes disponibles
          </Text>
          <Text style={[styles.noDataSubtext, { color: theme.subText }]}>
            Los horarios comunes aparecerán aquí cuando se programen
          </Text>
        </Card>
      )}
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
  teamHeader: {
    alignItems: 'center',
  },
  teamAvatar: {
    marginBottom: 15,
    elevation: 3,
  },
  teamName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  teamTypeBadge: {
    marginBottom: 10,
  },
  teamSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  teamScheduleText: {
    fontSize: 14,
    marginLeft: 8,
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
  membersCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  membersList: {
    gap: 15,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 6,
  },
  memberBadge: {
    alignSelf: 'flex-start',
  },
  eventsCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  eventsList: {
    gap: 12,
  },
  eventRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  eventLeft: {
    width: 80,
    marginRight: 15,
  },
  eventDate: {
    alignItems: 'center',
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventTimeText: {
    fontSize: 10,
    textAlign: 'center',
  },
  eventRight: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventUser: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventSchedule: {
    fontSize: 11,
    fontWeight: '500',
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  schedulesCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  schedulesList: {
    gap: 15,
  },
  scheduleItem: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  scheduleBadge: {
    marginLeft: 0,
  },
  clickHint: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  clickHintText: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  horarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  horarioName: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  moreHorarios: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 5,
  },
  noTeamCard: {
    borderRadius: 15,
    padding: 40,
    margin: 15,
    alignItems: 'center',
    elevation: 3,
  },
  noTeamText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  noTeamSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  noDataCard: {
    borderRadius: 15,
    padding: 30,
    margin: 15,
    alignItems: 'center',
    elevation: 3,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default EquipoPage;