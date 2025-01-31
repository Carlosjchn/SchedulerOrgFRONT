import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const InputComponent = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleAdd = () => {
    if (selectedOption) {
      setSubmitMessage(`¡${selectedOption} ha sido agregado correctamente!`);
    } else {
      setSubmitMessage('Por favor, selecciona una opción primero.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Escribe aquí" />
      
      {/* Botones para seleccionar una opción */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSelectOption('Día')}
        >
          <Text style={styles.buttonText}>Día</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSelectOption('Tarde')}
        >
          <Text style={styles.buttonText}>Tarde</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSelectOption('Noche')}
        >
          <Text style={styles.buttonText}>Noche</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar mensaje de la opción seleccionada */}
      {selectedOption ? <Text style={styles.message}>Has seleccionado: {selectedOption}</Text> : null}

      {/* Botón para agregar */}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>

      {/* Mostrar mensaje de confirmación */}
      {submitMessage ? <Text style={styles.message}>{submitMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#008CBA',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    color: 'green',
    marginTop: 10,
    fontSize: 16,
  },
});

export default InputComponent;
