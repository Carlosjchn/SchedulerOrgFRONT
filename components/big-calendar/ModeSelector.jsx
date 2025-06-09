import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';

const ModeSelector = ({ mode, setMode }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const modes = ['month', 'week', '3days', 'day', 'schedule'];
  
  const getModeText = (modeOption) => {
    const modeTexts = {
      'month': 'Mes',
      'week': 'Semana',
      '3days': '3 días',
      'day': 'Día',
      'schedule': 'Agenda'
    };
    return modeTexts[modeOption] || modeOption;
  };

  const getFormattedDate = () => {
    const date = new Date();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {mode !== 'schedule' && (
        <Text style={[styles.headerText, { color: theme.text }]}>
          {getFormattedDate()}
        </Text>
      )}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.toggleContainer}
      >
        {modes.map((modeOption) => (
          <TouchableOpacity
            key={modeOption}
            onPress={() => setMode(modeOption)}
            style={[
              styles.modeButton,
              {
                backgroundColor: mode === modeOption ? theme.primary : theme.card,
                borderColor: theme.primary,
              }
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                {
                  color: mode === modeOption ? theme.cardText : theme.text,
                }
              ]}
            >
              {getModeText(modeOption)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modeButton: {
    height: 30,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ModeSelector;