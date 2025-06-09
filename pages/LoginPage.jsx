import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import LoginForm from '../components/login/LoginForm';
import AppLogo from '../components/Logo';
import { Divider } from '@rneui/themed';
import { useTheme } from '../hooks/useThemeContext';
import { useAuth } from '../hooks/useAuthContext';
import { lightTheme, darkTheme } from '../config/theme';

const LoginPage = () => {
  const { isDarkMode } = useTheme();
  const { isInitialized, loading } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const showLoadingScreen = loading && !isInitialized;

  if (showLoadingScreen) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <AppLogo width={100} height={100} full={true}/>
        <ActivityIndicator 
          size="large" 
          color={theme.primary} 
          style={styles.loadingSpinner}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <AppLogo width={100} height={100} full={true}/>
        </View>
        
        <View style={styles.dividerContainer}>
          <Divider width={4} color={theme.primary} style={styles.divider} />
        </View>

        <LoginForm />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 100
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  dividerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  divider: {
    width: '100%'
  }
});

export default LoginPage;