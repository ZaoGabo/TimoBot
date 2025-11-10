import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettingsStore from '../store/useSettingsStore';
import Header from '../components/Header';

const SettingsScreen = ({ navigation }) => {
  const {
    userName,
    theme,
    primaryColor,
    fontFamily,
    setTheme,
    setPrimaryColor,
    setFontFamily,
    clearChatHistory,
    resetUserName
  } = useSettingsStore();

  const isDark = theme === 'dark';

  const colorOptions = [
    { name: 'Azul', value: '#4A90E2' },
    { name: 'Verde', value: '#2ECC71' },
    { name: 'Morado', value: '#9B59B6' },
    { name: 'Naranja', value: '#E67E22' },
    { name: 'Rojo', value: '#E74C3C' },
    { name: 'Rosa', value: '#FF6B9D' },
  ];

  const fontOptions = [
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
          }
        }
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
          }
        }
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[
        styles.sectionTitle,
        { color: isDark ? '#FFFFFF' : '#000000' }
      ]}>
        {title}
      </Text>
      <View style={[
        styles.sectionContent,
        { backgroundColor: isDark ? '#1C1C1E' : '#F5F5F5' }
      ]}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ icon, label, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={isDark ? '#FFFFFF' : '#000000'} 
        />
        <Text style={[
          styles.settingLabel,
          { color: isDark ? '#FFFFFF' : '#000000' }
        ]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? '#8E8E93' : '#999999'} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const ColorOption = ({ color, name, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.colorOption,
        { backgroundColor: color },
        isSelected && styles.colorOptionSelected
      ]}
      onPress={() => setPrimaryColor(color)}
    >
      {isSelected && (
        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );

  const FontOption = ({ font, name, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.fontOption,
        { 
          backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
          borderColor: isSelected ? primaryColor : (isDark ? '#3C3C3E' : '#E0E0E0')
        },
        isSelected && { borderWidth: 2 }
      ]}
      onPress={() => setFontFamily(font)}
    >
      <Text style={[
        styles.fontOptionText,
        { color: isDark ? '#FFFFFF' : '#000000' },
        font === 'serif' && { fontFamily: 'serif' },
        font === 'monospace' && { fontFamily: 'monospace' }
      ]}>
        {name}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#000000' : '#FFFFFF' }
    ]}>
      <Header
        title="Ajustes"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

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
            icon={isDark ? "moon" : "sunny"}
            label="Tema Oscuro"
            showArrow={false}
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                trackColor={{ false: '#E0E0E0', true: primaryColor }}
                thumbColor="#FFFFFF"
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
          <SettingItem
            icon="trash-outline"
            label="Borrar Historial"
            onPress={handleClearHistory}
          />
        </SettingSection>

        {/* Información */}
        <View style={styles.infoSection}>
          <Text style={[
            styles.infoText,
            { color: isDark ? '#666666' : '#999999' }
          ]}>
            TimoBot v1.0.0
          </Text>
          <Text style={[
            styles.infoText,
            { color: isDark ? '#666666' : '#999999' }
          ]}>
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
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-around',
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  colorOptionSelected: {
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  fontList: {
    padding: 8,
  },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    borderWidth: 1,
  },
  fontOptionText: {
    fontSize: 16,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  infoText: {
    fontSize: 12,
    marginVertical: 4,
  },
});

export default SettingsScreen;
