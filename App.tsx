import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import './src/i18n'; // Initialize i18n
import ErrorBoundary from './src/components/ErrorBoundary';
import useThemeStore from './src/store/useThemeStore';
import useUserStore from './src/store/useUserStore';
import useChatStore from './src/store/useChatStore';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Define types for navigation
export type RootStackParamList = {
    Welcome: undefined;
    Chat: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { isFirstTime, loadUserSettings } = useUserStore();
    const { theme, loadThemeSettings } = useThemeStore();
    const { initializeChatStore } = useChatStore();

    useEffect(() => {
        // Cargar configuraciones al iniciar la app
        const initializeApp = async () => {
            await Promise.all([
                loadUserSettings(),
                loadThemeSettings(),
                initializeChatStore(),
            ]);
            setIsLoading(false);
        };

        initializeApp();
    }, [loadUserSettings, loadThemeSettings, initializeChatStore]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    const isDark = theme === 'dark';

    return (
        <ErrorBoundary>
            <NavigationContainer>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                    initialRouteName={isFirstTime ? 'Welcome' : 'Chat'}
                >
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});
