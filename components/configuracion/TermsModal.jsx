import React from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button } from '@rneui/themed';

const TermsModal = ({ isVisible, onClose, theme }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
          <ScrollView style={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Términos de Servicio</Text>
            <Text style={[styles.text, { color: theme.subText }]}>
              1. Uso del Servicio{'\n\n'}
              Esta aplicación está diseñada para facilitar la gestión de equipos y horarios. Al utilizarla, aceptas:
              • Proporcionar información precisa
              • Respetar la privacidad de otros usuarios
              • No realizar acciones maliciosas
              {'\n\n'}
              2. Privacidad{'\n\n'}
              Protegemos tu información personal y solo la utilizamos para:
              • Gestionar tu cuenta
              • Mejorar nuestros servicios
              • Comunicarnos contigo
              {'\n\n'}
              3. Responsabilidades{'\n\n'}
              Como usuario, eres responsable de:
              • Mantener seguras tus credenciales
              • La información que compartes
              • El uso apropiado de la aplicación
            </Text>
          </ScrollView>
          <Button
            title="Cerrar"
            onPress={onClose}
            buttonStyle={[styles.button, { backgroundColor: theme.primary }]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
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
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
  },
});

export default TermsModal;