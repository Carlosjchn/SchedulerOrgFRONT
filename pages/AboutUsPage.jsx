import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function AboutUs() {
  return (
    <View style={styles.container}>
      <CalendarComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf4fc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#CC1100',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});
