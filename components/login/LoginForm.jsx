import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuthContext";
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';

const LoginForm = () => {
  const navigation = useNavigation();
  const { login, loading, error, user, isInitialized } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicio' }],
      });
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'El sistema de autenticación se está inicializando. Por favor, espere un momento.');
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert('Error', 'Credenciales inválidas');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          placeholder="Usuario o Email"
          placeholderTextColor={theme.subText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          placeholder="Contraseña"
          placeholderTextColor={theme.subText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
        <TouchableOpacity 
          style={[
            styles.button, 
            isLoading && styles.buttonDisabled, 
            { backgroundColor: isLoading ? theme.disabled : theme.primary }
          ]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.cardText} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.cardText }]}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: theme.subText }]}>¿No tienes cuenta? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={[
              styles.registerLink, 
              { color: theme.primary, opacity: isLoading ? 0.7 : 1 }
            ]}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    width: undefined,
    paddingTop: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    width: 300,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    height: 55,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoginForm;
