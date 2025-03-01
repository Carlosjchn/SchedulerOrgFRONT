import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Icon } from '@rneui/themed';

const TipsSection = () => {
  const tips = [
    {
      icon: 'lightbulb',
      title: 'Productividad',
      description: 'Programa tus tareas más importantes para las primeras horas del día',
    },
    {
      icon: 'star',
      title: 'Mejores Prácticas',
      description: 'Mantén un horario constante para mejorar tu rutina diaria',
    },
    {
      icon: 'book',
      title: 'Guía Rápida',
      description: 'Utiliza las notificaciones para no olvidar tus compromisos',
    },
  ];

  return (
    <Card containerStyle={styles.container}>
      <Card.Title style={styles.title}>Tips y Consejos</Card.Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tips.map((tip, index) => (
          <Card key={index} containerStyle={styles.tipCard}>
            <Icon name={tip.icon} type="feather" color="#CC1100" size={24} />
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </Card>
        ))}
      </ScrollView>
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
  tipCard: {
    width: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1D1A1B',
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default TipsSection;