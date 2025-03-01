import React from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';

const HorizontalComponent = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const features = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/6752/6752567.png",
      title: "Gestión de Horarios",
      description: "Organiza tu tiempo de manera eficiente"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
      title: "Calendario Intuitivo",
      description: "Visualización clara de tus actividades"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/9464/9464098.png",
      title: "Notificaciones",
      description: "Mantente al día con tus compromisos"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/8832/8832108.png",
      title: "Multi-dispositivo",
      description: "Accede desde cualquier dispositivo"
    }
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContainer}
    >
      {features.map((feature, index) => (
        <Card key={index} containerStyle={[styles.featureCard, { backgroundColor: theme.card }]}>
          <Image
            source={{ uri: feature.icon }}
            style={styles.image}
          />
          <Text style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</Text>
          <Text style={[styles.featureDescription, { color: theme.subText }]}>{feature.description}</Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  featureCard: {
    width: 160,
    borderRadius: 12,
    marginHorizontal: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  }
});

export default HorizontalComponent;
