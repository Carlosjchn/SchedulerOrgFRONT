import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useSchedules } from '../../hooks/useSchedules';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';
import { useFocusEffect } from '@react-navigation/native';

const AgendaComponent = () => {
  const { schedules, loading, error, getUserSchedules } = useSchedules();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  useFocusEffect(
    React.useCallback(() => {
      getUserSchedules();
      return () => {};
    }, [])
  );
  if (loading) {
    return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
  }
  const renderEmptyData = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
      <Text style={[styles.emptyText, { color: theme.subText }]}>No hay horarios programados para este día</Text>
    </View>
  );
  const renderItem = (item) => (
    <View style={[styles.itemContainer, { backgroundColor: theme.card, borderLeftColor: '#CC1100' }]}>
      <Text style={[styles.itemTitle, { color: theme.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.itemDetail, { color: theme.subText }]}>
        Horario: {item.startTime} - {item.endTime}
      </Text>
      <Text style={[styles.itemDetail, { color: theme.subText }]}>
        Correo: {item.email}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Agenda
        items={schedules}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        selected={new Date().toISOString().split('T')[0]}
        showClosingKnob={true}
        pastScrollRange={24}
        futureScrollRange={24}
        theme={{
          backgroundColor: theme.background,
          calendarBackground: theme.card,
          textSectionTitleColor: '#CC1100',
          selectedDayBackgroundColor: '#CC1100',
          selectedDayTextColor: theme.cardText,
          todayTextColor: '#CC1100',
          dayTextColor: theme.text,
          dotColor: '#CC1100',
          selectedDotColor: theme.cardText,
          arrowColor: '#CC1100',
          monthTextColor: theme.text,
          indicatorColor: '#CC1100',
          agendaDayTextColor: theme.text,
          agendaDayNumColor: theme.text,
          agendaTodayColor: '#CC1100',
          agendaKnobColor: '#CC1100',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
          reservationsBackgroundColor: theme.card,
          agendaBackgroundColor: theme.background,
        }}
        monthNames={[
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]}
        dayNames={['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']}
        dayNamesShort={['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    margin: 10
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center'
  },
  itemContainer: {
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    borderLeftWidth: 4,
    elevation: 2
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  itemDetail: {
    fontSize: 14,
    marginBottom: 4
  }
});

export default AgendaComponent;
