import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Divider } from "@rneui/themed";
import { useAuth } from "../hooks/useAuthContext";

const CustomDrawerContent = (props) => {
  const { logout, user, getDecodedUser } = useAuth();
  const [decodedUser, setDecodedUser] = React.useState(null);

  React.useEffect(() => {
    const decodeUserInfo = async () => {
      if (user?.userName) {
        try {
          const decoded = await getDecodedUser(user.userName);
          setDecodedUser(decoded);
        } catch (error) {
          console.warn('Error decoding user info, using fallback:', error.message);
          // Fallback to original user data if decoding fails
          setDecodedUser({ userName: user.userName || user.nombre });
        }
      } else if (user?.nombre) {
        try {
          const decoded = await getDecodedUser(user.nombre);
          setDecodedUser(decoded);
        } catch (error) {
          console.warn('Error decoding user info, using fallback:', error.message);
          // Fallback to original user data if decoding fails
          setDecodedUser({ userName: user.nombre });
        }
      } else if (user) {
        // If user exists but no userName or nombre, set a default
        setDecodedUser({ userName: 'Usuario' });
      }
    };

    if (user) {
      decodeUserInfo();
    }
  }, [user, getDecodedUser]);

  const handleLogout = async () => {
    await logout();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      {user && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.userName}>
            {decodedUser?.userName || user.userName || user.nombre || 'Usuario'}
          </Text>
          <Divider width={4} color="#e63f32" style={styles.divider} />
        </View>
      )}
      <DrawerItemList {...props} />
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CC1100',
  },
  divider: {
    marginTop: 8,
    width: '100%'
  },
  logoutButton: {
    backgroundColor: '#CC1100',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;