import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import Inicio from "./pages/Inicio";
import CalendarPage from "./pages/AgendaPage";
import AppLogo from "./components/Logo";
import { AboutUs } from "./pages/AboutUsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./hooks/useAuthContext";

export default function App() {
  const Drawer = createDrawerNavigator();

  return (
    <AuthProvider>
      <NavigationContainer style={styles.container}>
        <Drawer.Navigator
          initialRouteName="Login"
          screenOptions={({ navigation, route }) => ({
            headerShown: !['Login', 'Register'].includes(route.name),
            headerTitle: "AutoScheduler",
            headerTitleAlign: "center",
            headerTintColor: "#e63f32",
            headerLeft: () => <AppLogo />,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ marginRight: 15 }}
              >
                <Icon name="menu" size={30} color="#000" />
              </TouchableOpacity>
            ),
            drawerPosition: "right",
            drawerStyle: {
              backgroundColor: "#f7f7f7",
              width: 250,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
              paddingTop: 50,
            },
            drawerLabelStyle: {
              fontSize: 14,
              color: "#1D1A1B",
              fontFamily: 'Poppins',
              fontWeight: '700',
            },
            drawerActiveBackgroundColor: "rgba(204, 17, 0, 0.2)",
            drawerActiveTintColor: "#e63f32",
            drawerInactiveTintColor: "#1D1A1B",
            swipeEnabled: !['Login', 'Register'].includes(route.name),
            drawerItemStyle: {
              display: ['Login', 'Register'].includes(route.name) ? 'none' : 'flex'
            }
          })}
        >
          <Drawer.Screen name="Login" component={LoginPage} />
          <Drawer.Screen name="Register" component={RegisterPage} />
          <Drawer.Screen name="Inicio" component={Inicio} />
          <Drawer.Screen name="Calendario Semanal" component={CalendarPage} />
          <Drawer.Screen name="Sobre nosotros" component={AboutUs} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthProvider>
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
