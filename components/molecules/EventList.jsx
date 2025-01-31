import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEventContext } from '../../hooks/useEventContext';

const EventList = ({ selectedDate }) => {
  const { events } = useEventContext(); // Accedemos al estado global de eventos

  return (
    <View style={styles.container}>
      {selectedDate ? (
        <>
          <Text style={styles.header}>Eventos para {selectedDate}:</Text>
          {events[selectedDate] && events[selectedDate].length > 0 ? (
            <FlatList
              data={events[selectedDate]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.eventContainer}>
                  <Text style={styles.eventName}>{item.name}</Text>
                  <Text style={styles.eventType}>{item.type}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noEvents}>No hay eventos para esta fecha.</Text>
          )}
        </>
      ) : (
        <Text style={styles.noDate}>Selecciona una fecha para ver los eventos.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1A1B',
    marginBottom: 10,
  },
  eventContainer: {
    backgroundColor: '#F7F7F7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CC1100',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CC1100',
  },
  eventType: {
    fontSize: 14,
    color: '#1D1A1B',
  },
  noEvents: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  noDate: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EventList;
