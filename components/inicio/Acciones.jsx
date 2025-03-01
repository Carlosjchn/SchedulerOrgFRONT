import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';


const AccionesRapidas = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Card containerStyle={[styles.container, { backgroundColor: theme.card }]}>
      <Card.Title style={[styles.title, { color: theme.text }]}>Acciones Rápidas</Card.Title>
      <View style={styles.buttonContainer}>
        <Button
          icon={<Icon name="plus" type="feather" color={theme.cardText} size={20} />}
          title="Nuevo Horario"
          onPress={() => navigation.navigate('Crear Horario')}
          buttonStyle={[styles.button, { backgroundColor: theme.primary }]}
          titleStyle={{ color: theme.cardText }}
        />
        <Button
          icon={<Icon name="calendar" type="feather" color={theme.cardText} size={20} />}
          title="Ver Agenda"
          onPress={() => navigation.navigate('Calendario')}
          buttonStyle={[styles.button, { backgroundColor: theme.primary }]}
          titleStyle={{ color: theme.cardText }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    margin: 15,
    padding: 15,
    elevation: 3,
  },
  title: {
    fontSize: 20,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    borderRadius: 8,
    marginVertical: 5,
  },
});

export default AccionesRapidas;