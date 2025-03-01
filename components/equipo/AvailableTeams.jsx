import React from 'react';
import { View } from 'react-native';
import { Card, Text, Icon, Divider, Avatar } from '@rneui/themed';

const AvailableTeams = ({ allTeams, theme, styles }) => {
  return (
    <>
      <Card containerStyle={[styles.noTeamCard, { backgroundColor: theme.card }]}>
        <Icon name="group-off" type="material" color={theme.primary} size={50} />
        <Text style={[styles.noTeamText, { color: theme.subText }]}>
          No perteneces a ningún equipo
        </Text>
      </Card>
      
      {Array.isArray(allTeams) && allTeams.length > 0 && (
        <Card containerStyle={[styles.availableTeamsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Equipos Disponibles
          </Text>
          <Divider width={2} color={theme.divider} style={styles.divider} />
          
          {allTeams.map((team, index) => (
            <View key={index} style={styles.teamRow}>
              <Avatar
                size={40}
                rounded
                icon={{ name: 'groups', type: 'material' }}
                containerStyle={[styles.teamAvatar, { backgroundColor: theme.primary }]}
              />
              <View style={styles.teamInfo}>
                <Text style={[styles.teamName, { color: theme.text }]}>{team.nombre}</Text>
                <Text style={[styles.teamType, { color: theme.subText }]}>{team.tipo}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}
    </>
  );
};

export default AvailableTeams;