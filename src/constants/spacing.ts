/**
 * Spacing & Layout Design Tokens
 * Consistent spacing values across the app
 */

export const Spacing = {
    // Base spacing unit (4px)
    unit: 4,

    // Spacing scale
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 12,   // 12px
    base: 16, // 16px
    lg: 20,   // 20px
    xl: 24,   // 24px
    '2xl': 32, // 32px
    '3xl': 40, // 40px
    '4xl': 48, // 48px
    '5xl': 64, // 64px
};

export const BorderRadius = {
    none: 0,
    xs: 4, // Added xs for ChatMessage
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999, // Circle
};

export const Layout = {
    // Input heights
    inputHeight: {
        sm: 36,
        base: 44,
        lg: 48,
    },

    // Button sizes
    buttonSize: {
        sm: 36,
        base: 44,
        lg: 52,
    },

    // Icon sizes
    iconSize: {
        xs: 16,
        sm: 20,
        base: 24,
        lg: 28,
        xl: 32,
        '5xl': 64, // Added 5xl for ChatScreen empty state
    },

    // Common widths
    maxWidth: {
        container: 1200,
        content: 800,
    },
};

export const Elevation = {
    // Shadow depths
    none: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.20,
        shadowRadius: 3.0,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6.0,
        elevation: 6,
    },
};
