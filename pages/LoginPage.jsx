import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LoginForm from '../components/login/LoginForm';
import AppLogo from '../components/Logo';
import { Divider } from '@rneui/themed';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';

const LoginPage = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

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