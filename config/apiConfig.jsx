import { Platform } from 'react-native';

const API_CONFIG = {
  port: 8080,
  webPort: 8081,
  
  getBaseUrl : () => {
    if (Platform.OS === 'web') {
      return 'http://localhost:' + port + '/api';
    } else if (Platform.OS === 'android') {
      return 'http://10.0.2.2:' + port + '/api';
    } else {
      return 'http://192.168.41.246:' + port + '/api';
    }
  },
  
  // CORS Configuration
  corsConfig : {
    origin: [
      'http://localhost:' + port,
      'http://localhost:' + webPort,
      'http://192.168.1.10:' + port,
      'http://10.0.2.2:' + port
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
    maxAge: 86400 // 24 hours
  },

  endpoints: {
    auth: {
      login: 'auth/login'
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

export default API_CONFIG;