import React from "react";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { Card, Text, Divider } from "@rneui/themed";
import TituloComponent from "../components/inicio/TituloImagen.jsx";
import DescriptionComponent from "../components/inicio/DescriptionView.jsx";
import HorizontalComponent from "../components/inicio/ScrollHorizontal.jsx";
import AccionesRapidas from "../components/inicio/Acciones.jsx";
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';

const InitPage = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={[styles.titleCard, { backgroundColor: theme.card }]}>
          <TituloComponent />
        </Card>

        <Divider width={4} color={theme.divider} style={styles.divider} />

        <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
          <Card.Title style={[styles.sectionTitle, { color: theme.text }]}>
            Descripción
          </Card.Title>
          <Card.Divider width={2} color={theme.divider} />
          <DescriptionComponent />
        </Card>

        <Card containerStyle={[styles.sectionCard, { backgroundColor: theme.card }]}>
          <Card.Title style={[styles.sectionTitle, { color: theme.text }]}>
            Características
          </Card.Title>
          <Card.Divider width={2} color={theme.divider} />
          <HorizontalComponent />
        </Card>

        <AccionesRapidas/>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingVertical: 15,
  },
  titleCard: {
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 15,
    elevation: 3,
  },
  sectionCard: {
    borderRadius: 15,
    padding: 15,
    margin: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    marginTop: 15,
    marginHorizontal: 15,
  },
});

export default InitPage;
