import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';
import 'dayjs/locale/es';

const BigCalendar = ({ events, mode, height }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const calendarEvents = events.map(event => ({
    title: event.name,
    start: new Date(`${event.day}T${event.startTime}`),
    end: new Date(`${event.day}T${event.endTime}`),
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Calendar
        events={calendarEvents}
        height={height}
        mode={mode}
        locale="es"
        weekStartsOn={1}
        weekDayOrder={[1, 2, 3, 4, 5, 6, 0]}
        scrollOffsetMinutes={480}
        showTime={true}
        swipeEnabled={true}
        onPressEvent={(event) => console.log(event)}
        style={{
          backgroundColor: theme.card,
        }}
        eventCellStyle={{
          backgroundColor: theme.primary,
          borderRadius: 5,
        }}
        calendarCellStyle={{
          backgroundColor: theme.background,
        }}
        headerContainerStyle={{
          backgroundColor: theme.card,
        }}
        modeOptions={{
          custom: {
            type: 'day',
            dayCount: 3,
            weekStartsOn: 1,
            weekEndsOn: 0,
          },
          day: {
            weekStartsOn: 1,
            weekEndsOn: 0,
          },
          week: {
            weekStartsOn: 1,
            weekEndsOn: 0,
          },
          month: {
            weekStartsOn: 1,
            weekEndsOn: 0,
          },
          schedule: {
            showTime: true,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BigCalendar;