import React from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../hooks/useThemeContext";
import { lightTheme, darkTheme } from "../../config/theme";

// Configure calendar locale
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ],
  monthNamesShort: [
    "Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.",
    "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."
  ],
  dayNames: [
    "Domingo", "Lunes", "Martes", "Miércoles",
    "Jueves", "Viernes", "Sábado"
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy"
};

LocaleConfig.defaultLocale = "es";

const CustomCalendar = ({ selectedDate, onDateSelect }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useFocusEffect(
    React.useCallback(() => {
      // Reset calendar state when screen is focused
      return () => {
      };
    }, [])
  );

  return (
    <Calendar
      onDayPress={onDateSelect}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: theme.primary },
      }}
      theme={{
        backgroundColor: theme.card,
        calendarBackground: theme.card,
        textSectionTitleColor: theme.primary,
        selectedDayBackgroundColor: theme.primary,
        selectedDayTextColor: theme.cardText,
        todayTextColor: theme.primary,
        dayTextColor: theme.text,
        textDisabledColor: theme.disabled,
        arrowColor: theme.primary,
        monthTextColor: theme.text,
        textMonthFontWeight: "bold",
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 14,
      }}
    />
  );
};

export default CustomCalendar;
