import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const configurePushNotifications = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
    
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
    });

    return true;
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return false;
  }
};

export const scheduleLocalNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Shows immediately
    });
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

export const scheduleNotification = async (schedule) => {
  const trigger = new Date(schedule.fecha);
  trigger.setHours(parseInt(schedule.horaInicio.split(':')[0]));
  trigger.setMinutes(parseInt(schedule.horaInicio.split(':')[1]));

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Horario Iniciado!",
      body: `Tu horario ${schedule.titulo} ha comenzado`,
      data: { scheduleId: schedule.id },
    },
    trigger,
  });
};