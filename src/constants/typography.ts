/**
 * Typography Design Tokens
 * Font sizes, weights, and families
 */

import { TextStyle } from 'react-native';

export const Typography = {
    // Font families
    fontFamily: {
        default: 'System',
        serif: 'serif',
        monospace: 'monospace',
    },

    // Font sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 22,
        '3xl': 24,
        '4xl': 28,
        '5xl': 32,
    },

    // Font weights
    fontWeight: {
        light: '300' as TextStyle['fontWeight'],
        regular: '400' as TextStyle['fontWeight'],
        medium: '500' as TextStyle['fontWeight'],
        semibold: '600' as TextStyle['fontWeight'],
        bold: '700' as TextStyle['fontWeight'],
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

/**
 * Get font family style based on setting
 * @param {string} fontFamily - Font family setting
 * @returns {object} Style object with fontFamily
 */
export const getFontFamilyStyle = (fontFamily: string): { fontFamily: string } => {
    switch (fontFamily) {
        case 'serif':
            return { fontFamily: Typography.fontFamily.serif };
        case 'monospace':
            return { fontFamily: Typography.fontFamily.monospace };
        default:
            return { fontFamily: Typography.fontFamily.default };
    }
};
