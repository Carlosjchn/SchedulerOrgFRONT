import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from '@rneui/themed';

const StatsSection = () => {
  return (
    <Card containerStyle={styles.container}>
      <Card.Title style={styles.title}>Estadísticas</Card.Title>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="calendar" type="feather" color="#CC1100" size={24} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Horarios</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="clock" type="feather" color="#CC1100" size={24} />
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Horas</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="bell" type="feather" color="#CC1100" size={24} />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Próximos</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D1A1B',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default StatsSection;