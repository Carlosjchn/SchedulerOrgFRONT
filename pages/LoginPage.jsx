import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LoginForm from '../components/LoginForm';
import AppLogo from '../components/Logo';
import { Divider } from '@rneui/themed';

const LoginPage = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <AppLogo width={100} height={100} full={true}/>
      </View>
      
      <View style={styles.dividerContainer}>
          <Divider width={4} color="#e63f32" style={styles.divider} />
      </View>

      <LoginForm />

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  container: {
    marginTop: 90,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20
  },
  logoContainer: {
    marginBottom: 5,
    paddingRight: 20,
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