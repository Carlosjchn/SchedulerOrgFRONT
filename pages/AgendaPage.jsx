import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Agenda from "../components/agenda/Agenda"; // Updated path
import { EventProvider } from "../hooks/useEventContext.jsx";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useSchedules } from '../hooks/useSchedules';

const AgendaPage = () => {
  const { schedules, loading, error, getUserSchedules } = useSchedules();

  useFocusEffect(
    useCallback(() => {
      console.log('Calendar page focused - Reloading schedules...');
      getUserSchedules();

      return () => {
        console.log('Calendar page unfocused');
      };
    }, [])
  );

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
    padding: 20,
  },
});

export default AgendaPage;
