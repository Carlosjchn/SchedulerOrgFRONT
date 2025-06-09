import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { Card, Text, Icon } from '@rneui/themed';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import 'dayjs/locale/es';

const WeeklySchedulePage = ({ route }) => {
  const { scheduleData, teamName, members } = route.params;
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation();
  
  // State to control which users are visible
  const [visibleUsers, setVisibleUsers] = React.useState(new Set());

  const colorMap = useMemo(() => {
    const colors = [
      '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
      '#1ABC9C', '#E67E22', '#34495E', '#E91E63', '#00BCD4'
    ];
    const map = {};
    
    console.log('=== CREATING COLOR MAP ===');
    console.log('Members received for color mapping:', members);
    
    members.forEach((member, index) => {
      // Use the ID that was passed from TeamMembersSelectionPage
      const memberId = member.id;
      const color = colors[index % colors.length];
      
      if (memberId) {
        map[memberId] = color;
        console.log(`Assigned color ${color} to member ${member.nombre} (ID: ${memberId})`);
      } else {
        console.log(`WARNING: Member ${member.nombre} has no ID!`);
      }
    });
    
    console.log('Final color map:', map);
    return map;
  }, [members]);

  // Initialize all users as visible when component mounts
  React.useEffect(() => {
    const allUserIds = members.map(member => member.id).filter(Boolean);
    console.log('=== INITIALIZING VISIBLE USERS ===');
    console.log('Available user IDs:', allUserIds);
    setVisibleUsers(new Set(allUserIds));
  }, [members]);

  const allEvents = useMemo(() => {
    const events = [];
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday

    console.log('=== PROCESSING SCHEDULE DATA ===');
    console.log('Schedule data received:', scheduleData);
    console.log('Members for event processing:', members);
    console.log('Color map for events:', colorMap);

    if (!scheduleData.commonSchedule) {
      console.log('No commonSchedule found in scheduleData');
      return events;
    }

    Object.entries(scheduleData.commonSchedule).forEach(([day, shifts]) => {
      const dayIndex = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].indexOf(day);
      
      console.log(`Processing day: ${day} (index: ${dayIndex}), shifts:`, shifts);
      
      shifts.forEach((shift, shiftIndex) => {
        console.log(`Processing shift ${shiftIndex + 1}:`, shift);
        
        // Find the member that matches this shift's workerId
        const worker = members.find(m => m.id === shift.workerId);
        
        console.log(`Looking for worker with ID: ${shift.workerId}`);
        console.log(`Found worker:`, worker ? { nombre: worker.nombre, id: worker.id } : 'NOT FOUND');
        
        if (!worker) {
          console.log(`WARNING: No worker found for workerId: ${shift.workerId}`);
          console.log('Available member IDs:', members.map(m => ({ nombre: m.nombre, id: m.id })));
        }
        
        const [startHour, startMinute, startSecond] = shift.startTime.split(':');
        const [endHour, endMinute, endSecond] = shift.endTime.split(':');
        
        const eventDate = new Date(startOfWeek);
        eventDate.setDate(startOfWeek.getDate() + dayIndex);
        
        const startDate = new Date(eventDate);
        startDate.setHours(parseInt(startHour), parseInt(startMinute), parseInt(startSecond) || 0);
        
        const endDate = new Date(eventDate);
        endDate.setHours(parseInt(endHour), parseInt(endMinute), parseInt(endSecond) || 0);

        const eventColor = colorMap[shift.workerId] || '#3498DB';
        
        console.log(`Creating event:`, {
          workerName: worker?.nombre || 'Unknown',
          workerId: shift.workerId,
          color: eventColor,
          day: day,
          time: `${shift.startTime}-${shift.endTime}`
        });
        
        events.push({
          title: '', // Completely empty to hide event names
          start: startDate,
          end: endDate,
          color: eventColor,
          workerId: shift.workerId,
          workerName: worker ? worker.nombre : `Trabajador ${shift.workerId}`
        });
      });
    });
    
    console.log('Final events generated:', events.length);
    console.log('Events by worker:', events.reduce((acc, event) => {
      if (!acc[event.workerId]) {
        acc[event.workerId] = { 
          name: event.workerName, 
          color: event.color, 
          count: 0 
        };
      }
      acc[event.workerId].count++;
      return acc;
    }, {}));
    
    return events;
  }, [scheduleData, members, colorMap]);

  // Check if there are events on weekends
  const hasWeekendEvents = useMemo(() => {
    return allEvents.some(event => {
      const dayOfWeek = event.start.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
    });
  }, [allEvents]);

  // Determine calendar mode and work week dates
  const { calendarMode, workWeekDates, isWorkWeekMode } = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    
    if (hasWeekendEvents) {
      console.log('Weekend events detected - using full week mode');
      return {
        calendarMode: 'week',
        workWeekDates: null,
        isWorkWeekMode: false
      };
    } else {
      console.log('No weekend events - using work week mode (Mon-Fri ONLY)');
      console.log('Start of week (Monday):', startOfWeek.toDateString());
      
      // Generate exactly 5 dates: Monday through Friday
      const workDates = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        workDates.push(date);
      }
      
      console.log('Generated work week dates (5 days only):');
      workDates.forEach((date, index) => {
        console.log(`Day ${index + 1}: ${date.toDateString()} (day of week: ${date.getDay()})`);
      });
      
      return {
        calendarMode: 'custom',
        workWeekDates: workDates,
        isWorkWeekMode: true
      };
    }
  }, [hasWeekendEvents]);

  // Filter events based on visible users
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => visibleUsers.has(event.workerId));
  }, [allEvents, visibleUsers]);

  // Process events to handle overlaps
  const processedEvents = useMemo(() => {
    const processed = filteredEvents.map(event => {
      // Find overlapping events for the same time slot
      const overlapping = filteredEvents.filter(otherEvent => {
        if (otherEvent === event) return false;
        
        const eventStart = event.start.getTime();
        const eventEnd = event.end.getTime();
        const otherStart = otherEvent.start.getTime();
        const otherEnd = otherEvent.end.getTime();
        
        // Check if events overlap
        return (eventStart < otherEnd && eventEnd > otherStart) &&
               event.start.getDay() === otherEvent.start.getDay();
      });
      
      const totalOverlapping = overlapping.length + 1;
      const eventIndex = overlapping.findIndex(e => e.workerId < event.workerId);
      const position = eventIndex === -1 ? totalOverlapping - 1 : eventIndex;
      
      return {
        ...event,
        overlaps: totalOverlapping > 1,
        totalOverlapping,
        position,
      };
    });
    
    return processed;
  }, [filteredEvents]);

  // Calculate end hour for the calendar based on events, but always start at 8 AM
  const calendarHours = useMemo(() => {
    if (allEvents.length === 0) {
      return { startHour: 8, endHour: 20 };
    }

    const endTimes = allEvents.map(event => event.end.getHours());
    const latestEnd = Math.max(...endTimes);
    
    // Always start at 8 AM, end with padding after latest event
    const startHour = 8;
    const endHour = Math.min(24, Math.max(20, latestEnd + 1));
    
    return { startHour, endHour };
  }, [allEvents]);

  // Calculate the week date to show (based on events)
  const weekDate = useMemo(() => {
    if (allEvents.length === 0) {
      return new Date();
    }

    // Get the first event's date to determine which week to show
    const firstEventDate = allEvents[0].start;
    return new Date(firstEventDate);
  }, [allEvents]);

  // Get unique users with their info
  const usersList = useMemo(() => {
    console.log('=== CREATING USERS LIST ===');
    const users = [];
    
    members.forEach((member, index) => {
      const memberId = member.id;
      const memberColor = colorMap[memberId];
      
      console.log(`Processing member ${index + 1}:`, {
        nombre: member.nombre,
        email: member.email,
        memberId: memberId,
        memberColor: memberColor
      });
      
      if (memberId && memberColor) {
        users.push({
          id: memberId,
          name: member.nombre,
          color: memberColor,
          email: member.email
        });
        console.log(`✓ Added user: ${member.nombre} with ID: ${memberId} and color: ${memberColor}`);
      } else {
        console.log(`✗ Skipped member ${member.nombre} - Missing ID: ${!memberId}, Missing Color: ${!memberColor}`);
      }
    });
    
    console.log('Final users list created:', users);
    
    // Verify all IDs are unique
    const ids = users.map(u => u.id);
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      console.error('DUPLICATE IDs DETECTED!', { 
        allIds: ids, 
        uniqueIds: uniqueIds,
        duplicates: ids.filter((id, index) => ids.indexOf(id) !== index)
      });
    } else {
      console.log('✓ All user IDs are unique');
    }
    
    return users;
  }, [members, colorMap]);

  const toggleUserVisibility = (userId) => {
    setVisibleUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Card containerStyle={[styles.headerCard, { backgroundColor: theme.card }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon
              name="arrow-back"
              color="white"
              size={18}
            />
            <Text style={[styles.backButtonText, { color: 'white' }]}>
              Volver
            </Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Horario Semanal - {teamName}
            </Text>
            <Text style={[styles.modeIndicator, { color: theme.textSecondary }]}>
              {isWorkWeekMode ? '📅 Lun-Vie' : '📅 Semana completa'}
            </Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>
      </Card>
      
      {/* User Filter Controls */}
      <Card containerStyle={[styles.filterCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>
          Usuarios
        </Text>
        
        <View style={styles.userButtonsContainer}>
          {usersList.map((user, index) => (
            <TouchableOpacity
              key={`${user.id}_${user.name}_${index}`}
              style={[
                styles.userButton,
                {
                  backgroundColor: visibleUsers.has(user.id) ? user.color : 'transparent',
                  borderColor: user.color,
                  opacity: visibleUsers.has(user.id) ? 1 : 0.5
                }
              ]}
              onPress={() => toggleUserVisibility(user.id)}
            >
              <View style={styles.userButtonContent}>
                <View style={[styles.colorIndicator, { backgroundColor: user.color }]} />
                <Text style={[
                  styles.userButtonText,
                  { 
                    color: visibleUsers.has(user.id) ? '#fff' : user.color,
                    fontWeight: visibleUsers.has(user.id) ? 'bold' : 'normal'
                  }
                ]} numberOfLines={1}>
                  {user.name}
                </Text>
                <Icon
                  name={visibleUsers.has(user.id) ? 'visibility' : 'visibility-off'}
                  color={visibleUsers.has(user.id) ? '#fff' : user.color}
                  size={12}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      <View style={styles.calendarContainer}>
        {(() => {
          console.log('=== CALENDAR CONFIGURATION ===');
          console.log('Calendar Mode:', calendarMode);
          console.log('Is Work Week Mode:', isWorkWeekMode);
          console.log('Work Week Dates:', workWeekDates ? workWeekDates.map(d => d.toDateString()) : 'null');
          console.log('WeekDayOrder:', isWorkWeekMode ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 0]);
          console.log('Date prop:', isWorkWeekMode && workWeekDates ? workWeekDates[0].toDateString() : weekDate?.toDateString());
          return null;
        })()}
        <Calendar
          events={processedEvents}
          height={600}
          mode={calendarMode}
          locale="es"
          weekStartsOn={1}
          weekDayOrder={isWorkWeekMode ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 0]}
          scrollOffsetMinutes={480}
          swipeEnabled={true}
          showTime={true}
          timeFormat="HH:mm"
          date={isWorkWeekMode && workWeekDates ? workWeekDates[0] : weekDate}
          dates={isWorkWeekMode ? workWeekDates : undefined}
          hourRowHeight={60}
          startHour={calendarHours.startHour}
          endHour={calendarHours.endHour}
          theme={{
            palette: {
              primary: {
                main: theme.primary,
                contrastText: '#fff',
              },
              gray: {
                100: theme.background,
                200: theme.card,
                300: theme.border,
                500: theme.textSecondary,
                800: theme.text,
              },
            },
          }}
          eventCellStyle={(event) => {
            const baseStyle = {
              backgroundColor: event.color,
              borderRadius: 6,
              borderWidth: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.6)',
              marginVertical: 0.5,
            };

            if (event.overlaps) {
              // When events overlap, make them narrower and position them
              const widthPercentage = 85 / event.totalOverlapping;
              const leftOffset = (event.position * widthPercentage) + (event.position * 2);
              
              return {
                ...baseStyle,
                width: `${widthPercentage}%`,
                marginLeft: `${leftOffset}%`,
                marginRight: 0,
                opacity: 0.85,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                // Add a subtle shadow effect
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              };
            }

            return {
              ...baseStyle,
              marginHorizontal: 1,
              opacity: 0.9,
            };
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    borderRadius: 10,
    padding: 8,
    margin: 6,
    marginBottom: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modeIndicator: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  placeholder: {
    width: 16,
    height: 16,
  },
  filterCard: {
    borderRadius: 10,
    padding: 6,
    margin: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userButton: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
    width: '32%', // 3 buttons per row with space between
  },
  userButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  userButtonText: {
    fontSize: 11,
    flex: 1,
    textAlign: 'center',
  },
  calendarContainer: {
    flex: 1,
    padding: 6,
  }
});

export default WeeklySchedulePage; 