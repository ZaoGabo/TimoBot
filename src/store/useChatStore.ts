import { create } from 'zustand';
import * as db from '../services/database';
import type { ChatStore, Message } from '../types';

const useChatStore = create<ChatStore>((set, get) => ({
    // Chat history
    currentSessionId: null,
    chatHistory: [], // Array de mensajes actuales
    chatSessions: [], // Array de sesiones de chat anteriores

    // Actions
    addMessage: async (message: Message) => {
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

    saveChatSession: async () => {
        // Con SQLite, la sesión ya se guarda automáticamente con cada mensaje.
        // Esta función ahora solo limpia el estado actual para empezar uno nuevo.
        set({ chatHistory: [], currentSessionId: null });
    },

    loadChatSession: async (sessionId: string) => {
        const messages = await db.getMessages(sessionId);
        set({ currentSessionId: sessionId, chatHistory: messages });
    },

    deleteChatSession: async (sessionId: string) => {
        await db.deleteSession(sessionId);
        const sessions = await db.getSessions();

        // Si la sesión borrada es la actual, limpiar la vista
        if (get().currentSessionId === sessionId) {
            set({ chatHistory: [], currentSessionId: null });
        }

        set({ chatSessions: sessions });
    },

    // Initialize chat store
    initializeChatStore: async () => {
        try {
            // Inicializar DB
            await db.initDatabase();

            // Cargar sesiones de SQLite
            const sessions = await db.getSessions();

            set({
                chatSessions: sessions,
                chatHistory: [], // Empezar vacío o cargar la última sesión si se desea
                currentSessionId: null,
            });
        } catch (error) {
            console.error('Error initializing chat store:', error);
        }
    },
}));

export default useChatStore;
