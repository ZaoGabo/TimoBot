import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserStore } from '../types';

const useUserStore = create<UserStore>((set) => ({
    // User settings
    userName: null,
    isFirstTime: true,

    // Actions
    setUserName: async (name) => {
        set({ userName: name, isFirstTime: false });
        await AsyncStorage.setItem('userName', name);
        await AsyncStorage.setItem('isFirstTime', 'false');
    },

    resetUserName: async () => {
        set({ userName: null, isFirstTime: true });
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.setItem('isFirstTime', 'true');
    },

    // Load user settings from AsyncStorage
    loadUserSettings: async () => {
        try {
            const [userName, isFirstTime] = await Promise.all([
                AsyncStorage.getItem('userName'),
                AsyncStorage.getItem('isFirstTime'),
            ]);

            set({
                userName: userName || null,
                isFirstTime: isFirstTime !== 'false',
            });
        } catch (error) {
            console.error('Error loading user settings:', error);
        }
    },
}));

export default useUserStore;
