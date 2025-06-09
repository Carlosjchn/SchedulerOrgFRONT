import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';

const HourPickerModal = ({ isVisible, onClose, currentValue, onSave, title, theme }) => {
  const [selectedHour, setSelectedHour] = useState(currentValue);
  const hours = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {title}
          </Text>
          
          <ScrollView style={styles.hoursScroller}>
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.hourOption,
                  {
                    backgroundColor: selectedHour === hour ? theme.primary : 'transparent',
                  }
                ]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text
                  style={[
                    styles.hourText,
                    {
                      color: selectedHour === hour ? theme.cardText : theme.text,
                      fontWeight: selectedHour === hour ? 'bold' : 'normal',
                    }
                  ]}
                >
                  {hour} {hour === 1 ? 'hora' : 'horas'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              onPress={onClose}
              buttonStyle={[styles.button, { backgroundColor: theme.background }]}
              titleStyle={{ color: theme.primary }}
              containerStyle={styles.buttonWrapper}
            />
            <Button
              title="Guardar"
              onPress={() => {
                onSave(selectedHour);
                onClose();
              }}
              buttonStyle={[styles.button, { backgroundColor: theme.primary }]}
              containerStyle={styles.buttonWrapper}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const HoursRangeSlider = ({ minHours, maxHours, onValueChange }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [min, setMin] = useState(minHours || 4);
  const [max, setMax] = useState(maxHours || 8);
  const [showMinPicker, setShowMinPicker] = useState(false);
  const [showMaxPicker, setShowMaxPicker] = useState(false);

  const handleMinChange = (value) => {
    if (value <= max) {
      setMin(value);
      onValueChange(value, max);
    }
  };

  const handleMaxChange = (value) => {
    if (value >= min) {
      setMax(value);
      onValueChange(min, value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldsContainer}>
        <TouchableOpacity
          style={[styles.field, { backgroundColor: theme.background, borderColor: theme.primary }]}
          onPress={() => setShowMinPicker(true)}
        >
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Horas Mínimas</Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>{min}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.field, { backgroundColor: theme.background, borderColor: theme.primary }]}
          onPress={() => setShowMaxPicker(true)}
        >
          <Text style={[styles.fieldLabel, { color: theme.text }]}>Horas Máximas</Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>{max}</Text>
        </TouchableOpacity>
      </View>

      <HourPickerModal
        isVisible={showMinPicker}
        onClose={() => setShowMinPicker(false)}
        currentValue={min}
        onSave={handleMinChange}
        title="Seleccionar Horas Mínimas"
        theme={theme}
      />

      <HourPickerModal
        isVisible={showMaxPicker}
        onClose={() => setShowMaxPicker(false)}
        currentValue={max}
        onSave={handleMaxChange}
        title="Seleccionar Horas Máximas"
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  field: {
    width: '45%',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  hoursScroller: {
    height: 300,
  },
  hourOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  hourText: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
});

export default HoursRangeSlider; 