import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Overlay, Text, Button, CheckBox } from '@rneui/themed';
import { useTheme } from '../../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../../config/theme';

const TeamMembersModal = ({ 
  isVisible, 
  onClose, 
  members, 
  selectedMembers,
  onMemberSelect,
  onConfirm 
}) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={[styles.overlay, { 
        backgroundColor: theme.card,
        borderColor: theme.border,
        borderWidth: 1,
      }]}
    >
      <View style={styles.container}>
        <View style={[styles.headerContainer, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Seleccionar Miembros del Equipo
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Selecciona al menos 2 miembros
          </Text>
        </View>

        <View style={[styles.membersContainer, { backgroundColor: theme.card }]}>
          {members?.map((member) => (
            <View key={member.email} style={[styles.memberRow, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
              <CheckBox
                checked={selectedMembers.some(m => m.email === member.email)}
                onPress={() => onMemberSelect(member)}
                containerStyle={[styles.checkbox, { backgroundColor: 'transparent' }]}
                checkedColor={theme.primary}
                uncheckedColor={theme.text}
              />
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: theme.text }]}>
                  {member.nombre}
                </Text>
                <Text style={[styles.memberEmail, { color: theme.text }]}>
                  {member.email}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.buttonContainer, { 
          borderTopColor: theme.border,
          borderTopWidth: 1,
          backgroundColor: theme.card,
          paddingTop: 15,
        }]}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancelar"
              onPress={onClose}
              buttonStyle={[styles.button, { 
                backgroundColor: 'transparent',
                borderColor: theme.primary,
                borderWidth: 2,
              }]}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={[styles.buttonTitle, { color: theme.primary }]}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Confirmar"
              onPress={onConfirm}
              disabled={selectedMembers.length < 2}
              buttonStyle={[styles.button, { backgroundColor: theme.primary }]}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={[styles.buttonTitle, { color: theme.cardText }]}
              disabledStyle={[styles.button, { backgroundColor: theme.disabled }]}
              disabledTitleStyle={{ color: theme.cardText }}
            />
          </View>
        </View>

        {selectedMembers.length > 0 && (
          <Text style={[styles.helperText, { color: theme.text }]}>
            {selectedMembers.length === 1 
              ? "Selecciona 1 miembro más" 
              : `${selectedMembers.length} miembros seleccionados`}
          </Text>
        )}
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: '90%',
    borderRadius: 15,
    padding: 0,
    maxHeight: '80%',
  },
  container: {
    width: '100%',
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  membersContainer: {
    maxHeight: '70%',
    paddingHorizontal: 20,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 14,
  },
  checkbox: {
    padding: 0,
    marginLeft: 0,
    marginRight: 10,
    borderWidth: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 15,
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
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 15,
  },
});

export default TeamMembersModal; 