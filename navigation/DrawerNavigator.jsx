import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Inicio from "../pages/Inicio";
import CalendarPage from "../pages/CalendarPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CrearEventoPage from "../pages/CrearEventoPage";
import CustomDrawerContent from "./CustomDrawerContent";
import AppLogo from "../components/Logo";
import PerfilPage from "../pages/PerfilPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";
import EquipoPage from "../pages/EquipoPage";
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import TeamMembersSelectionPage from "../pages/TeamMembersSelectionPage";
import WeeklySchedulePage from "../pages/WeeklySchedulePage";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="Login"
      screenOptions={({ navigation, route }) => ({
        headerShown: !["Login", "Register"].includes(route.name),
        headerTitle: "AutoScheduler",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.primary,
        headerLeft: () => <AppLogo />,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginRight: 15 }}
          >
            <Icon name="menu" size={30} color={theme.text} />
          </TouchableOpacity>
        ),
        drawerPosition: "right",
        drawerStyle: {
          backgroundColor: theme.card,
          width: 250,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          paddingTop: 50,
        },
        drawerLabelStyle: {
          fontSize: 14,
          color: theme.text,
          fontWeight: "700",
        },
        drawerActiveBackgroundColor: isDarkMode ? 'rgba(255, 68, 51, 0.2)' : 'rgba(204, 17, 0, 0.2)',
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.text,
      })}
    >
      <Drawer.Screen
        name="Login"
        component={LoginPage}
        options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Register"
        component={RegisterPage}
        options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' }
        }}
      />

      <Drawer.Screen
        name="Inicio"
        component={Inicio}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Perfil"
        component={PerfilPage}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Equipo"
        component={EquipoPage}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="groups" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Crear Evento"
        component={CrearEventoPage}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="add-circle" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Crear Calendario"
        component={TeamMembersSelectionPage}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="group-add" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="WeeklySchedule"
        component={WeeklySchedulePage}
        options={{
          drawerLabel: "Horario Semanal",
          drawerIcon: ({ color }) => (
            <Icon name="schedule" size={24} color={color} />
          ),
          drawerItemStyle: { display: 'none' }
        }}
      />

      <Drawer.Screen
        name="Calendario"
        component={CalendarPage}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="calendar-today" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Configuración"
        component={ConfiguracionPage}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="settings" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
