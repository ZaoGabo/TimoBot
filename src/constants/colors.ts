/**
 * Color Design Tokens
 * Todos los colores usados en la app centralizados
 */

export interface ThemeColors {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
}

export const Colors = {
    // Theme colors
    light: {
        background: '#FFFFFF',
        surface: '#F2F2F7',
        surfaceSecondary: '#E5E5EA',
        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        border: '#E0E0E0',
    } as ThemeColors,
    dark: {
        background: '#000000',
        surface: '#1C1C1E',
        surfaceSecondary: '#2C2C2E',
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        textTertiary: '#666666',
        border: '#2C2C2E',
    } as ThemeColors,

    // Semantic colors (independent of theme)
    primary: {
        blue: '#007AFF',
        purple: '#AF52DE',
        pink: '#FF2D55',
        orange: '#FF9500',
        green: '#34C759',
    },

    // Status colors
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    info: '#007AFF',

    // Special colors
    recording: '#FF3B30',
    disabled: '#CCCCCC',
    transparent: 'transparent',

    // Overlay colors (with opacity)
    overlay: (opacity: number = 0.5) => `rgba(0, 0, 0, ${opacity})`,
    overlayLight: (opacity: number = 0.1) => `rgba(255, 255, 255, ${opacity})`,
};

/**
 * Get theme-aware colors
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {ThemeColors} Theme colors
 */
export const getThemeColors = (isDark: boolean): ThemeColors => {
    return isDark ? Colors.dark : Colors.light;
};

/**
 * Get color with opacity
 * @param {string} color - Hex color
 * @param {number} opacity - Opacity (0-1)
 * @returns {string} Color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
    // Simple implementation for hex colors
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};
