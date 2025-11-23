import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useThemeStore from '../store/useThemeStore';
import useUserStore from '../store/useUserStore';
import useChatStore from '../store/useChatStore';
import Header from '../components/Header';
import {
    Colors,
    getThemeColors,
    Typography,
    Spacing,
    BorderRadius,
    Layout,
    Elevation,
} from '../constants';

// Define types for navigation
type RootStackParamList = {
    Chat: undefined;
    Settings: undefined;
    Welcome: undefined;
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
}

interface ColorOptionType {
    name: string;
    value: string;
}

interface FontOptionType {
    name: string;
    value: 'default' | 'serif' | 'monospace';
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { userName, resetUserName } = useUserStore();
    const { theme, primaryColor, fontFamily, setTheme, setPrimaryColor, setFontFamily } = useThemeStore();
    const { clearChatHistory } = useChatStore();

    const isDark = theme === 'dark';
    const themeColors = getThemeColors(isDark);

    const colorOptions: ColorOptionType[] = [
        { name: 'Azul', value: Colors.primary.blue },
        { name: 'Verde', value: Colors.primary.green },
        { name: 'Morado', value: Colors.primary.purple },
        { name: 'Naranja', value: Colors.primary.orange },
        { name: 'Rojo', value: Colors.primary.pink }, // Using pink for Red option as it's close or add red to Colors
        { name: 'Rosa', value: '#FF6B9D' }, // Keep this one if not in tokens or add to tokens
    ];

    const fontOptions: FontOptionType[] = [
        { name: 'Predeterminada', value: 'default' },
        { name: 'Serif', value: 'serif' },
        { name: 'Monospace', value: 'monospace' },
    ];

    const handleClearHistory = () => {
        Alert.alert(
            'Borrar Historial',
            '¿Estás seguro de que quieres borrar todo el historial de conversaciones?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Borrar',
                    style: 'destructive',
                    onPress: async () => {
                        await clearChatHistory();
                        Alert.alert('Listo', 'El historial ha sido borrado.');
                    },
                },
            ]
        );
    };

    const handleResetName = () => {
        Alert.alert(
            'Reiniciar Nombre',
            '¿Quieres cambiar tu nombre? Esto te llevará a la pantalla de bienvenida.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Continuar',
                    onPress: async () => {
                        await resetUserName();
                        navigation.replace('Welcome');
                    },
                },
            ]
        );
    };

    const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: themeColors.surfaceSecondary }]}>
                {children}
            </View>
        </View>
    );

    const SettingItem: React.FC<{
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        onPress?: () => void;
        showArrow?: boolean;
        rightComponent?: React.ReactNode;
    }> = ({ icon, label, onPress, showArrow = true, rightComponent }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={Layout.iconSize.base} color={themeColors.text} />
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                    {label}
                </Text>
            </View>
            <View style={styles.settingRight}>
                {rightComponent}
                {showArrow && (
                    <Ionicons name="chevron-forward" size={Layout.iconSize.sm} color={themeColors.textSecondary} />
                )}
            </View>
        </TouchableOpacity>
    );

    const ColorOption: React.FC<{ color: string; name: string; isSelected: boolean }> = ({ color, name, isSelected }) => (
        <TouchableOpacity
            style={[
                styles.colorOption,
                { backgroundColor: color },
                isSelected && styles.colorOptionSelected,
            ]}
            onPress={() => setPrimaryColor(color)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${name}${isSelected ? ' (seleccionado)' : ''}`}
            accessibilityHint="Selecciona el color principal"
        >
            {isSelected && <Ionicons name="checkmark" size={Layout.iconSize.base} color={Colors.light.background} />}
        </TouchableOpacity>
    );

    const FontOption: React.FC<{ font: FontOptionType['value']; name: string; isSelected: boolean }> = ({ font, name, isSelected }) => (
        <TouchableOpacity
            style={[
                styles.fontOption,
                {
                    backgroundColor: themeColors.surface,
                    borderColor: isSelected ? primaryColor : themeColors.border,
                },
                isSelected && { borderWidth: 2 },
            ]}
            onPress={() => setFontFamily(font)}
        >
            <Text
                style={[
                    styles.fontOptionText,
                    { color: themeColors.text },
                    font === 'serif' && { fontFamily: Typography.fontFamily.serif },
                    font === 'monospace' && { fontFamily: Typography.fontFamily.monospace },
                ]}
            >
                {name}
            </Text>
            {isSelected && <Ionicons name="checkmark-circle" size={Layout.iconSize.sm} color={primaryColor} />}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Header title="Ajustes" showBack={true} onBackPress={() => navigation.goBack()} />

            <ScrollView style={styles.scrollView}>
                {/* Usuario */}
                <SettingSection title="Usuario">
                    <SettingItem
                        icon="person-outline"
                        label={`Nombre: ${userName}`}
                        onPress={handleResetName}
                    />
                </SettingSection>

                {/* Apariencia */}
                <SettingSection title="Apariencia">
                    <SettingItem
                        icon={isDark ? 'moon' : 'sunny'}
                        label="Tema Oscuro"
                        showArrow={false}
                        rightComponent={
                            <Switch
                                value={isDark}
                                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                                trackColor={{ false: Colors.light.border, true: primaryColor }}
                                thumbColor={Colors.light.background}
                            />
                        }
                    />
                </SettingSection>

                {/* Color Principal */}
                <SettingSection title="Color Principal">
                    <View style={styles.colorGrid}>
                        {colorOptions.map((color) => (
                            <ColorOption
                                key={color.value}
                                color={color.value}
                                name={color.name}
                                isSelected={primaryColor === color.value}
                            />
                        ))}
                    </View>
                </SettingSection>

                {/* Tipo de Letra */}
                <SettingSection title="Tipo de Letra">
                    <View style={styles.fontList}>
                        {fontOptions.map((font) => (
                            <FontOption
                                key={font.value}
                                font={font.value}
                                name={font.name}
                                isSelected={fontFamily === font.value}
                            />
                        ))}
                    </View>
                </SettingSection>

                {/* Datos */}
                <SettingSection title="Datos">
                    <SettingItem icon="trash-outline" label="Borrar Historial" onPress={handleClearHistory} />
                </SettingSection>

                {/* Información */}
                <View style={styles.infoSection}>
                    <Text style={[styles.infoText, { color: themeColors.textTertiary }]}>
                        TimoBot v1.0.0
                    </Text>
                    <Text style={[styles.infoText, { color: themeColors.textTertiary }]}>
                        Powered by Perplexity AI
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.base,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    sectionContent: {
        borderRadius: BorderRadius.base,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: Colors.overlay(0.05),
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingLabel: {
        fontSize: Typography.fontSize.base,
        marginLeft: Spacing.md,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: Spacing.base,
        justifyContent: 'space-around',
    },
    colorOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        margin: Spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        ...Elevation.base,
    },
    colorOptionSelected: {
        ...Elevation.lg,
    },
    fontList: {
        padding: Spacing.sm,
    },
    fontOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.base,
        borderRadius: BorderRadius.sm,
        marginVertical: Spacing.xs,
        marginHorizontal: Spacing.sm,
        borderWidth: 1,
    },
    fontOptionText: {
        fontSize: Typography.fontSize.base,
    },
    infoSection: {
        alignItems: 'center',
        paddingVertical: Spacing['2xl'],
    },
    infoText: {
        fontSize: Typography.fontSize.xs,
        marginVertical: Spacing.xs,
    },
});

export default SettingsScreen;
