import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useSettingsStore from '../store/useSettingsStore';

const ChatMessage = ({ message, isUser }) => {
  const { theme, primaryColor, fontFamily } = useSettingsStore();

  const isDark = theme === 'dark';

  const fontStyle = useMemo(() => {
    switch (fontFamily) {
      case 'serif':
        return { fontFamily: 'serif' };
      case 'monospace':
        return { fontFamily: 'monospace' };
      default:
        return {};
    }
  }, [fontFamily]);

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
            : [styles.botBubble, { backgroundColor: isDark ? '#2C2C2E' : '#F0F0F0' }],
        ]}
        accessible={true}
        accessibilityLabel={`${isUser ? 'Tu mensaje' : 'Respuesta del bot'}: ${message}`}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : [styles.botText, { color: isDark ? '#FFFFFF' : '#000000' }],
            fontStyle,
          ]}
          accessible={true}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#000000',
  },
});

export default React.memo(ChatMessage);
