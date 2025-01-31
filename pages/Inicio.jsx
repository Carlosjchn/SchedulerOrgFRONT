import React from "react";
import { ScrollView, SafeAreaView, StyleSheet, View } from "react-native";
import CalendarComponent from "../components/calendar.jsx";
import TituloComponent from "../components/TituloImagen.jsx";
import DescriptionComponent from "../components/DescriptionView.jsx";
import HorizontalComponent from "../components/ScrollHorizontal.jsx";

const InitPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Titulo Section */}
        <View style={styles.titulo}>
          <TituloComponent />
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <DescriptionComponent />
        </View>

        {/* Horizontal Scroll Section */}
        <View style={styles.section}>
          <HorizontalComponent />
        </View>

        {/* Calendar Section */}
        <View style={styles.section}>
          <CalendarComponent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f7f7f7", // Fondo suave en toda la página
  },
  container: {
    
    paddingBottom: 10, // Reducir espacio inferior
  },
  titulo: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Sombra suave
  },
  section: {
    marginVertical: 10, // Menos espacio entre secciones
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  // Estilos adicionales para las secciones
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1A1B", // Títulos en un color oscuro
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Sombra suave
  },
});

export default InitPage;
