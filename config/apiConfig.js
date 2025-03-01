import { Platform } from 'react-native';

const CONFIG = {
  port: 8080,
  webPort: 8081,
  baseIp: '192.168.1.135:'
};
// http://${CONFIG.baseIp}${CONFIG.port}
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return `https://61bf-86-127-227-162.ngrok-free.app/api`;
  }
  return `https://61bf-86-127-227-162.ngrok-free.app/api`;
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
      `http://10.0.2.2:${CONFIG.port}`,
      `https://61bf-86-127-227-162.ngrok-free.app`,
      
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
      register: 'auth/register'
    },
    users: {
      getAll: 'usuarios/all',
      getById: (id) => `usuarios/id/${id}`,
      create: 'usuarios/create',
      update: (id) => `usuarios/update/${id}`,
      delete: (id) => `usuarios/delete/${id}`
    },
    schedules: {
      getByUser: (id) => `horarios/usuario/${id}`,
      getByMonth: (id, month) => `horarios/usuario/${id}/month/${month}`,
      getByDate: (id, date) => `horarios/usuario/${id}/fecha/${date}`,
      create: 'horarios/create',
      update: (id) => `horarios/update/${id}`,
      delete: (id) => `horarios/delete/${id}`
    },
    equipment: {
      getAll: 'equipos/all',
      getByName: (name) => `equipos/nombre/${name}`
    }
  }
};

export { getBaseUrl };
export default API_CONFIG;