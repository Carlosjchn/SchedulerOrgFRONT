import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Dimensions } from 'react-native';
import BigCalendar from '../components/big-calendar/BigCalendar';
import ModeSelector from '../components/big-calendar/ModeSelector';
import { useSchedules } from '../hooks/useEvents';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useFocusEffect } from '@react-navigation/native';

const CalendarPage = () => {
  const [mode, setMode] = useState('month');
  const [calendarHeight, setCalendarHeight] = useState(Dimensions.get('window').height);
  const { schedules, loading, getUserSchedules } = useSchedules();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const updateLayout = () => {
      setCalendarHeight(Dimensions.get('window').height);
    };
    Dimensions.addEventListener('change', updateLayout);
    return () => {
      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', updateLayout);
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadSchedules = async () => {
        await getUserSchedules();
      };
      loadSchedules();
      return () => {};
    }, [])
  );

  const events = Object.entries(schedules).flatMap(([date, dayEvents]) =>
    dayEvents.map(event => ({
      ...event,
      day: date,
    }))
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const calculatedHeight = calendarHeight - 150; // Adjust for header, mode selector, and safe areas

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <ModeSelector mode={mode} setMode={setMode} />
        <View style={styles.calendarContainer}>
          <BigCalendar 
            events={events} 
            mode={mode} 
            height={calculatedHeight}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarPage;