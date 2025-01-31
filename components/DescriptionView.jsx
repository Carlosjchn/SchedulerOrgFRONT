import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const DescriptionComponent = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://img.freepik.com/vector-premium/calendario-cronometro-calendario-planificacion-vector-icono-plano_186930-949.jpg",
        }}
        style={styles.smallImage}
      />
      <Text style={styles.longText}>
        La forma más fácil de
        <Text style={styles.boldText}> coordinar </Text>
        agendas y 
        <Text style={styles.boldText}> optimizar </Text>
        tu tiempo.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  longText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
    lineHeight: 22, // To make the text easier to read
  },
  smallImage: {
    width: 150,
    height: 150,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#486966", // Optional: Makes the bold text stand out more
  },
});

export default DescriptionComponent;
