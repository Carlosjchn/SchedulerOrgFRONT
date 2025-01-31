import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";

const HorizontalComponent = () => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.horizontalImageContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6752/6752567.png",
          }}
          style={styles.horizontalImage}
        />
        <Image
          source={{
            uri: "https://imgs.search.brave.com/rNKwzRoybAdn8zaOPKlukCAifuxq3rNnpbXxZuEGdgI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni82NDkxLzY0OTE1/NzMucG5nP3NlbXQ9/YWlzX2h5YnJpZA",
          }}
          style={styles.horizontalImage}
        />
        <Image
          source={{
            uri: "https://cdn-icons-png.freepik.com/256/8384/8384915.png?semt=ais_hybrid",
          }}
          style={styles.horizontalImage}
        />
        <Image
          source={{
            uri: "https://cdn-icons-png.freepik.com/128/2645/2645932.png",
          }}
          style={styles.horizontalImage}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalImageContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  horizontalImage: {
    width: 200,
    height: 200,
    marginRight: 20,
  },
});

export default HorizontalComponent;
