import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../store/useThemeStore';
import {
    Colors,
    Typography,
    getFontFamilyStyle,
    Spacing,
    Layout,
    Elevation,
} from '../constants';

interface HeaderProps {
    title: string;
    showSettings?: boolean;
    showHistory?: boolean;
    onSettingsPress?: () => void;
    onHistoryPress?: () => void;
    showBack?: boolean;
    onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showSettings,
    showHistory,
    onSettingsPress,
    onHistoryPress,
    showBack,
    onBackPress,
}) => {
    const { primaryColor, fontFamily } = useThemeStore();
    const fontStyle = getFontFamilyStyle(fontFamily);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: primaryColor,
                    paddingTop: Platform.OS === 'ios' ? 50 : Spacing.lg,
                },
            ]}
        >
            <View style={styles.content}>
                {/* Botón izquierdo */}
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onBackPress}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Volver"
                            accessibilityHint="Regresa a la pantalla anterior"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="arrow-back" size={Layout.iconSize.base} color={Colors.light.background} />
                        </TouchableOpacity>
                    )}
                    {showHistory && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onHistoryPress}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Historial de chats"
                            accessibilityHint="Muestra tus conversaciones anteriores"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="time-outline" size={Layout.iconSize.base} color={Colors.light.background} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Título */}
                <View style={styles.centerSection}>
                    <Text
                        style={[styles.title, fontStyle]}
                        numberOfLines={1}
                        accessible={true}
                        accessibilityRole="header"
                        allowFontScaling={true}
                    >
                        {title}
                    </Text>
                </View>

                {/* Botón derecho */}
                <View style={styles.rightSection}>
                    {showSettings && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onSettingsPress}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Configuración"
                            accessibilityHint="Abre los ajustes de la aplicación"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="settings-outline" size={Layout.iconSize.base} color={Colors.light.background} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: Spacing.md,
        ...Elevation.base,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
    },
    leftSection: {
        width: Spacing['3xl'],
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        width: Spacing['3xl'],
        alignItems: 'flex-end',
    },
    title: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.light.background,
    },
    iconButton: {
        padding: Spacing.xs,
    },
});

export default React.memo(Header);
