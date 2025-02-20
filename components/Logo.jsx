import { View, Image, Text, StyleSheet } from "react-native";


const AppLogo = ({ width = 50, height = 50, full = false }) => (
  <View style={{ alignItems: "center" }}>
    <Image
      source={{
        uri: "https://cdn-icons-png.freepik.com/256/9499/9499843.png?semt=ais_hybrid",
      }}
      style={{ width, height, marginLeft: 5 }}
    />
    {full && (
      <View>
        <View>
          <Text style={styles.title}> AUTOSCHEDULER</Text>
        </View>
      </View>
    )}
  </View>
);

export default AppLogo;
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e63f32",
    textAlign: "center",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
