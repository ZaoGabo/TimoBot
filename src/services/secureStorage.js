import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Servicio de almacenamiento seguro para datos sensibles
 * Usa expo-secure-store en dispositivos nativos y fallback a AsyncStorage en web
 */

const isAvailable = Platform.OS !== 'web';

/**
 * Guarda un valor de forma segura
 * @param {string} key - Clave para almacenar
 * @param {string} value - Valor a almacenar
 * @returns {Promise<void>}
 */
export const saveSecure = async (key, value) => {
  try {
    if (isAvailable) {
      await SecureStore.setItemAsync(key, value);
    } else {
      // Fallback para web - usar AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(`secure_${key}`, value);
      console.warn('SecureStore no disponible en web, usando AsyncStorage');
    }
  } catch (error) {
    console.error('Error guardando en almacenamiento seguro:', error);
    throw error;
  }
};

/**
 * Obtiene un valor del almacenamiento seguro
 * @param {string} key - Clave a recuperar
 * @returns {Promise<string|null>}
 */
export const getSecure = async (key) => {
  try {
    if (isAvailable) {
      return await SecureStore.getItemAsync(key);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(`secure_${key}`);
    }
  } catch (error) {
    console.error('Error obteniendo del almacenamiento seguro:', error);
    return null;
  }
};

/**
 * Elimina un valor del almacenamiento seguro
 * @param {string} key - Clave a eliminar
 * @returns {Promise<void>}
 */
export const deleteSecure = async (key) => {
  try {
    if (isAvailable) {
      await SecureStore.deleteItemAsync(key);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(`secure_${key}`);
    }
  } catch (error) {
    console.error('Error eliminando del almacenamiento seguro:', error);
    throw error;
  }
};

/**
 * Guarda la API key de forma segura
 * @param {string} apiKey - API key a guardar
 * @returns {Promise<void>}
 */
export const saveApiKey = async (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key inválida');
  }
  await saveSecure('perplexity_api_key', apiKey);
};

/**
 * Obtiene la API key guardada
 * @returns {Promise<string|null>}
 */
export const getApiKey = async () => {
  return await getSecure('perplexity_api_key');
};

/**
 * Elimina la API key guardada
 * @returns {Promise<void>}
 */
export const deleteApiKey = async () => {
  await deleteSecure('perplexity_api_key');
};
