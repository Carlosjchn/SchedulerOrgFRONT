// Polyfills for crypto and other missing APIs in React Native
import 'react-native-get-random-values';

// Manual polyfills if needed
if (typeof global.btoa === 'undefined') {
  global.btoa = require('base-64').encode;
}
if (typeof global.atob === 'undefined') {
  global.atob = require('base-64').decode;
}

// Make atob available globally for JWT decoding
if (typeof atob === 'undefined') {
  global.atob = require('base-64').decode;
}

// Minimal crypto polyfill for React Native
if (typeof global.crypto === 'undefined' && typeof window === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    // Basic subtle implementation (will not work for real crypto, but prevents errors)
    subtle: {
      importKey: () => Promise.reject(new Error('Crypto.subtle not available in this environment')),
      encrypt: () => Promise.reject(new Error('Crypto.subtle not available in this environment')),
      decrypt: () => Promise.reject(new Error('Crypto.subtle not available in this environment')),
      sign: () => Promise.reject(new Error('Crypto.subtle not available in this environment')),
      verify: () => Promise.reject(new Error('Crypto.subtle not available in this environment'))
    }
  };
}

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
