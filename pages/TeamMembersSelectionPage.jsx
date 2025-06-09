import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Text, Icon } from '@rneui/themed';
import { useEquipo } from '../hooks/useEquipo';
import { useAuth } from '../hooks/useAuthContext';
import { useTheme } from '../hooks/useThemeContext';
import { lightTheme, darkTheme } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import UserSettingsModal from '../components/horarioEquipos/UserSettingsModal';
import TeamMembersModal from '../components/horarioEquipos/TeamMembersModal';
import HoursRangeSlider from '../components/horarioEquipos/HoursRangeSlider';
import API_CONFIG from '../config/apiConfig';

const MemberConfigSummary = ({ member, settings, theme }) => {
  const countDays = (dias) => Object.keys(dias).length;
  
  const formatTime = (time) => time?.slice(0, 5) || '-';
  
  const renderDaysSummary = (dias) => {
    if (!dias || Object.keys(dias).length === 0) return '-';
    return Object.entries(dias).map(([day, time]) => (
      `${day.slice(0, 3)}: ${formatTime(time.horaInicio)}-${formatTime(time.horaFin)}`
    )).join(', ');
  };

  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Icon name="schedule" color={theme.primary} size={20} />
        <Text style={[styles.summaryText, { color: theme.text }]}>
          {settings?.horarioGeneral?.horasSemanales || 40} horas/semana
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Icon name="event-available" color={theme.primary} size={20} />
        <Text style={[styles.summaryText, { color: theme.text }]}>
          {countDays(settings?.horarioGeneral?.diasObligatorios)} días obligatorios
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Icon name="block" color={theme.primary} size={20} />
        <Text style={[styles.summaryText, { color: theme.text }]}>
          {countDays(settings?.restricciones?.dias)} días restringidos
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Icon name="star" color={theme.primary} size={20} />
        <Text style={[styles.summaryText, { color: theme.text }]}>
          {countDays(settings?.preferencias?.dias)} días preferidos
        </Text>
      </View>

      {settings?.horarioGeneral?.diasObligatorios && Object.keys(settings.horarioGeneral.diasObligatorios).length > 0 && (
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Obligatorios:</Text>
          <Text style={[styles.detailText, { color: theme.text }]}>
            {renderDaysSummary(settings.horarioGeneral.diasObligatorios)}
          </Text>
        </View>
      )}

      {settings?.restricciones?.dias && Object.keys(settings.restricciones.dias).length > 0 && (
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Restringidos:</Text>
          <Text style={[styles.detailText, { color: theme.text }]}>
            {renderDaysSummary(settings.restricciones.dias)}
          </Text>
        </View>
      )}

      {settings?.preferencias?.dias && Object.keys(settings.preferencias.dias).length > 0 && (
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Preferidos:</Text>
          <Text style={[styles.detailText, { color: theme.text }]}>
            {renderDaysSummary(settings.preferencias.dias)}
          </Text>
        </View>
      )}
    </View>
  );
};

const TeamMembersSelectionPage = () => {
  const [showMembersModal, setShowMembersModal] = React.useState(false);
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [confirmedMembers, setConfirmedMembers] = React.useState([]);
  const [selectedUserSettings, setSelectedUserSettings] = React.useState(null);
  const [membersSettings, setMembersSettings] = React.useState({});
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { teamData, loading, error, getTeamByUserId } = useEquipo();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [activityDays, setActivityDays] = React.useState(teamData?.diasActividad || '1111100');
  const [minHours, setMinHours] = React.useState(teamData?.horasMinDiaria || 4);
  const [maxHours, setMaxHours] = React.useState(teamData?.horasMaxDiaria || 8);
  const navigation = useNavigation();

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  React.useEffect(() => {
    if (user?.token) {
      getTeamByUserId(user.token);
    }
  }, [user]);

  const handleMemberSelection = (member) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.email === member.email);
      if (isSelected) {
        return prev.filter(m => m.email !== member.email);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleConfirmSelection = () => {
    if (selectedMembers.length >= 2) {
      setConfirmedMembers([...selectedMembers]);
      setSelectedMembers([]);
      setShowMembersModal(false);
    }
  };

  const handleOpenSettings = (member) => {
    setSelectedUserSettings({
      ...member,
      ...membersSettings[member.email]
    });
  };

  const handleSaveSettings = (email, settings) => {
    setMembersSettings(prev => ({
      ...prev,
      [email]: settings
    }));
  };

  const handleExportJson = async () => {
    setIsGenerating(true);
    
    console.log('=== STARTING EXPORT PROCESS ===');
    console.log('Confirmed Members Raw Data:', confirmedMembers);
    
    // Create unique IDs based on email (guaranteed unique) and index for extra safety
    const mappedMembers = confirmedMembers.map((member, index) => {
      // Create a simple, unique ID based on email
      const emailPrefix = member.email ? member.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') : `User${index + 1}`;
      const uniqueId = `${emailPrefix}_${index + 1}`;
      
      console.log(`Creating ID for member ${index + 1}:`, {
        nombre: member.nombre,
        email: member.email,
        originalId: member.idUsuario,
        newId: uniqueId
      });
      
      return {
        ...member,
        id: uniqueId,
        originalId: member.idUsuario // Keep original ID for reference
      };
    });
    
    console.log('Final Mapped Members with IDs:', mappedMembers.map(m => ({ 
      nombre: m.nombre, 
      id: m.id, 
      email: m.email 
    })));
    
    // Create export data using the same IDs
    const exportData = {
      equipo: {
        idEquipo: teamData?.idEquipo || 12345,
        tipo: teamData?.tipo || 'Comercial',
        nombre: teamData?.nombre || 'Mi Negocio',
        diasActividad: activityDays,
        horaInicioActividad: teamData?.horaInicioAct || '08:00:00',
        horaFinActividad: teamData?.horaFinAct || '17:00:00',
        horasMinDiaria: minHours,
        horasMaxDiaria: maxHours
      },
      scheduleTrabajadores: mappedMembers.map(member => ({
        id: member.id, // Use the same ID we created
        nombre: member.nombre,
        preferencias: {
          dias: membersSettings[member.email]?.preferencias?.dias || {}
        },
        restricciones: {
          dias: membersSettings[member.email]?.restricciones?.dias || {}
        },
        horarioGeneral: {
          diasObligatorios: membersSettings[member.email]?.horarioGeneral?.diasObligatorios || {},
          horasSemanales: membersSettings[member.email]?.horarioGeneral?.horasSemanales || 40
        }
      }))
    };
    
    console.log('Export Data - scheduleTrabajadores IDs:', exportData.scheduleTrabajadores.map(t => ({ 
      nombre: t.nombre, 
      id: t.id 
    })));
    
    try {
      const response = await fetch(`${API_CONFIG.getBaseUrl()}/${API_CONFIG.endpoints.organizer.generateWithOrTools}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('API Response received successfully');
      console.log('Response schedule data structure:', {
        hasCommonSchedule: !!result.commonSchedule,
        scheduleKeys: result.commonSchedule ? Object.keys(result.commonSchedule) : 'none'
      });
      
      // Navigate with the properly mapped members
      navigation.navigate('WeeklySchedule', { 
        scheduleData: result,
        teamName: teamData?.nombre || 'Mi Negocio',
        members: mappedMembers // Pass the members with consistent IDs
      });
      
      return result;
    } catch (error) {
      console.error('Error al generar horarios:', error);
      Alert.alert(
        "Error",
        "No se pudieron generar los horarios. Por favor, inténtelo de nuevo.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDayToggle = (index) => {
    setActivityDays(prev => {
      const days = prev.split('');
      days[index] = days[index] === '1' ? '0' : '1';
      return days.join('');
    });
  };

  const handleHoursChange = (min, max) => {
    setMinHours(min);
    setMaxHours(max);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Card containerStyle={[styles.loadingCard, { backgroundColor: theme.card }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </Card>
      </View>
    );
  }

  if (isGenerating) {
    return (
      <View style={[styles.container, styles.loadingOverlay, { backgroundColor: theme.background }]}>
        <Card containerStyle={[styles.loadingCard, { backgroundColor: theme.card }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Generando horarios...
          </Text>
          <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>
            Por favor espera mientras procesamos la información
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Card containerStyle={[styles.headerCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Información del Equipo
        </Text>
        
        <View style={styles.teamInfoContainer}>
          <View style={styles.teamMainInfo}>
            <View style={styles.teamNameContainer}>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Nombre
                </Text>
                <Text style={[styles.teamName, { color: theme.text }]}>
                  {teamData?.nombre || '-'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Tipo
                </Text>
                <View style={[styles.teamTypeBadge, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.teamTypeText, { color: theme.cardText }]}>
                    {teamData?.tipo || '-'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.timeInfoContainer}>
              <View style={styles.timeInfo}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Inicio de Actividad
                </Text>
                <Text style={[styles.timeValue, { color: theme.text }]}>
                  {teamData?.horaInicioAct || '-'}
                </Text>
              </View>

              <View style={styles.timeInfo}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Fin de Actividad
                </Text>
                <Text style={[styles.timeValue, { color: theme.text }]}>
                  {teamData?.horaFinAct || '-'}
                </Text>
              </View>
            </View>

            <View style={styles.activitySection}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                Días de Actividad
              </Text>
              <View style={styles.daysContainer}>
                {DAYS.map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      {
                        backgroundColor: activityDays[index] === '1' ? theme.primary : theme.background,
                        borderColor: theme.primary,
                      }
                    ]}
                    onPress={() => handleDayToggle(index)}
                  >
                    <Text style={[
                      styles.dayText,
                      { color: activityDays[index] === '1' ? theme.cardText : theme.primary }
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.hoursSection}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                Rango de Horas Diarias
              </Text>
              <HoursRangeSlider
                minHours={minHours}
                maxHours={maxHours}
                onValueChange={handleHoursChange}
                theme={theme}
              />
            </View>
          </View>
        </View>
      </Card>

      <Card containerStyle={[styles.headerCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Selección de Miembros
        </Text>
        
        <Button
          title="Mostrar Miembros del Equipo"
          onPress={() => setShowMembersModal(true)}
          buttonStyle={[styles.mainButton, { backgroundColor: theme.primary }]}
          containerStyle={styles.buttonContainer}
        />
      </Card>

      {error && (
        <Card containerStyle={[styles.errorCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </Card>
      )}

      {confirmedMembers.length > 0 && (
        <Card containerStyle={[styles.confirmedCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Lista de Miembros Seleccionados
          </Text>
          
          {confirmedMembers.map((member) => (
            <View key={member.email} style={[styles.memberCard, { backgroundColor: theme.cardAlt }]}>
              <TouchableOpacity
                style={[styles.confirmedMemberRow, { borderBottomColor: theme.border }]}
                onPress={() => handleOpenSettings(member)}
              >
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: theme.text }]}>
                    {member.nombre}
                  </Text>
                  <Text style={[styles.memberEmail, { color: theme.text }]}>
                    {member.email}
                  </Text>
                </View>
                <Icon
                  name="settings"
                  color={theme.primary}
                  size={24}
                />
              </TouchableOpacity>
              
              {membersSettings[member.email] && (
                <MemberConfigSummary 
                  member={member}
                  settings={membersSettings[member.email]}
                  theme={theme}
                />
              )}
            </View>
          ))}
        </Card>
      )}

      {confirmedMembers.length > 0 && (
        <Card containerStyle={[styles.exportCard, { backgroundColor: theme.card }]}>
          <Button
            title={isGenerating ? "Generando..." : "Exportar Configuración de Horarios"}
            onPress={handleExportJson}
            disabled={isGenerating}
            buttonStyle={[
              styles.exportButton, 
              { 
                backgroundColor: isGenerating ? theme.textSecondary : theme.primary,
                opacity: isGenerating ? 0.6 : 1
              }
            ]}
            containerStyle={styles.exportButtonContainer}
            icon={{
              name: isGenerating ? 'schedule' : 'file-download',
              type: 'material',
              color: 'white',
              size: 20,
            }}
            iconPosition="left"
          />
        </Card>
      )}

      <TeamMembersModal
        isVisible={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={teamData?.miembros || []}
        selectedMembers={selectedMembers}
        onMemberSelect={handleMemberSelection}
        onConfirm={handleConfirmSelection}
      />

      <UserSettingsModal
        isVisible={!!selectedUserSettings}
        onClose={() => setSelectedUserSettings(null)}
        user={selectedUserSettings || {}}
        onSaveSettings={handleSaveSettings}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    borderRadius: 15,
    padding: 20,
    margin: 7,
    elevation: 3,
  },
  loadingCard: {
    borderRadius: 15,
    padding: 30,
    margin: 15,
    alignItems: 'center',
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorCard: {
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },
  confirmedCard: {
    borderRadius: 15,
    padding: 15,
    margin: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  confirmedMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  buttonContainer: {
    marginTop: 10,
  },
  mainButton: {
    borderRadius: 8,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  confirmedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exportButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonContainer: {
    marginTop: 0,
  },
  teamInfoContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  teamMainInfo: {
    width: '100%',
  },
  teamNameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fieldContainer: {
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  teamTypeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  timeInfo: {
    alignItems: 'flex-start',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  activitySection: {
    marginTop: 20,
    width: '100%',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hoursSection: {
    marginTop: 20,
    width: '100%',
  },
  exportCard: {
    borderRadius: 15,
    padding: 15,
    margin: 15,
    marginTop: 10,
  },
  exportButton: {
    borderRadius: 8,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exportButtonContainer: {
    width: '100%',
  },
  memberCard: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  summaryContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
  },
  detailRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default TeamMembersSelectionPage; 