import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSettingsStore = create((set, get) => ({
  // User settings
  userName: null,
  isFirstTime: true,

  // Theme settings
  theme: 'light', // 'light' or 'dark'
  primaryColor: '#4A90E2',
  fontFamily: 'default', // 'default', 'serif', 'monospace'

  // Chat history
  chatHistory: [], // Array de mensajes
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
    const updatedHistory = [...get().chatHistory, message];
    set({ chatHistory: updatedHistory });
    await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  },

  clearChatHistory: async () => {
    set({ chatHistory: [] });
    await AsyncStorage.removeItem('chatHistory');
  },

  resetUserName: async () => {
    set({ userName: null, isFirstTime: true });
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.setItem('isFirstTime', 'true');
  },

  saveChatSession: async () => {
    const { chatHistory, chatSessions } = get();
    if (chatHistory.length === 0) return;

    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      messages: chatHistory,
      preview: chatHistory[0]?.text?.substring(0, 50) || 'Chat sin título',
    };

    const updatedSessions = [newSession, ...chatSessions];
    set({ chatSessions: updatedSessions, chatHistory: [] });

    await AsyncStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    await AsyncStorage.removeItem('chatHistory');
  },

  loadChatSession: (sessionId) => {
    const session = get().chatSessions.find((s) => s.id === sessionId);
    if (session) {
      set({ chatHistory: session.messages });
    }
  },

  deleteChatSession: async (sessionId) => {
    const updatedSessions = get().chatSessions.filter((s) => s.id !== sessionId);
    set({ chatSessions: updatedSessions });
    await AsyncStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  },

  // Load all settings from AsyncStorage
  loadSettings: async () => {
    try {
      const [userName, isFirstTime, theme, primaryColor, fontFamily, chatHistory, chatSessions] =
        await Promise.all([
          AsyncStorage.getItem('userName'),
          AsyncStorage.getItem('isFirstTime'),
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('primaryColor'),
          AsyncStorage.getItem('fontFamily'),
          AsyncStorage.getItem('chatHistory'),
          AsyncStorage.getItem('chatSessions'),
        ]);

      set({
        userName: userName || null,
        isFirstTime: isFirstTime !== 'false',
        theme: theme || 'light',
        primaryColor: primaryColor || '#4A90E2',
        fontFamily: fontFamily || 'default',
        chatHistory: chatHistory ? JSON.parse(chatHistory) : [],
        chatSessions: chatSessions ? JSON.parse(chatSessions) : [],
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },
}));

export default useSettingsStore;
