import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useThemeStore from '../store/useThemeStore';
import useUserStore from '../store/useUserStore';

// Define types for navigation
type RootStackParamList = {
    Chat: undefined;
    Settings: undefined;
    Welcome: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
    navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [name, setName] = useState<string>('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const { setUserName } = useUserStore();
    const { theme, primaryColor, fontFamily } = useThemeStore();

    const getFontFamily = () => fontFamily || 'System';

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleContinue = async () => {
        if (name.trim()) {
            await setUserName(name.trim());
            navigation.replace('Chat');
        }
    };

    const isDark = theme === 'dark';

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
                    <Ionicons name="chatbubble-ellipses" size={60} color={primaryColor} />
                </View>

                {/* Title */}
                <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000', fontFamily: getFontFamily() }]}>
                    {t('welcome.title')}
                </Text>

                {/* Subtitle */}
                <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#666666', fontFamily: getFontFamily() }]}>
                    {t('welcome.subtitle')}
                </Text>

                {/* Name input */}
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#000000', fontFamily: getFontFamily() }]}>
                        {t('welcome.namePrompt')}
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                                color: isDark ? '#FFFFFF' : '#000000',
                                borderColor: primaryColor,
                                fontFamily: getFontFamily(),
                            },
                        ]}
                        placeholder={t('welcome.namePlaceholder')}
                        placeholderTextColor={isDark ? '#8E8E93' : '#999999'}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                        maxLength={30}
                    />
                </View>

                {/* Continue button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: name.trim() ? primaryColor : '#CCCCCC' }]}
                    onPress={handleContinue}
                    disabled={!name.trim()}
                >
                    <Text style={[styles.buttonText, { fontFamily: getFontFamily() }]}>{t('welcome.continueButton')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                {/* Footer */}
                <Text style={[styles.footer, { color: isDark ? '#666666' : '#CCCCCC' }]}>
                    Versión 1.0.0
                </Text>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        fontSize: 18,
        borderWidth: 1,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 32,
        fontSize: 12,
    },
});

export default WelcomeScreen;
