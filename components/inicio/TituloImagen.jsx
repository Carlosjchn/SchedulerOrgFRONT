import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useThemeContext';

const TituloComponent = () => {
  const { isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>ORGANIZA TU TIEMPO</Text>
      <Image 
        source={{uri: 'https://cdn-icons-png.flaticon.com/512/9823/9823605.png'}} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: '#000',
  },
  titleDark: {
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
  },
});

export default TituloComponent;
