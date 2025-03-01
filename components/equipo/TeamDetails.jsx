import React from 'react';
import { View } from 'react-native';
import { Card, Text, Icon, Divider, Avatar } from '@rneui/themed';

const TeamDetails = ({ teamData, theme, styles }) => {
  if (!teamData) return null;

  return (
    <>
      <Card containerStyle={[styles.headerCard, { backgroundColor: theme.card }]}>
        <View style={styles.teamHeader}>
          <Avatar
            size={80}
            rounded
            icon={{ name: 'groups', type: 'material' }}
            containerStyle={[styles.teamAvatar, { backgroundColor: theme.primary }]}
          />
          <Text style={[styles.teamName, { color: theme.text }]}>{teamData.nombre}</Text>
          <Text style={[styles.teamType, { color: theme.subText }]}>{teamData.tipo}</Text>
        </View>
      </Card>

      {teamData.horaInicioAct && teamData.horaFinAct && (
        <Card containerStyle={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Horario de Actividades</Text>
          <View style={styles.scheduleInfo}>
            <View style={styles.infoRow}>
              <Icon name="schedule" type="material" color={theme.primary} size={24} />
              <Text style={[styles.infoText, { color: theme.text }]}>
                {teamData.horaInicioAct} - {teamData.horaFinAct}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {teamData.miembros && teamData.miembros.length > 0 && (
        <Card containerStyle={[styles.membersCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Miembros del Equipo</Text>
          <Divider width={2} color={theme.divider} style={styles.divider} />
          
          {teamData.miembros.map((miembro, index) => (
            <View key={index} style={styles.memberRow}>
              <Avatar
                size={40}
                rounded
                icon={{ name: 'person', type: 'material' }}
                containerStyle={[styles.memberAvatar, { backgroundColor: theme.primary }]}
              />
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: theme.text }]}>{miembro.nombre}</Text>
                <Text style={[styles.memberRole, { color: theme.subText }]}>{miembro.email}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}
    </>
  );
};

export default TeamDetails;