import { Platform } from 'react-native';

const CONFIG = {
  port: 8080,
  webPort: 8081,
  baseIp: '192.168.41.246'
};
// http://${CONFIG.baseIp}${CONFIG.port}
const getBaseUrl = () => {
  
  return `http://${CONFIG.baseIp}:8080/api`;
};  

const API_CONFIG = {
  port: CONFIG.port,
  webPort: CONFIG.webPort,
  baseIp: CONFIG.baseIp,
  getBaseUrl,
  
  corsConfig: {
    origin: [
      `http://localhost:${CONFIG.port}`,
      `http://localhost:${CONFIG.webPort}`,
      `http://${CONFIG.baseIp}:${CONFIG.port}`,
      `http://${CONFIG.baseIp}:${CONFIG.webPort}`,
      `http://10.0.2.2:${CONFIG.port}`,
      `http://192.168.222.77:8080`,
      'http://192.168.41.246:8080',
      'https://29b9-188-26-223-96.ngrok-free.app'
      
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
    maxAge: 86400
  },

  endpoints: {
    auth: {
      login: 'auth/login',
      register: 'auth/register',
      encryptionKey: 'auth/encryption-key'
    },
    users: {
      getAll: 'usuarios/all',
      getById: (id) => `usuarios/id/${id}`,
      create: 'usuarios/create',
      update: (id) => `usuarios/update/${id}`,
      delete: (id) => `usuarios/delete/${id}`
    },
    events: {
      getByUser: (id) => `eventos/idUsuario/${id}`,
      getByMonth: (id, month) => `eventos/idUsuario/${id}/month/${month}`,
      getByDate: (id, date) => `eventos/idUsuario/${id}/fecha/${date}`,
      create: 'eventos/crear',
      update: (id) => `eventos/update/${id}`,
      delete: (id) => `eventos/delete/${id}`
    },
    teams: {
      getAll: 'equipos/all',
      getByName: (name) => `equipos/nombre/${name}`,
      getByUserId: (userId) => `equipos/usuario/${userId}`,
      create: 'equipos/create',
      update: (id) => `equipos/update/${id}`,
      delete: (id) => `equipos/delete/${id}`,
      addMember: (teamId, userId) => `equipos/${teamId}/add-member/${userId}`,
      removeMember: (teamId, userId) => `equipos/${teamId}/remove-member/${userId}`
    },
    commonSchedules: {
      getByTeamId: (teamId) => `horarios-comunes/equipo/${teamId}`
    },
    organizer: {
      generateWithOrTools: 'organizer/ortools/generar',
      generateWithAI: 'organizer/ai/generar'
    }
  }
};

export { getBaseUrl };
export default API_CONFIG;