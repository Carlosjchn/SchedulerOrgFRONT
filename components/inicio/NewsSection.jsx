import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon, Divider } from '@rneui/themed';

const NewsSection = () => {
  const news = [
    {
      icon: 'zap',
      title: 'Nueva Versión',
      description: 'Ahora puedes sincronizar con múltiples dispositivos',
    },
    {
      icon: 'gift',
      title: 'Próximamente',
      description: 'Integración con Google Calendar',
    },
  ];

  return (
    <Card containerStyle={styles.container}>
      <Card.Title style={styles.title}>Novedades</Card.Title>
      {news.map((item, index) => (
        <View key={index}>
          <View style={styles.newsItem}>
            <Icon name={item.icon} type="feather" color="#CC1100" size={24} />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
            </View>
          </View>
          {index < news.length - 1 && <Divider style={styles.divider} />}
        </View>
      ))}
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
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  newsContent: {
    marginLeft: 15,
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D1A1B',
  },
  newsDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginVertical: 10,
  },
});

export default NewsSection;