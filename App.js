import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import Inicio from "./pages/Inicio";
import CalendarPage from "./pages/CalendarPage";
import AppLogo from "./components/Logo";
import { AboutUs } from "./pages/AboutUsPage";

export default function App() {
  
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer style={styles.container}>
      <Drawer.Navigator
        initialRouteName="Inicio"
        screenOptions={({ navigation }) => ({
          headerTitle: "AutoScheduler",
          headerTitleAlign: "center",
          headerTintColor: "#CC1100", // Rojo para los iconos y el texto
          headerLeft: () => <AppLogo />, // Logo en la izquierda
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginRight: 15 }}
            >
              <Icon name="menu" size={30} color="#000" />
            </TouchableOpacity>
          ),
          drawerPosition: "right", // Posición del drawer a la derecha
          drawerStyle: {
            backgroundColor: "#f7f7f7", // Fondo suave
            width: 250, // Ancho del drawer
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            paddingTop: 50, // Espacio superior
          },
          drawerLabelStyle: {
            fontSize: 14, // Tamaño de fuente más pequeño
            color: "#1D1A1B", // Color de texto de los items
            fontFamily: 'Poppins', // Fuente moderna y más bonita
            fontWeight: '700', // Peso de fuente más gordito
          },
          drawerActiveBackgroundColor: "rgba(204, 17, 0, 0.2)", // Fondo translúcido suave
          drawerActiveTintColor: "#CC1100", // Color de texto para la opción activa
          drawerInactiveTintColor: "#1D1A1B", // Color de texto de las opciones inactivas
        })}
      >
        <Drawer.Screen name="Inicio" component={Inicio} />
        <Drawer.Screen name="Calendario Semanal" component={CalendarPage} />
        <Drawer.Screen name="Sobre nosotros" component={AboutUs} />
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
