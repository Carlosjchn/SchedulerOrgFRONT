import React, { useEffect, } from 'react';
import { View, StyleSheet, ScrollView, } from 'react-native';
import { Card, Text, Avatar, Divider, Icon, Button } from '@rneui/themed';
import { useAuth } from '../hooks/useAuthContext';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const PerfilPage = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { user } = useAuth();
  const { profileData, getUserProfile } = useProfile();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getUserProfile();
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleDeleteUser = async () => {
    Alert.alert(
      "Eliminar Usuario",
      "¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              Alert.alert("Éxito", "Se ha borrado el usuario con éxito");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Card containerStyle={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={styles.avatarContainer}>
          <Avatar
            size={100}
            rounded
            icon={{ name: 'user', type: 'font-awesome' }}
            containerStyle={[styles.avatar, { backgroundColor: theme.primary }]}
          />
          <Text style={[styles.userName, { color: theme.text }]}>{profileData?.nombre}</Text>
          <View style={styles.infoRow}>
            <Icon name="email" type="material" color={theme.primary} size={20} />
            <Text style={[styles.email, { color: theme.subText }]}>{profileData?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="badge" type="material" color={theme.primary} size={20} />
            <Text style={[styles.userType, { color: theme.primary }]}>ID: {user?.token}</Text>
          </View>
        </View>

        <Divider width={4} color={theme.divider} style={styles.divider} />

        {profileData?.equipoAsociado && (
          <Card containerStyle={[styles.teamCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Información del Equipo</Text>
            <View style={styles.teamInfo}>
              <View style={styles.infoRow}>
                <Icon name="groups" type="material" color={theme.primary} size={24} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {profileData.equipoAsociado.nombre}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="category" type="material" color={theme.primary} size={24} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {profileData.equipoAsociado.tipo}
                </Text>
              </View>
            </View>
          </Card>
        )}

        <Card containerStyle={[styles.statsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Horarios</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {profileData?.horariosUser?.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {profileData?.horariosUser?.filter(h => new Date(h.fecha) >= new Date()).length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>Próximos</Text>
            </View>
          </View>
        </Card>
      </Card>
      
      <Button
        title="Eliminar Usuario"
        icon={{ name: 'delete', type: 'material', color: 'white' }}
        buttonStyle={[styles.deleteButton, { backgroundColor: '#CC0000' }]}
        containerStyle={styles.buttonContainer}
        onPress={handleDeleteUser}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  userType: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  divider: {
    marginVertical: 20,
  },
  teamCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  teamInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 15,
  },
  statsCard: {
    borderRadius: 10,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  // Add new button styles
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 30,
  },
  deleteButton: {
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#CC0000',
  }
});

export default PerfilPage;