import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from '@rneui/themed';

const StatusSection = () => {
  return (
    <Card containerStyle={styles.container}>
      <Card.Title style={styles.title}>Estado Actual</Card.Title>
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Icon name="clock" type="feather" color="#CC1100" size={20} />
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Próxima Actividad</Text>
            <Text style={styles.statusValue}>Reunión - 14:00</Text>
          </View>
        </View>
        
        <View style={styles.statusItem}>
          <Icon name="calendar" type="feather" color="#CC1100" size={20} />
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Pendientes Hoy</Text>
            <Text style={styles.statusValue}>3 horarios</Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <Icon name="pie-chart" type="feather" color="#CC1100" size={20} />
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Resumen</Text>
            <Text style={styles.statusValue}>5 horas programadas</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    margin: 15,
    padding: 15,
  },
  title: {
    fontSize: 20,
    color: '#1D1A1B',
  },
  statusContainer: {
    gap: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContent: {
    marginLeft: 15,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1D1A1B',
  },
});

export default StatusSection;