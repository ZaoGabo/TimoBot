import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeStore } from '../types';

const useThemeStore = create<ThemeStore>((set) => ({
    // Theme settings
    theme: 'light', // 'light' or 'dark'
    primaryColor: '#4A90E2',
    fontFamily: 'default', // 'default', 'serif', 'monospace'

    // Actions
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

    // Load theme settings from AsyncStorage
    loadThemeSettings: async () => {
        try {
            const [theme, primaryColor, fontFamily] = await Promise.all([
                AsyncStorage.getItem('theme'),
                AsyncStorage.getItem('primaryColor'),
                AsyncStorage.getItem('fontFamily'),
            ]);

            set({
                theme: (theme as 'light' | 'dark') || 'light',
                primaryColor: primaryColor || '#4A90E2',
                fontFamily: (fontFamily as 'default' | 'serif' | 'monospace') || 'default',
            });
        } catch (error) {
            console.error('Error loading theme settings:', error);
        }
    },
}));

export default useThemeStore;
