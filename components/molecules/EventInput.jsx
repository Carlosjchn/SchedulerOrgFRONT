import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet } from 'react-native';
import { useEventContext } from '../../hooks/useEventContext';

const EventInput = ({ selectedDate }) => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('mañana'); // Valor por defecto: mañana
  const { addEvent } = useEventContext(); // Accedemos al contexto global

  const handleSubmit = () => {
    if (selectedDate && eventName.trim()) {
      const eventDetails = { name: eventName, type: eventType };
      addEvent(selectedDate, eventDetails); // Agregar el evento
      setEventName(''); // Limpiar el campo de texto
      setEventType('mañana'); // Restablecer la opción seleccionada
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fecha seleccionada: {selectedDate}</Text>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        placeholder="Escribe un evento"
        style={styles.input}
      />
      <View style={styles.buttonGroup}>
        <Button title="Mañana" onPress={() => setEventType('mañana')} color="#CC1100" />
        <Button title="Tarde" onPress={() => setEventType('tarde')} color="#CC1100" />
        <Button title="Noche" onPress={() => setEventType('noche')} color="#CC1100" />
      </View>
      <Button title="Agregar Evento" onPress={handleSubmit} color="#333" style={styles.addEventButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1A1B',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#CC1100',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonGroup: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addEventButton: {
    backgroundColor: '#CC1100',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default EventInput;
