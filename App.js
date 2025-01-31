import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import Inicio from "./pages/Inicio";
import CalendarPage from "./pages/CalendarPage";
import AppLogo from "./components/Logo";

export default function App() {
  
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer style={styles.container}>
      <Drawer.Navigator
        initialRouteName="Inicio"
        screenOptions={({ navigation }) => ({
          headerTitle: "AutoScheduler", // Muestra el logo en la barra de navegación
          headerTitleAlign: "center",
          headerTintColor: "#CC1100", // Muestra el logo en la barra de navegación
          headerLeft: () => <AppLogo />, // Llama al componente AppLogo correctamente
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginRight: 15 }}
            >
              <Icon name="menu" size={30} color="#000" />
            </TouchableOpacity>
          ),
          drawerPosition: "right",
        })}
      >
        <Drawer.Screen name="Inicio" component={Inicio} />
        <Drawer.Screen name="Calendario Semanal" component={CalendarPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
