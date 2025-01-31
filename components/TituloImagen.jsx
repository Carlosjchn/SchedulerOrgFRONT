import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const TituloComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ORGANIZA TU TIEMPO</Text>
      <Image source={{uri: 'https://www.bizneo.com/blog/wp-content/uploads/2021/08/planificador-de-horarios-laborales-768x431.jpg'}} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 200,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
  },
});

export default TituloComponent;
