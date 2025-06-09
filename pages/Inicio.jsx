import React, { useState, useEffect } from "react";
import { 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions 
} from "react-native";
import { Card, Avatar, Button, Badge } from "@rneui/themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from '../hooks/useThemeContext';
import { useAuth } from '../hooks/useAuthContext';
import { useSchedules } from '../hooks/useEvents';
import { lightTheme, darkTheme } from '../config/theme';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import LinearGradient from 'react-native-linear-gradient'; // Removed for web compatibility

const { width } = Dimensions.get('window');

const InitPage = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { schedules, getUserSchedules, loading } = useSchedules();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userStats, setUserStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    weekEvents: 0
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate user statistics
  useEffect(() => {
    if (schedules) {
      calculateStats();
    }
  }, [schedules]);

  // Load data on focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      await getUserSchedules();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    let totalEvents = 0;
    let todayEvents = 0;
    let upcomingEvents = 0;
    let weekEvents = 0;

    Object.keys(schedules).forEach(date => {
      const events = schedules[date];
      totalEvents += events.length;
      
      if (date === today) {
        todayEvents = events.length;
      }
      
      const eventDate = new Date(date);
      if (eventDate >= now && eventDate <= weekFromNow) {
        weekEvents += events.length;
        if (eventDate > now) {
          upcomingEvents += events.length;
        }
      }
    });

    setUserStats({
      totalEvents,
      todayEvents,
      upcomingEvents,
      weekEvents
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const getNextEvent = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Check today's events first
    if (schedules[today]) {
      const todayEvents = schedules[today].filter(event => {
        const eventTime = new Date(`${today} ${event.startTime}`);
        return eventTime > now;
      });
      
      if (todayEvents.length > 0) {
        todayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
        return { ...todayEvents[0], date: today };
      }
    }
    
    // Check future dates
    const futureDates = Object.keys(schedules)
      .filter(date => date > today)
      .sort();
    
    for (const date of futureDates) {
      if (schedules[date].length > 0) {
        const events = schedules[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
        return { ...events[0], date };
      }
    }
    
    return null;
  };

  const quickActions = [
    {
      id: 'create-event',
      title: 'Crear Evento',
      subtitle: 'Nuevo horario',
      icon: 'event-note',
      iconType: 'material',
      color: theme.primary,
      onPress: () => navigation.navigate('Crear Horario'),
    },
    {
      id: 'view-calendar',
      title: 'Ver Calendario',
      subtitle: 'Agenda completa',
      icon: 'calendar-month',
      iconType: 'material',
      color: theme.success,
      onPress: () => navigation.navigate('Calendario'),
    },
    {
      id: 'team-schedule',
      title: 'Horario Equipo',
      subtitle: 'Colaboración',
      icon: 'people',
      iconType: 'material',
      color: theme.info,
      onPress: () => navigation.navigate('Equipo'),
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      subtitle: 'Configuración',
      icon: 'account-circle',
      iconType: 'material',
      color: theme.warning,
      onPress: () => navigation.navigate('Perfil'),
    },
  ];

  const nextEvent = getNextEvent();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting */}
        <View style={[styles.headerGradient, { backgroundColor: theme.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.userName || 'Usuario'}</Text>
              <Text style={styles.dateText}>
                {currentTime.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Perfil')}
              style={styles.avatarContainer}
            >
              <Avatar
                size={60}
                rounded
                title={user?.userName?.charAt(0) || 'U'}
                containerStyle={styles.avatar}
              />
              <Badge
                status="success"
                containerStyle={styles.statusBadge}
              />
            </TouchableOpacity>
          </View>
          
          {/* Current Time */}
          <View style={styles.timeContainer}>
            <MaterialIcons name="access-time" size={20} color="#FFFFFF" />
            <Text style={styles.currentTime}>
              {currentTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
                         </Text>
           </View>
         </View>

        {/* Statistics Dashboard */}
        <Card containerStyle={[styles.statsCard, { backgroundColor: theme.card }]}>
          <Card.Title style={[styles.cardTitle, { color: theme.text }]}>
            📊 Resumen de Actividades
          </Card.Title>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: theme.primaryLight }]}>
              <MaterialIcons name="event" size={24} color={theme.primary} />
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {userStats.totalEvents}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Total Eventos
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: theme.successLight }]}>
              <MaterialIcons name="today" size={24} color={theme.success} />
              <Text style={[styles.statNumber, { color: theme.success }]}>
                {userStats.todayEvents}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Hoy
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: theme.infoLight }]}>
              <MaterialIcons name="upcoming" size={24} color={theme.info} />
              <Text style={[styles.statNumber, { color: theme.info }]}>
                {userStats.upcomingEvents}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Próximos
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: theme.warningLight }]}>
              <MaterialIcons name="date-range" size={24} color={theme.warning} />
              <Text style={[styles.statNumber, { color: theme.warning }]}>
                {userStats.weekEvents}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Esta Semana
              </Text>
            </View>
          </View>
        </Card>

        {/* Next Event Card */}
        {nextEvent ? (
          <Card containerStyle={[styles.nextEventCard, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
            <View style={styles.nextEventHeader}>
              <MaterialIcons name="schedule" size={24} color={theme.primary} />
              <Text style={[styles.nextEventTitle, { color: theme.text }]}>
                Próximo Evento
              </Text>
            </View>
            <View style={styles.nextEventContent}>
              <Text style={[styles.nextEventName, { color: theme.text }]}>
                📅 {nextEvent.name}
              </Text>
              <Text style={[styles.nextEventDate, { color: theme.textSecondary }]}>
                {new Date(nextEvent.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Text
              <Text style={[styles.nextEventTime, { color: theme.primary }]}>
                🕒 {nextEvent.startTime} - {nextEvent.endTime}
              </Text>
            </View>
          </Card>
        ) : (
          <Card containerStyle={[styles.noEventCard, { backgroundColor: theme.card }]}>
            <View style={styles.noEventContent}>
              <MaterialCommunityIcons name="calendar-check" size={48} color={theme.success} />
              <Text style={[styles.noEventText, { color: theme.text }]}>
                ¡Perfecto! No tienes eventos próximos
              </Text>
              <Text style={[styles.noEventSubtext, { color: theme.textSecondary }]}>
                Es un buen momento para relajarte o planificar algo nuevo
              </Text>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <Card containerStyle={[styles.actionsCard, { backgroundColor: theme.card }]}>
          <Card.Title style={[styles.cardTitle, { color: theme.text }]}>
            ⚡ Acciones Rápidas
          </Card.Title>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionItem, { backgroundColor: `${action.color}15` }]}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name={action.icon} 
                  size={32} 
                  color={action.color} 
                />
                <Text style={[styles.actionTitle, { color: theme.text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* App Features */}
        <Card containerStyle={[styles.featuresCard, { backgroundColor: theme.card }]}>
          <Card.Title style={[styles.cardTitle, { color: theme.text }]}>
            ✨ Características Principales
          </Card.Title>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="calendar-sync" size={24} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                Sincronización automática de calendarios
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="bell-ring" size={24} color={theme.success} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                Notificaciones inteligentes
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="account-group" size={24} color={theme.info} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                Colaboración en tiempo real
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="chart-timeline-variant" size={24} color={theme.warning} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                Análisis de productividad
              </Text>
            </View>
          </View>
        </Card>

        {/* Footer Space */}
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'capitalize',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currentTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  statsCard: {
    borderRadius: 16,
    margin: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  nextEventCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    borderLeftWidth: 4,
  },
  nextEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  nextEventContent: {
    paddingLeft: 32,
  },
  nextEventName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextEventDate: {
    fontSize: 14,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  nextEventTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  noEventCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
  },
  noEventContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noEventText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  noEventSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  featuresCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  footerSpace: {
    height: 20,
  },
});

export default InitPage;
