// Type definitions for TimoBot

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
}

export interface Session {
    id: string;
    title: string;
    date: string;
    preview: string;
}

export type Theme = 'light' | 'dark';

export type FontFamily = 'default' | 'serif' | 'monospace';

export interface ConversationMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Store types
export interface ThemeStore {
    theme: Theme;
    primaryColor: string;
    fontFamily: FontFamily;
    setTheme: (theme: Theme) => Promise<void>;
    setPrimaryColor: (color: string) => Promise<void>;
    setFontFamily: (font: FontFamily) => Promise<void>;
    loadThemeSettings: () => Promise<void>;
}

export interface UserStore {
    userName: string | null;
    isFirstTime: boolean;
    setUserName: (name: string) => Promise<void>;
    resetUserName: () => Promise<void>;
    loadUserSettings: () => Promise<void>;
}

export interface ChatStore {
    currentSessionId: string | null;
    chatHistory: Message[];
    chatSessions: Session[];
    addMessage: (message: Message) => Promise<void>;
    clearChatHistory: () => Promise<void>;
    saveChatSession: () => Promise<void>;
    loadChatSession: (sessionId: string) => Promise<void>;
    deleteChatSession: (sessionId: string) => Promise<void>;
    initializeChatStore: () => Promise<void>;
}
