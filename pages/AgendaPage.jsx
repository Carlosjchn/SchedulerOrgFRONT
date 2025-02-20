import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Agenda from "../components/Agenda.jsx";
import { EventProvider } from "../hooks/useEventContext.jsx";

const PageAgenda = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <EventProvider>
        <Agenda />
      </EventProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 20, // Adds some padding to the ScrollView content
  },
});

export default PageAgenda;
