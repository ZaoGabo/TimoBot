import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as db from '../services/database';

const useSettingsStore = create((set, get) => ({
  // User settings
  userName: null,
  isFirstTime: true,

  // Theme settings
  theme: 'light', // 'light' or 'dark'
  primaryColor: '#4A90E2',
  fontFamily: 'default', // 'default', 'serif', 'monospace'

  // Chat history
  currentSessionId: null,
  chatHistory: [], // Array de mensajes actuales
  chatSessions: [], // Array de sesiones de chat anteriores

  // Actions
  setUserName: async (name) => {
    set({ userName: name, isFirstTime: false });
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('isFirstTime', 'false');
  },

  setTheme: async (theme) => {
    set({ theme });
    await AsyncStorage.setItem('theme', theme);
  },

  setPrimaryColor: async (color) => {
    set({ primaryColor: color });
    await AsyncStorage.setItem('primaryColor', color);
  },

  setFontFamily: async (font) => {
    set({ fontFamily: font });
    await AsyncStorage.setItem('fontFamily', font);
  },

  addMessage: async (message) => {
    let { currentSessionId } = get();

    // Si no hay sesión activa, crear una nueva
    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      const preview = message.text.substring(0, 50);
      await db.createSession(currentSessionId, new Date().toISOString(), preview);
      set({ currentSessionId });

      // Actualizar lista de sesiones
      const sessions = await db.getSessions();
      set({ chatSessions: sessions });
    }

    // Guardar mensaje en SQLite
    await db.saveMessage(currentSessionId, message);

    // Actualizar estado local
    const updatedHistory = [...get().chatHistory, message];
    set({ chatHistory: updatedHistory });

    // Actualizar lista de sesiones (para reflejar cambios en preview/fecha)
    const sessions = await db.getSessions();
    set({ chatSessions: sessions });
  },

  clearChatHistory: async () => {
    // Esto ahora funciona como "Nuevo Chat" visualmente o "Cerrar Sesión actual"
    set({ chatHistory: [], currentSessionId: null });
  },

  resetUserName: async () => {
    set({ userName: null, isFirstTime: true });
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.setItem('isFirstTime', 'true');
  },

  saveChatSession: async () => {
    // Con SQLite, la sesión ya se guarda automáticamente con cada mensaje.
    // Esta función ahora solo limpia el estado actual para empezar uno nuevo.
    set({ chatHistory: [], currentSessionId: null });
  },

  loadChatSession: async (sessionId) => {
    const messages = await db.getMessages(sessionId);
    set({ currentSessionId: sessionId, chatHistory: messages });
  },

  deleteChatSession: async (sessionId) => {
    await db.deleteSession(sessionId);
    const sessions = await db.getSessions();

    // Si la sesión borrada es la actual, limpiar la vista
    if (get().currentSessionId === sessionId) {
      set({ chatHistory: [], currentSessionId: null });
    }

    set({ chatSessions: sessions });
  },

  // Load all settings
  loadSettings: async () => {
    try {
      // Inicializar DB
      await db.initDatabase();

      const [userName, isFirstTime, theme, primaryColor, fontFamily] =
        await Promise.all([
          AsyncStorage.getItem('userName'),
          AsyncStorage.getItem('isFirstTime'),
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('primaryColor'),
          AsyncStorage.getItem('fontFamily'),
        ]);

      // Cargar sesiones de SQLite
      const sessions = await db.getSessions();

      set({
        userName: userName || null,
        isFirstTime: isFirstTime !== 'false',
        theme: theme || 'light',
        primaryColor: primaryColor || '#4A90E2',
        fontFamily: fontFamily || 'default',
        chatSessions: sessions,
        chatHistory: [], // Empezar vacío o cargar la última sesión si se desea
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },
}));

export default useSettingsStore;
