import React from "react";
import { ScrollView, View, Image, StyleSheet } from "react-native";

const HorizontalComponent = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6752/6752567.png",
          }}
          style={styles.image}
        />
        <Image
          source={{
            uri: "https://imgs.search.brave.com/rNKwzRoybAdn8zaOPKlukCAifuxq3rNnpbXxZuEGdgI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni82NDkxLzY0OTE1/NzMucG5nP3NlbXQ9/YWlzX2h5YnJpZA",
          }}
          style={styles.image}
        />
        <Image
          source={{
            uri: "https://cdn-icons-png.freepik.com/256/8384/8384915.png?semt=ais_hybrid",
          }}
          style={styles.image}
        />
        <Image
          source={{
            uri: "https://cdn-icons-png.freepik.com/128/2645/2645932.png",
          }}
          style={styles.image}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingLeft: 5,
  },
  imageContainer: {
    flexDirection: "row",
    
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E8E8E8", // Borde sutil alrededor de las imágenes
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: "#fff", // Fondo blanco para las imágenes
  },
});

export default HorizontalComponent;
