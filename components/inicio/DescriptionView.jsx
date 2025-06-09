import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from '../../hooks/useThemeContext';

const DescriptionComponent = () => {
  const { isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/18218/18218546.png",
        }}
        style={styles.smallImage}
      />
      <Text style={[styles.longText, isDarkMode && styles.longTextDark]}>
        La forma más fácil de
        <Text style={[styles.boldText, isDarkMode && styles.boldTextDark]}> coordinar </Text>
        agendas y 
        <Text style={[styles.boldText, isDarkMode && styles.boldTextDark]}> optimizar </Text>
        tu tiempo.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  longText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
    lineHeight: 22, // To make the text easier to read
  },
  longTextDark: {
    color: "#e0e0e0",
  },
  smallImage: {
    width: 150,
    height: 150,
  },
  boldText: {
    fontWeight: "bold",
    color: "#486966", // Optional: Makes the bold text stand out more
  },
  boldTextDark: {
    color: "#6fa8a5",
  },
});

export default DescriptionComponent;
