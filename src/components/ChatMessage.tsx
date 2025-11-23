import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import useThemeStore from '../store/useThemeStore';
import {
    Colors,
    Typography,
    getFontFamilyStyle,
    Spacing,
    BorderRadius,
} from '../constants';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
    const { theme, primaryColor, fontFamily } = useThemeStore();

    const isDark = theme === 'dark';
    const fontStyle = getFontFamilyStyle(fontFamily);

    // Markdown styles based on theme
    const markdownStyles = useMemo(
        () =>
            StyleSheet.create({
                body: {
                    color: isUser ? Colors.light.background : isDark ? Colors.dark.text : Colors.light.text,
                    fontSize: Typography.fontSize.base,
                    lineHeight: 22,
                    ...fontStyle,
                },
                paragraph: {
                    marginTop: 0,
                    marginBottom: Spacing.sm,
                },
                strong: {
                    fontWeight: 'bold',
                },
                em: {
                    fontStyle: 'italic',
                },
                code_inline: {
                    backgroundColor: isUser
                        ? Colors.overlayLight(0.2)
                        : isDark
                            ? Colors.overlayLight(0.1)
                            : Colors.overlay(0.05),
                    borderRadius: BorderRadius.xs,
                    paddingHorizontal: Spacing.xs,
                    paddingVertical: 2,
                    fontFamily: Typography.fontFamily.monospace,
                },
                code_block: {
                    backgroundColor: isUser
                        ? Colors.overlayLight(0.2)
                        : isDark
                            ? Colors.overlayLight(0.1)
                            : Colors.overlay(0.05),
                    borderRadius: BorderRadius.sm,
                    padding: Spacing.md,
                    marginVertical: Spacing.sm,
                    fontFamily: Typography.fontFamily.monospace,
                },
                fence: {
                    backgroundColor: isUser
                        ? Colors.overlayLight(0.2)
                        : isDark
                            ? Colors.overlayLight(0.1)
                            : Colors.overlay(0.05),
                    borderRadius: BorderRadius.sm,
                    padding: Spacing.md,
                    marginVertical: Spacing.sm,
                    fontFamily: Typography.fontFamily.monospace,
                },
                bullet_list: {
                    marginBottom: Spacing.sm,
                },
                ordered_list: {
                    marginBottom: Spacing.sm,
                },
                list_item: {
                    marginBottom: Spacing.xs,
                },
                link: {
                    color: isUser ? Colors.light.background : primaryColor,
                    textDecorationLine: 'underline',
                },
            }),
        [isDark, isUser, fontStyle, primaryColor]
    );

    return (
        <View
            style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}
            accessible={true}
            accessibilityRole="text"
        >
            <View
                style={[
                    styles.bubble,
                    isUser
                        ? [styles.userBubble, { backgroundColor: primaryColor }]
                        : [styles.botBubble, { backgroundColor: isDark ? Colors.dark.surfaceSecondary : Colors.light.surface }],
                ]}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`${isUser ? 'Tú dijiste' : 'TimoBot dice'}: ${message}`}
            >
                <Markdown
                    style={markdownStyles}
                    mergeStyle={true}
                >
                    {message}
                </Markdown>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.xs,
        marginHorizontal: Spacing.md,
    },
    userContainer: {
        alignItems: 'flex-end',
    },
    botContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: Spacing.base,
        paddingVertical: 10,
        borderRadius: 18,
    },
    userBubble: {
        borderBottomRightRadius: BorderRadius.xs,
    },
    botBubble: {
        borderBottomLeftRadius: BorderRadius.xs,
    },
});

export default React.memo(ChatMessage);
