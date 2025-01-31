import React, { useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { useEventContext } from '../../hooks/useEventContext';

const CalendarBase = ({ onDayPress }) => {
  const { events, selectedDate, selectDate } = useEventContext();

  const handleDayPress = (day) => {
    selectDate(day.dateString);
    if (onDayPress) {
      onDayPress(day);
    }
  };

  const generateMarkedDates = () => {
    let markedDates = {};

    Object.keys(events).forEach((date) => {
      markedDates[date] = {
        dots: [
          { key: 'event', color: '#CC1100', selectedDotColor: '#FFFFFF' },
        ],
      };
    });

    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#CC1100',
        selectedTextColor: '#FFFFFF',
        // Solo cambiar el color del dot a blanco si ya hay un evento en esa fecha
        dots: events[selectedDate] ? [{ key: 'event', color: '#FFFFFF' }] : [],
      };
    }

    return markedDates;
  };

  return (
    <Calendar
      onDayPress={handleDayPress}
      markedDates={generateMarkedDates()} // Aquí marcamos las fechas con dots
      markingType={'multi-dot'}  // Aseguramos que se usen múltiples dots si es necesario
      theme={{
        calendarBackground: '#FFFFFF',
        textSectionTitleColor: '#CC1100',
        selectedDayBackgroundColor: '#CC1100',
        selectedDayTextColor: '#FFFFFF',
        todayTextColor: '#CC1100',
        dayTextColor: '#1D1A1B',
        dotColor: '#CC1100',
        selectedDotColor: '#FFFFFF', // Este es el color de los dots seleccionados, que será blanco si ya hay un evento
        arrowColor: '#CC1100',
        monthTextColor: '#1D1A1B',
        indicatorColor: '#CC1100',
      }}
    />
  );
};

export default CalendarBase;
