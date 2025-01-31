import React from "react";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import CalendarComponent from "../components/calendar.jsx";
import TituloComponent from "../components/TituloImagen.jsx";
import DescriptionComponent from "../components/DescriptionView.jsx";
import HorizontalComponent from "../components/ScrollHorizontal.jsx";

const PageExample = () => {
  return (
    <SafeAreaView style={styles.safeArea}>  
      <ScrollView contentContainerStyle={styles.container}>   

        {/* First section */}
        <TituloComponent />       
  
        {/* Third section */}
        <DescriptionComponent />

        {/* Fourth section */}
        <HorizontalComponent />

        <CalendarComponent />
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    
    maxWidth:"700px",
    flexGrow: 1,
    padding: 20,
  },
});

export default PageExample;
