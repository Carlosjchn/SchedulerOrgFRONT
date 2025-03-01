import { Text, View, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useAuth } from "./hooks/useAuthContext";
import { AuthProvider } from "./hooks/useAuthContext";
import { Divider } from "@rneui/themed";
import DrawerNavigator from './navigation/DrawerNavigator';
import { ThemeProvider } from "./hooks/useThemeContext";


if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    body {
      overscroll-behavior-y: none;
      position: fixed;
      width: 100%;
      height: 100%;
    }
    #root {
      height: 100%;
    }
  `;
  document.head.appendChild(style);
}


const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: Platform.OS === 'web' ? '90vh' : '100%',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: '#CC1100',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CC1100',
  },
  divider: {
    marginTop: 8,
    width: '100%'
  }
});

export default App;
