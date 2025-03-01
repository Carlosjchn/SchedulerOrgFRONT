import React from 'react';
import { Text, StyleSheet } from 'react-native';

const LocationMap = ({ location, theme }) => {
  return (
    <Text style={[styles.infoText, { color: theme.text }]}>
      Ubicación activada (Vista de mapa no disponible en web)
    </Text>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default LocationMap;