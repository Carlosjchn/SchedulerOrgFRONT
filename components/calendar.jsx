import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CalendarBase from './molecules/CalendarBase';
import EventInput from './molecules/EventInput';
import EventList from './molecules/EventList';
import { EventProvider } from '../hooks/useEventContext';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); // Actualizar la fecha seleccionada
  };

  return (
    <EventProvider> {/* Proveedor del contexto */}
      <View>
        <CalendarBase onDayPress={handleDayPress} />
        {selectedDate && <EventInput selectedDate={selectedDate} />}
        <EventList selectedDate={selectedDate} />
      </View>
    </EventProvider>
  );
};

export default CalendarComponent;
