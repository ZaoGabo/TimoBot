import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettingsStore from '../store/useSettingsStore';

const ChatInput = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState('');
  const { theme, primaryColor, fontFamily } = useSettingsStore();

  const isDark = theme === 'dark';

  const handleSend = useCallback(() => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  }, [message, disabled, onSend]);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2E' : '#F0F0F0' }]}>
          <TextInput
            style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000' }, fontStyle]}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor={isDark ? '#8E8E93' : '#999999'}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!disabled}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: primaryColor },
              (disabled || !message.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={disabled || !message.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default React.memo(ChatInput);
