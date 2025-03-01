import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Button, Divider } from "@rneui/themed";
import { useSchedules } from "../hooks/useSchedules";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useTheme } from "../hooks/useThemeContext";
import { lightTheme, darkTheme } from "../config/theme";
import { useFocusEffect } from '@react-navigation/native';
import CustomCalendar from "../components/calendar/calendar";


const CrearCalendarioPage = () => {
  const navigation = useNavigation();
  const { createSchedule, loading, error } = useSchedules();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeType, setTimeType] = useState("start"); // 'start' or 'end'

  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  const onDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const openTimePicker = (type) => {
    setTimeType(type);
    setShowTimePicker(true);
  };

  const selectTime = (time) => {
    if (timeType === "start") {
      setStartTime(time);
    } else {
      setEndTime(time);
    }
    setShowTimePicker(false);
  };
  const handleCreateSchedule = async () => {
    if (!selectedDate) {
      Alert.alert("Error", "Por favor seleccione una fecha");
      return;
    }

    try {
      const result = await createSchedule(selectedDate, startTime, endTime);

      if (result) {
        Alert.alert("Éxito", "Horario creado correctamente", [
          {
            text: "OK",
          },
        ]);
      } else {
        Alert.alert("Error", "No se pudo crear el horario");
      }
    } catch (err) {
      Alert.alert("Error", error || "Ocurrió un error al crear el horario");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
        setSelectedDate("");
        setStartTime("08:00");
        setEndTime("17:00");
        setShowTimePicker(false);
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>
          Crear Nuevo Horario
        </Text>

      <Divider width={4} color={theme.primary} style={styles.divider} />

      <View style={[styles.calendarContainer, { backgroundColor: theme.card }]}>
        <CustomCalendar 
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </View>

      <Divider width={4} color={theme.primary} style={styles.divider} />
      <View style={[styles.timeContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[
            styles.timeButton,
            { backgroundColor: theme.buttonBackground },
          ]}
          onPress={() => openTimePicker("start")}
        >
          <Text style={[styles.timeButtonText, { color: theme.text }]}>
            Hora de inicio: {startTime}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeButton,
            { backgroundColor: theme.buttonBackground },
          ]}
          onPress={() => openTimePicker("end")}
        >
          <Text style={[styles.timeButtonText, { color: theme.text }]}>
            Hora de fin: {endTime}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showTimePicker} transparent={true} animationType="slide">
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Seleccionar{" "}
              {timeType === "start" ? "hora de inicio" : "hora de fin"}
            </Text>
            <ScrollView style={styles.timeList}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeItem, { borderBottomColor: theme.border }]}
                  onPress={() => selectTime(time)}
                >
                  <Text style={[styles.timeItemText, { color: theme.text }]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              title="Cancelar"
              onPress={() => setShowTimePicker(false)}
              buttonStyle={[
                styles.cancelButton,
                { backgroundColor: theme.buttonSecondary },
              ]}
              titleStyle={{ color: theme.text }}
            />
          </View>
        </View>
      </Modal>

      <Button
        title={loading ? "Creando..." : "Crear Horario"}
        onPress={handleCreateSchedule}
        buttonStyle={[styles.createButton, { backgroundColor: theme.primary }]}
        disabled={loading || !selectedDate}
        loading={loading}
      />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 15,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  divider: {
    width: "100%",
  },
  calendarContainer: {
    borderRadius: 15,
    padding: 15,
    margin: 10,
    elevation: 3,
    marginBottom: 5,
  },
  timeContainer: {
    borderRadius: 15,
    padding: 15,
    margin: 10,
    elevation: 3,
  },
  timeButton: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  timeButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  createButton: {
    borderRadius: 8,
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  timeList: {
    maxHeight: 300,
  },
  timeItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  timeItemText: {
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 15,
    borderRadius: 8,
  },
});

export default CrearCalendarioPage;
