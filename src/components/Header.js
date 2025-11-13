import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettingsStore from '../store/useSettingsStore';

const Header = ({
  title,
  showSettings,
  showHistory,
  onSettingsPress,
  onHistoryPress,
  showBack,
  onBackPress,
}) => {
  const { primaryColor, fontFamily } = useSettingsStore();

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
      style={[
        styles.container,
        {
          backgroundColor: primaryColor,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
              accessibilityLabel="Volver atrás"
              accessibilityHint="Navega a la pantalla anterior"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {showHistory && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onHistoryPress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Ver historial"
              accessibilityHint="Abre el historial de conversaciones"
            >
              <Ionicons name="time-outline" size={24} color="#FFFFFF" />
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
              accessibilityHint="Abre la pantalla de ajustes"
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
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
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconButton: {
    padding: 4,
  },
});

export default React.memo(Header);
