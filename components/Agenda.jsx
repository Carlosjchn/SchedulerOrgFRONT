import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useEventContext } from '../hooks/useEventContext';

const AgendaComponent = () => {
  const { events, dots, addEvent } = useEventContext();
  const [items, setItems] = useState({});

  // Cargar los eventos al cargar la página
  useEffect(() => {
    // Solo cargar los eventos si hay datos
    if (Object.keys(events).length > 0) {
      setItems(events);
    }
  }, [events]);

  const loadItems = (day) => {
    // Aquí puedes modificar la lógica de carga de datos según tus necesidades
    setItems({
      [day.dateString]: [{ name: 'Event 1', height: 50 }, { name: 'Event 2', height: 50 }],
    });
  };

  const renderItem = (item) => (
    <View style={{ backgroundColor: 'lightblue', margin: 10, padding: 10, borderRadius: 5 }}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      selected={'2025-01-30'}  // Establecer la fecha inicial
      renderItem={renderItem}   // Renderizar cada item
      onDayPress={(day) => {
        console.log('Day pressed', day);
        loadItems(day);  // Cargar los items cuando se presiona un día
      }}
      markedDates={dots}  // Marcar los días con puntos
      theme={{
        calendarBackground: "#FFFFFF",
        textSectionTitleColor: "#CC1100",
        selectedDayBackgroundColor: "#CC1100",
        selectedDayTextColor: "#FFFFFF",
        todayTextColor: "#CC1100",
        dayTextColor: "#1D1A1B",
        dotColor: "#CC1100",
        selectedDotColor: "#FFFFFF",
        arrowColor: "#CC1100",
        monthTextColor: "#1D1A1B",
        indicatorColor: "#CC1100",
        textDayFontFamily: "monospace",
        textMonthFontFamily: "monospace",
        textDayHeaderFontFamily: "monospace",
        textDayFontWeight: "300",
        textMonthFontWeight: "bold",
        textDayHeaderFontWeight: "300",
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
    />
  );
};

export default AgendaComponent;
