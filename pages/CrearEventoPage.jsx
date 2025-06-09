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
import { Button, Divider, Input } from "@rneui/themed";
import { useSchedules } from "../hooks/useEvents";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useTheme } from "../hooks/useThemeContext";
import { lightTheme, darkTheme } from "../config/theme";
import { useFocusEffect } from '@react-navigation/native';
import CustomCalendar from "../components/calendar/calendar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const CrearCalendarioPage = () => {
  const navigation = useNavigation();
  const { createSchedule, loading, error } = useSchedules();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [eventTitle, setEventTitle] = useState("");
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
    if (!eventTitle.trim()) {
      Alert.alert("Error", "Por favor ingrese un título para el evento");
      return;
    }
    
    if (!selectedDate) {
      Alert.alert("Error", "Por favor seleccione una fecha");
      return;
    }

    // Validate that end time is after start time
    const startTimeMinutes = timeToMinutes(startTime);
    const endTimeMinutes = timeToMinutes(endTime);
    
    if (endTimeMinutes <= startTimeMinutes) {
      Alert.alert("Error", "La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    try {
      const result = await createSchedule(selectedDate, startTime, endTime, eventTitle.trim());

      if (result) {
        Alert.alert("✅ Éxito", `Evento "${eventTitle}" creado correctamente para el ${formatDate(selectedDate)}`, [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setEventTitle("");
              setSelectedDate("");
              setStartTime("08:00");
              setEndTime("17:00");
            }
          },
        ]);
      } else {
        Alert.alert("❌ Error", "No se pudo crear el evento");
      }
    } catch (err) {
      Alert.alert("❌ Error", error || "Ocurrió un error al crear el evento");
    }
  };

  const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventDuration = () => {
    if (!startTime || !endTime) return "";
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;
    
    if (duration <= 0) return "";
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}min`;
  };

  useFocusEffect(
    React.useCallback(() => {
        setEventTitle("");
        setSelectedDate("");
        setStartTime("08:00");
        setEndTime("17:00");
        setShowTimePicker(false);
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="event" size={32} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>
            Crear Nuevo Evento
          </Text>
        </View>

        <Divider width={2} color={theme.primary} style={styles.divider} />

        {/* Event Title Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="title" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Título del Evento
            </Text>
          </View>
          <Input
            placeholder="Ingrese el título del evento"
            value={eventTitle}
            onChangeText={setEventTitle}
            containerStyle={styles.inputContainer}
            inputContainerStyle={[styles.inputField, { borderColor: theme.border }]}
            inputStyle={[styles.inputText, { color: theme.text }]}
            placeholderTextColor={theme.textSecondary}
            leftIcon={
              <MaterialCommunityIcons 
                name="format-title" 
                size={20} 
                color={theme.textSecondary} 
              />
            }
            maxLength={100}
            multiline={false}
          />
          {eventTitle.length > 0 && (
            <Text style={[styles.characterCount, { color: theme.textSecondary }]}>
              {eventTitle.length}/100 caracteres
            </Text>
          )}
        </View>

        {/* Calendar Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="calendar-today" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Seleccionar Fecha
            </Text>
          </View>
          <CustomCalendar 
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
          {selectedDate && (
            <View style={styles.selectedDateInfo}>
              <MaterialIcons name="event" size={20} color={theme.success} />
              <Text style={[styles.selectedDateText, { color: theme.success }]}>
                Fecha seleccionada: {formatDate(selectedDate)}
              </Text>
            </View>
          )}
        </View>

        {/* Time Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="access-time" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Horario del Evento
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                { backgroundColor: theme.buttonBackground, borderColor: theme.border }
              ]}
              onPress={() => openTimePicker("start")}
            >
              <MaterialIcons name="schedule" size={20} color={theme.primary} />
              <View style={styles.timeButtonContent}>
                <Text style={[styles.timeButtonLabel, { color: theme.textSecondary }]}>
                  Hora de inicio
                </Text>
                <Text style={[styles.timeButtonValue, { color: theme.text }]}>
                  {startTime}
                </Text>
              </View>
              <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeButton,
                { backgroundColor: theme.buttonBackground, borderColor: theme.border }
              ]}
              onPress={() => openTimePicker("end")}
            >
              <MaterialIcons name="schedule" size={20} color={theme.primary} />
              <View style={styles.timeButtonContent}>
                <Text style={[styles.timeButtonLabel, { color: theme.textSecondary }]}>
                  Hora de fin
                </Text>
                <Text style={[styles.timeButtonValue, { color: theme.text }]}>
                  {endTime}
                </Text>
              </View>
              <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Duration Display */}
          {getEventDuration() && (
            <View style={styles.durationInfo}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={theme.info} />
              <Text style={[styles.durationText, { color: theme.info }]}>
                Duración: {getEventDuration()}
              </Text>
            </View>
          )}
        </View>

        {/* Summary Section */}
        {eventTitle && selectedDate && (
          <View style={[styles.summarySection, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <View style={styles.summaryHeader}>
              <MaterialIcons name="summarize" size={24} color={theme.primary} />
              <Text style={[styles.summaryTitle, { color: theme.text }]}>
                Resumen del Evento
              </Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryEventTitle, { color: theme.text }]}>
                📅 {eventTitle}
              </Text>
              <Text style={[styles.summaryDate, { color: theme.textSecondary }]}>
                {formatDate(selectedDate)}
              </Text>
              <Text style={[styles.summaryTime, { color: theme.textSecondary }]}>
                🕒 {startTime} - {endTime} ({getEventDuration()})
              </Text>
            </View>
          </View>
        )}

        {/* Create Button */}
        <Button
          title={loading ? "Creando evento..." : "✨ Crear Evento"}
          onPress={handleCreateSchedule}
          buttonStyle={[
            styles.createButton, 
            { backgroundColor: theme.primary },
            (!eventTitle || !selectedDate) && { backgroundColor: theme.disabled }
          ]}
          titleStyle={styles.createButtonText}
          disabled={loading || !eventTitle || !selectedDate}
          loading={loading}
          icon={
            !loading ? (
              <MaterialIcons 
                name="add-circle" 
                size={24} 
                color="#FFFFFF" 
                style={{ marginRight: 8 }} 
              />
            ) : null
          }
        />

        {/* Time Picker Modal */}
        <Modal visible={showTimePicker} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <MaterialIcons name="access-time" size={24} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Seleccionar {timeType === "start" ? "hora de inicio" : "hora de fin"}
                </Text>
              </View>
              <ScrollView style={styles.timeList} showsVerticalScrollIndicator={false}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeItem, 
                      { borderBottomColor: theme.border },
                      (timeType === "start" ? startTime : endTime) === time && 
                      { backgroundColor: theme.primaryLight }
                    ]}
                    onPress={() => selectTime(time)}
                  >
                    <MaterialIcons 
                      name="schedule" 
                      size={20} 
                      color={
                        (timeType === "start" ? startTime : endTime) === time 
                          ? theme.primary 
                          : theme.textSecondary
                      } 
                    />
                    <Text style={[
                      styles.timeItemText, 
                      { color: theme.text },
                      (timeType === "start" ? startTime : endTime) === time && 
                      { color: theme.primary, fontWeight: 'bold' }
                    ]}>
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
                icon={
                  <MaterialIcons 
                    name="close" 
                    size={20} 
                    color={theme.text} 
                    style={{ marginRight: 8 }} 
                  />
                }
              />
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 12,
    textAlign: "center",
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputText: {
    fontSize: 16,
    marginLeft: 8,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  selectedDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  timeRow: {
    flexDirection: 'column',
    gap: 12,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  timeButtonLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  timeButtonValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  summarySection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryEventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryDate: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  summaryTime: {
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  timeList: {
    maxHeight: 300,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  timeItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 12,
  },
});

export default CrearCalendarioPage;
