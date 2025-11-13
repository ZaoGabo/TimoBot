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
import useSettingsStore from '../store/useSettingsStore';

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { setUserName, theme, primaryColor } = useSettingsStore();

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
        {/* Logo o emoji del bot */}
        <Text style={styles.botEmoji}>🤖</Text>

        {/* Título */}
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          ¡Hola! Soy TimoBot
        </Text>

        {/* Subtítulo */}
        <Text style={[styles.subtitle, { color: isDark ? '#B0B0B0' : '#666666' }]}>
          Tu asistente personal inteligente
        </Text>

        {/* Descripción */}
        <Text style={[styles.description, { color: isDark ? '#8E8E93' : '#999999' }]}>
          Para comenzar, cuéntame ¿cómo te llamas?
        </Text>

        {/* Input del nombre */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#F5F5F5',
                color: isDark ? '#FFFFFF' : '#000000',
                borderColor: isDark ? '#2C2C2E' : '#E0E0E0',
              },
            ]}
            placeholder="Tu nombre"
            placeholderTextColor={isDark ? '#8E8E93' : '#999999'}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            maxLength={30}
          />
        </View>

        {/* Botón de continuar */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: primaryColor },
            !name.trim() && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
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
  botEmoji: {
    fontSize: 80,
    marginBottom: 24,
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
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
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
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    fontSize: 12,
  },
});

export default WelcomeScreen;
