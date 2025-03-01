import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Switch, Icon } from '@rneui/themed';
import * as Location from 'expo-location';

const LocationPrivacy = ({ theme }) => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setLocationEnabled(true);
      } else {
        setErrorMsg('Permiso de ubicación denegado');
        setLocationEnabled(false);
      }
    } catch (err) {
      setErrorMsg('Error al obtener la ubicación');
      setLocationEnabled(false);
    }
  };

  const handleToggle = async (value) => {
    if (value) {
      await requestLocationPermission();
    } else {
      setLocationEnabled(false);
      setLocation(null);
    }
  };

  return (
    <View>
      <View style={styles.optionRow}>
        <View style={styles.optionInfo}>
          <Icon name="location-on" type="material" color={theme.primary} size={24} />
          <Text style={[styles.optionText, { color: theme.text }]}>Ubicación</Text>
        </View>
        <Switch 
          value={locationEnabled} 
          onValueChange={handleToggle}
          color={locationEnabled ? theme.primary : '#ccc'}
        />
      </View>

      {errorMsg && (
        <Text style={[styles.errorText, { color: 'red' }]}>{errorMsg}</Text>
      )}

      {locationEnabled && location && (
        <View style={styles.locationInfo}>
          {Platform.OS === 'web' ? (
            <Text style={[styles.infoText, { color: theme.text }]}>
              Ubicación activada (Vista de mapa no disponible en web)
            </Text>
          ) : (
            <Text style={[styles.infoText, { color: theme.text }]}>
              Lat: {location.coords.latitude.toFixed(4)}, Long: {location.coords.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  locationInfo: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  }
});

export default LocationPrivacy;