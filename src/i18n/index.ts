// i18n configuration (TypeScript version)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import es from './locales/es.json';
import en from './locales/en.json';

const LANGUAGE_STORAGE_KEY = '@timobot_language';

const resources = {
    es: { translation: es },
    en: { translation: en },
};

// Detector de idioma personalizado que usa AsyncStorage
const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLanguage) {
                callback(savedLanguage);
                return;
            }
            const deviceLanguage = Localization.locale.split('-')[0]; // 'es-MX' -> 'es'
            const supportedLanguage = ['es', 'en'].includes(deviceLanguage) ? deviceLanguage : 'es';
            callback(supportedLanguage);
        } catch (error) {
            console.error('Error detecting language:', error);
            callback('es'); // Default to Spanish
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch (error) {
            console.error('Error caching language:', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        compatibilityJSON: 'v3', // For React Native
        interpolation: {
            escapeValue: false, // React already escapes
        },
        react: {
            useSuspense: false, // Important for React Native
        },
    });

export default i18n;
