import { createContext, useContext, useState } from 'react';

// Creamos un contexto para los eventos
const EventContext = createContext();

// Proveedor de contexto
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dots, setDots] = useState({});  // Estado para almacenar los días con puntos

  // Función para agregar un evento a un día
  const addEvent = (date, event) => {
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      if (!newEvents[date]) {
        newEvents[date] = [];
      }
      newEvents[date].push(event);

      // Actualizar los días con puntos
      const newDots = { ...dots };
      newDots[date] = [{ key: 'event', color: 'red', selectedDotColor: 'blue' }];
      setDots(newDots);

      return newEvents;
    });
  };

  // Función para seleccionar una fecha
  const selectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <EventContext.Provider value={{ events, selectedDate, selectDate, addEvent, dots }}>
      {children}
    </EventContext.Provider>
  );
};

// Hook para usar el contexto
export const useEventContext = () => useContext(EventContext);
