import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Icon, Switch, Divider } from '@rneui/themed';
import { useAuth } from '../hooks/useAuthContext';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import TermsModal from '../components/configuracion/TermsModal';
import LocationPrivacy from '../components/configuracion/LocationPrivacy';
import { configurePushNotifications, scheduleLocalNotification } from '../utils/notificationHelper';

const ConfiguracionPage = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const handleEmailToggle = (value) => {
    setEmailEnabled(value);
    if (value) {
      Alert.alert(
        "Notificaciones por Email",
        "Se han activado las notificaciones por email"
      );
    }
  };
  const handlePushToggle = async (value) => {
    if (value) {
      const permissionGranted = await configurePushNotifications();
      if (permissionGranted) {
        setPushEnabled(true);
        // Test notification
        await scheduleLocalNotification(
          "Notificaciones Activadas",
          "Las notificaciones se han configurado correctamente"
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudieron activar las notificaciones. Por favor, verifica los permisos."
        );
        setPushEnabled(false);
      }
    } else {
      setPushEnabled(false);
    }
  };
  const [termsVisible, setTermsVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notificaciones</Text>
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Icon name="notifications" type="material" color={theme.primary} size={24} />
            <Text style={[styles.optionText, { color: theme.text }]}>Notificaciones Push</Text>
          </View>
          <Switch 
            value={pushEnabled} 
            onValueChange={handlePushToggle}
            color={theme.primary}
            style={styles.switch}
          />
        </View>
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Icon name="email" type="material" color={theme.primary} size={24} />
            <Text style={[styles.optionText, { color: theme.text }]}>Notificaciones por Email</Text>
          </View>
          <Switch 
            value={emailEnabled}
            onValueChange={handleEmailToggle}
            color={theme.primary}
            style={styles.switch}
          />
        </View>
      </Card>

      <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Apariencia</Text>
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Icon name="dark-mode" type="material" color={theme.primary} size={24} />
            <Text style={[styles.optionText, { color: theme.text }]}>Modo Oscuro</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme}
            color={theme.primary} 
          />
        </View>
      </Card>

      <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Privacidad</Text>
        <LocationPrivacy theme={theme} />
      </Card>

      <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Legal</Text>
        <View style={styles.optionButton} onTouchEnd={() => setTermsVisible(true)}>
          <View style={styles.optionInfo}>
            <Icon name="description" type="material" color={theme.primary} size={24} />
            <Text style={[styles.optionText, { color: theme.text }]}>Términos de Servicio</Text>
          </View>
          <Icon name="chevron-right" type="material" color={theme.primary} size={24} />
        </View>
      </Card>

      <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Cuenta</Text>
        <View style={styles.optionButton} onTouchEnd={handleLogout}>
          <Icon name="logout" type="material" color={theme.primary} size={24} />
          <Text style={[styles.buttonText, { color: theme.primary }]}>Cerrar Sesión</Text>
        </View>
      </Card>
      <TermsModal 
        isVisible={termsVisible}
        onClose={() => setTermsVisible(false)}
        theme={theme}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionCard: {
    borderRadius: 15,
    padding: 15,
    margin: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scale: 0.9 }],
    marginLeft: 10,
  },
});

export default ConfiguracionPage;