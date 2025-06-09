import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Overlay, Text, Input, Button, Icon } from '@rneui/themed';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DEFAULT_TIME = { horaInicio: '08:00:00', horaFin: '17:00:00' };
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = ['00', '15', '30', '45'];

const TimePickerModal = ({ isVisible, onClose, currentTime, onSave, type, theme }) => {
  const [selectedHour, setSelectedHour] = useState(parseInt(currentTime.split(':')[0]));
  const [selectedMinute, setSelectedMinute] = useState(currentTime.split(':')[1]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.timePickerOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.timePickerContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.timePickerTitle, { color: theme.text }]}>
            Select {type === 'start' ? 'Start' : 'End'} Time
          </Text>
          
          <View style={styles.timePickerContainer}>
            <View style={styles.timeColumn}>
              <Text style={[styles.timeColumnTitle, { color: theme.textSecondary }]}>Hour</Text>
              <ScrollView style={styles.timeScroller}>
                {HOURS.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeOption,
                      {
                        backgroundColor: selectedHour === hour ? theme.primary : 'transparent',
                      }
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: selectedHour === hour ? theme.cardText : theme.text,
                          fontWeight: selectedHour === hour ? 'bold' : 'normal',
                        }
                      ]}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.timeColumn}>
              <Text style={[styles.timeColumnTitle, { color: theme.textSecondary }]}>Minute</Text>
              <ScrollView style={styles.timeScroller}>
                {MINUTES.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timeOption,
                      {
                        backgroundColor: selectedMinute === minute ? theme.primary : 'transparent',
                      }
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: selectedMinute === minute ? theme.cardText : theme.text,
                          fontWeight: selectedMinute === minute ? 'bold' : 'normal',
                        }
                      ]}
                    >
                      {minute}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.timePickerButtons}>
            <Button
              title="Cancelar"
              onPress={onClose}
              buttonStyle={[styles.timePickerButton, { 
                backgroundColor: 'transparent',
                borderColor: theme.primary,
                borderWidth: 2,
                minHeight: 45,
              }]}
              titleStyle={[styles.buttonText, { 
                color: theme.primary,
                fontWeight: 'bold',
                fontSize: 16,
              }]}
              containerStyle={styles.timePickerButtonContainer}
            />
            <Button
              title="Guardar"
              onPress={() => {
                onSave(`${selectedHour.toString().padStart(2, '0')}:${selectedMinute}:00`);
                onClose();
              }}
              buttonStyle={[styles.timePickerButton, { 
                backgroundColor: theme.primary,
                minHeight: 45,
              }]}
              titleStyle={[styles.buttonText, { 
                color: theme.cardText,
                fontWeight: 'bold',
                fontSize: 16,
              }]}
              containerStyle={styles.timePickerButtonContainer}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const NumberPickerModal = ({ isVisible, onClose, currentValue, onSave, min, max, title, theme }) => {
  const [selectedValue, setSelectedValue] = useState(currentValue);
  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.timePickerOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.timePickerContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.timePickerTitle, { color: theme.text }]}>
            {title}
          </Text>
          
          <View style={styles.numberPickerContainer}>
            <ScrollView style={styles.numberScroller}>
              {values.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.timeOption,
                    {
                      backgroundColor: selectedValue === value ? theme.primary : 'transparent',
                    }
                  ]}
                  onPress={() => setSelectedValue(value)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: selectedValue === value ? theme.cardText : theme.text,
                        fontWeight: selectedValue === value ? 'bold' : 'normal',
                      }
                    ]}
                  >
                    {value} horas
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timePickerButtons}>
            <Button
              title="Cancelar"
              onPress={onClose}
              buttonStyle={[styles.timePickerButton, { 
                backgroundColor: 'transparent',
                borderColor: theme.primary,
                borderWidth: 2,
                minHeight: 45,
              }]}
              titleStyle={[styles.buttonText, { 
                color: theme.primary,
                fontWeight: 'bold',
                fontSize: 16,
              }]}
              containerStyle={styles.timePickerButtonContainer}
            />
            <Button
              title="Guardar"
              onPress={() => {
                onSave(selectedValue);
                onClose();
              }}
              buttonStyle={[styles.timePickerButton, { 
                backgroundColor: theme.primary,
                minHeight: 45,
              }]}
              titleStyle={[styles.buttonText, { 
                color: theme.cardText,
                fontWeight: 'bold',
                fontSize: 16,
              }]}
              containerStyle={styles.timePickerButtonContainer}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TimeRangeSelector = ({ day, timeRange, onTimeChange, theme }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  return (
    <View style={styles.timeRangeContainer}>
      <View style={styles.timeButtonsContainer}>
        <TouchableOpacity 
          style={[styles.timeButton, { backgroundColor: theme.background, borderColor: theme.primary }]}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={[styles.timeText, { color: theme.text }]}>
            {timeRange.horaInicio.slice(0, 5)}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.timeText, { color: theme.text, marginHorizontal: 5 }]}>-</Text>
        
        <TouchableOpacity 
          style={[styles.timeButton, { backgroundColor: theme.background, borderColor: theme.primary }]}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={[styles.timeText, { color: theme.text }]}>
            {timeRange.horaFin.slice(0, 5)}
          </Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        isVisible={showStartPicker}
        onClose={() => setShowStartPicker(false)}
        currentTime={timeRange.horaInicio}
        onSave={(time) => onTimeChange({ ...timeRange, horaInicio: time })}
        type="start"
        theme={theme}
      />

      <TimePickerModal
        isVisible={showEndPicker}
        onClose={() => setShowEndPicker(false)}
        currentTime={timeRange.horaFin}
        onSave={(time) => onTimeChange({ ...timeRange, horaFin: time })}
        type="end"
        theme={theme}
      />
    </View>
  );
};

const DayScheduleSection = ({ title, days, onDayToggle, selectedDays, onTimeChange, theme }) => {
  return (
    <View style={styles.scheduleSection}>
      <Text style={[styles.scheduleSectionTitle, { color: theme.text }]}>{title}</Text>
      <View style={styles.daysContainer}>
        {DAYS.map(day => (
          <View key={day} style={styles.dayCard}>
            <TouchableOpacity
              style={[
                styles.dayToggle,
                { 
                  backgroundColor: selectedDays[day] ? theme.primary : theme.background,
                  borderColor: theme.primary
                }
              ]}
              onPress={() => onDayToggle(day)}
            >
              <Text style={[
                styles.dayText,
                { color: selectedDays[day] ? theme.cardText : theme.text }
              ]}>
                {day.slice(0, 3)}
              </Text>
              <Icon
                name={selectedDays[day] ? 'check-circle' : 'circle-outline'}
                type="material-community"
                color={selectedDays[day] ? theme.cardText : theme.primary}
                size={20}
              />
            </TouchableOpacity>
            {selectedDays[day] && (
              <TimeRangeSelector
                day={day}
                timeRange={days[day] || DEFAULT_TIME}
                onTimeChange={(time) => onTimeChange(day, time)}
                theme={theme}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const UserSettingsModal = ({ isVisible, onClose, user, onSaveSettings }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [showHoursPerWeekPicker, setShowHoursPerWeekPicker] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({
    diasObligatorios: false,
    diasRestringidos: false,
    diasPreferidos: false,
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setSectionsVisible({
        diasObligatorios: false,
        diasRestringidos: false,
        diasPreferidos: false,
      });
      setShowHoursPerWeekPicker(false);
    }
  }, [isVisible]);

  const [settings, setSettings] = useState({
    id: user?.id || user.id,
    nombre: user.nombre,
    horarioGeneral: {
      diasObligatorios: user.horarioGeneral?.diasObligatorios || {},
      horasSemanales: user.horarioGeneral?.horasSemanales || 40
    },
    preferencias: {
      dias: user.preferencias?.dias || {}
    },
    restricciones: {
      dias: user.restricciones?.dias || {}
    }
  });

  // Reset settings when user changes
  useEffect(() => {
    setSettings({
      id: user?.id || user.id,
      nombre: user.nombre,
      horarioGeneral: {
        diasObligatorios: user.horarioGeneral?.diasObligatorios || {},
        horasSemanales: user.horarioGeneral?.horasSemanales || 40
      },
      preferencias: {
        dias: user.preferencias?.dias || {}
      },
      restricciones: {
        dias: user.restricciones?.dias || {}
      }
    });
  }, [user]);

  const toggleSection = (section) => {
    setSectionsVisible(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    onSaveSettings(user.email, settings);
    onClose();
  };

  const handleDayToggle = (section, day) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (section === 'diasObligatorios') {
        if (newSettings.horarioGeneral.diasObligatorios[day]) {
          delete newSettings.horarioGeneral.diasObligatorios[day];
        } else {
          newSettings.horarioGeneral.diasObligatorios[day] = DEFAULT_TIME;
        }
      } else if (section === 'preferencias') {
        if (newSettings.preferencias.dias[day]) {
          delete newSettings.preferencias.dias[day];
        } else {
          newSettings.preferencias.dias[day] = DEFAULT_TIME;
        }
      } else if (section === 'restricciones') {
        if (newSettings.restricciones.dias[day]) {
          delete newSettings.restricciones.dias[day];
        } else {
          newSettings.restricciones.dias[day] = DEFAULT_TIME;
        }
      }
      return newSettings;
    });
  };

  const handleTimeChange = (section, day, time) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (section === 'diasObligatorios') {
        newSettings.horarioGeneral.diasObligatorios[day] = time;
      } else if (section === 'preferencias') {
        newSettings.preferencias.dias[day] = time;
      } else if (section === 'restricciones') {
        newSettings.restricciones.dias[day] = time;
      }
      return newSettings;
    });
  };

  const handleHoursPerWeekChange = (hours) => {
    setSettings(prev => ({
      ...prev,
      horarioGeneral: {
        ...prev.horarioGeneral,
        horasSemanales: hours
      }
    }));
  };

  const SectionHeader = ({ title, isVisible, onToggle }) => (
    <TouchableOpacity 
      style={[styles.sectionHeader, { backgroundColor: theme.background }]} 
      onPress={onToggle}
    >
      <Text style={[styles.sectionHeaderText, { color: theme.text }]}>{title}</Text>
      <Icon
        name={isVisible ? 'chevron-up' : 'chevron-down'}
        type="material-community"
        color={theme.text}
        size={24}
      />
    </TouchableOpacity>
  );

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={[styles.overlay, { backgroundColor: theme.card }]}
    >
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>
          Configuración de Horario para {user.nombre}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Horas Semanales</Text>
          <View style={styles.weeklyHoursContainer}>
            <TouchableOpacity
              style={[styles.hoursButton, { backgroundColor: theme.background, borderColor: theme.primary }]}
              onPress={() => setShowHoursPerWeekPicker(true)}
            >
              <Text style={[styles.hoursText, { color: theme.text }]}>
                {settings.horarioGeneral.horasSemanales} horas/semana
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="Días Obligatorios"
            isVisible={sectionsVisible.diasObligatorios}
            onToggle={() => toggleSection('diasObligatorios')}
          />
          {sectionsVisible.diasObligatorios && (
            <DayScheduleSection
              title=""
              days={settings.horarioGeneral.diasObligatorios}
              onDayToggle={(day) => handleDayToggle('diasObligatorios', day)}
              selectedDays={Object.keys(settings.horarioGeneral.diasObligatorios).reduce((acc, day) => ({
                ...acc,
                [day]: true
              }), {})}
              onTimeChange={(day, time) => handleTimeChange('diasObligatorios', day, time)}
              theme={theme}
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="Días Restringidos"
            isVisible={sectionsVisible.diasRestringidos}
            onToggle={() => toggleSection('diasRestringidos')}
          />
          {sectionsVisible.diasRestringidos && (
            <DayScheduleSection
              title=""
              days={settings.restricciones.dias}
              onDayToggle={(day) => handleDayToggle('restricciones', day)}
              selectedDays={Object.keys(settings.restricciones.dias).reduce((acc, day) => ({
                ...acc,
                [day]: true
              }), {})}
              onTimeChange={(day, time) => handleTimeChange('restricciones', day, time)}
              theme={theme}
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader 
            title="Días Preferidos"
            isVisible={sectionsVisible.diasPreferidos}
            onToggle={() => toggleSection('diasPreferidos')}
          />
          {sectionsVisible.diasPreferidos && (
            <DayScheduleSection
              title=""
              days={settings.preferencias.dias}
              onDayToggle={(day) => handleDayToggle('preferencias', day)}
              selectedDays={Object.keys(settings.preferencias.dias).reduce((acc, day) => ({
                ...acc,
                [day]: true
              }), {})}
              onTimeChange={(day, time) => handleTimeChange('preferencias', day, time)}
              theme={theme}
            />
          )}
        </View>

        <NumberPickerModal
          isVisible={showHoursPerWeekPicker}
          onClose={() => setShowHoursPerWeekPicker(false)}
          currentValue={settings.horarioGeneral.horasSemanales}
          onSave={handleHoursPerWeekChange}
          min={20}
          max={40}
          title="Seleccionar Horas Semanales"
          theme={theme}
        />

        <View style={[styles.buttonContainer, {
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingTop: 15,
          marginTop: 20,
        }]}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancelar"
              onPress={onClose}
              buttonStyle={[styles.button, { 
                backgroundColor: 'transparent',
                borderColor: theme.primary,
                borderWidth: 2,
                elevation: 0,
                shadowOpacity: 0,
              }]}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={{ color: theme.primary, fontWeight: 'bold' }}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Guardar"
              onPress={handleSave}
              buttonStyle={[styles.button, { 
                backgroundColor: theme.primary,
                elevation: 0,
                shadowOpacity: 0,
              }]}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={{ color: theme.cardText, fontWeight: 'bold' }}
            />
          </View>
        </View>
      </ScrollView>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 15,
    padding: 20,
  },
  container: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  weeklyHoursContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hoursButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
  },
  hoursText: {
    fontSize: 18,
    fontWeight: '500',
  },
  scheduleSection: {
    marginBottom: 20,
  },
  scheduleSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  daysContainer: {
    width: '100%',
  },
  dayCard: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeRangeContainer: {
    marginTop: 10,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timePickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContent: {
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
  timePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    width: '40%',
  },
  timeColumnTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  timeScroller: {
    height: 200,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  timePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  timePickerButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timePickerButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: 0,
    margin: 0,
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
  },
  buttonContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberPickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  numberScroller: {
    height: 200,
    width: '60%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserSettingsModal; 