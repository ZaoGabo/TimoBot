# Documentación Técnica - TimoBot

Esta guía contiene información técnica para desarrolladores que quieran modificar o extender TimoBot.

## Visión General de la Arquitectura

TimoBot utiliza una arquitectura **Component-Based** con:

- **State Management**: Zustand para estado global reactivo
- **Navigation**: React Navigation con Stack Navigator
- **Storage**: AsyncStorage para persistencia local
- **API**: Axios para llamadas HTTP
- **UI**: Componentes funcionales con Hooks

### Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Componente UI      │
│  (ChatScreen)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Zustand Store      │
│  (useSettingsStore) │
└──────┬──────────────┘
       │
       ├──────────────────┐
       ▼                  ▼
┌─────────────┐    ┌──────────────┐
│ AsyncStorage│    │ Perplexity   │
│   (Local)   │    │   API        │
└─────────────┘    └──────────────┘
```

## Store con Zustand

### Estado Global

El store maneja:

```javascript
{
  userName: string | null,
  isFirstTime: boolean,
  theme: 'light' | 'dark',
  primaryColor: string,
  fontFamily: 'default' | 'serif' | 'monospace',
  chatHistory: Array<Message>,
  chatSessions: Array<Session>
}
```

### Fuentes Principales

```javascript
// Configuración de usuario
setUserName(name);
resetUserName();

// Configuración de apariencia
setTheme(theme);
setPrimaryColor(color);
setFontFamily(font);

// Manejo de mensajes
addMessage(message);
clearChatHistory();

// Manejo de sesiones
saveChatSession();
loadChatSession(sessionId);
deleteChatSession(sessionId);

// Inicialización
loadSettings();
```

## Componentes Principales

### ChatMessage

Renderiza una burbuja de mensaje.

**Props:**

- `message: string` - Texto del mensaje
- `isUser: boolean` - Si es mensaje del usuario o del bot

**Personalización:**

- Colores se toman del store
- Estilos diferentes para usuario/bot
- Soporte para temas claro/oscuro

### ChatInput

Input de texto con botón de envío.

**Props:**

- `onSend: (text: string) => void` - Callback al enviar
- `disabled: boolean` - Deshabilitar input

**Características:**

- Multiline con límite de caracteres
- Auto-resize hasta 100px
- Botón deshabilitado si texto vacío

### Header

Barra de navegación superior.

**Props:**

- `title: string` - Título a mostrar
- `showSettings: boolean` - Mostrar botón de ajustes
- `showHistory: boolean` - Mostrar botón de historial
- `showBack: boolean` - Mostrar botón de volver
- `onSettingsPress: () => void`
- `onHistoryPress: () => void`
- `onBackPress: () => void`

## Capa de Servicios

### Perplexity API

**Archivo:** `src/services/perplexityApi.js`

#### Configuración

```javascript
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const API_KEY = 'tu-api-key';
const USE_MOCK = true; // false para API real
```

#### Función Principal

```javascript
sendMessageToPerplexity(message, userName, conversationHistory);
```

**Parámetros:**

- `message`: string - Mensaje del usuario
- `userName`: string - Nombre del usuario
- `conversationHistory`: Array - Historial de conversación

**Retorna:** Promise<string> - Respuesta del bot

#### Mock vs Real

El modo mock simula respuestas con:

- Delay aleatorio (1-2 segundos)
- Respuestas contextuales
- Personalización con nombre del usuario

#### Manejo de Errores

```javascript
try {
  const response = await sendMessageToPerplexity(...);
} catch (error) {
  // Errores específicos:
  // 401: API key inválida
  // 429: Límite excedido
  // 500: Error del servidor
  // Network: Sin conexión
}
```

## Utilidades

### Saludos

**Archivo:** `src/utils/greetings.js`

#### dailyGreeting(userName)

Retorna un saludo personalizado según:

- Día de la semana
- Hora del día
- Nombre del usuario

```javascript
dailyGreeting('Juan');
// => "Buenos días, Juan"
```

#### shortGreeting(userName)

Saludo corto para headers.

```javascript
shortGreeting('Juan');
// => "Buenos días, Juan"
```

#### formatDate(date)

Formatea fechas de forma amigable:

- "Hoy, 14:30"
- "Ayer, 09:15"
- "Lunes, 16:00"
- "12/11/2024 14:30"

#### getDayEmoji()

Retorna emoji según el día:

- Domingo
- Lunes
- Martes
- Miércoles
- Jueves
- Viernes
- Sábado

## Temas

### Aplicar Tema

Los componentes leen el tema del store:

```javascript
const { theme, primaryColor } = useSettingsStore();
const isDark = theme === 'dark';

// Usar en estilos
<View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]} />;
```

### Colores del Tema

**Modo Claro:**

- Background: `#FFFFFF`
- Text: `#000000`
- Secondary: `#F5F5F5`
- Border: `#E0E0E0`

**Modo Oscuro:**

- Background: `#000000`
- Text: `#FFFFFF`
- Secondary: `#1C1C1E`
- Border: `#2C2C2E`

## Flujo de Trabajo para Nuevas Características

### 1. Agregar Nueva Pantalla

```javascript
// 1. Crear componente
// src/screens/NuevaPantalla.js
import React from 'react';
import { View, Text } from 'react-native';

const NuevaPantalla = ({ navigation }) => {
  return (
    <View>
      <Text>Nueva Pantalla</Text>
    </View>
  );
};

export default NuevaPantalla;

// 2. Agregar al navegador
// App.js
import NuevaPantalla from './src/screens/NuevaPantalla';

<Stack.Screen name="Nueva" component={NuevaPantalla} />;

// 3. Navegar
navigation.navigate('Nueva');
```

### 2. Agregar Nueva Configuración

```javascript
// 1. Agregar al store
// src/store/useSettingsStore.js
create((set) => ({
  nuevaConfig: 'valor-default',
  setNuevaConfig: async (valor) => {
    set({ nuevaConfig: valor });
    await AsyncStorage.setItem('nuevaConfig', valor);
  },
}));

// 2. Cargar en loadSettings
const nuevaConfig = await AsyncStorage.getItem('nuevaConfig');
set({ nuevaConfig: nuevaConfig || 'valor-default' });

// 3. Usar en componentes
const { nuevaConfig, setNuevaConfig } = useSettingsStore();
```

### 3. Agregar Nueva API

```javascript
// 1. Crear servicio
// src/services/nuevaApi.js
import axios from 'axios';

export const llamadaAPI = async (params) => {
  try {
    const response = await axios.post('url', params);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 2. Usar en pantallas
import { llamadaAPI } from '../services/nuevaApi';

const resultado = await llamadaAPI({ data: 'test' });
```

## Testing

### Estructura de Tests (Próximamente)

```
tests/
├── components/
│   ├── ChatMessage.test.js
│   ├── ChatInput.test.js
│   └── Header.test.js
├── screens/
│   ├── WelcomeScreen.test.js
│   ├── ChatScreen.test.js
│   └── SettingsScreen.test.js
├── services/
│   └── perplexityApi.test.js
└── utils/
    └── greetings.test.js
```

### Ejemplo de Test

```javascript
import { render, fireEvent } from '@testing-library/react-native';
import ChatInput from '../src/components/ChatInput';

describe('ChatInput', () => {
  it('debería llamar onSend al presionar el botón', () => {
    const mockOnSend = jest.fn();
    const { getByPlaceholder, getByTestId } = render(<ChatInput onSend={mockOnSend} />);

    const input = getByPlaceholder('Escribe tu mensaje...');
    const button = getByTestId('send-button');

    fireEvent.changeText(input, 'Hola');
    fireEvent.press(button);

    expect(mockOnSend).toHaveBeenCalledWith('Hola');
  });
});
```

## Build y Despliegue

### Android

```bash
# Generar APK
expo build:android

# O con EAS
eas build --platform android
```

### iOS

```bash
# Generar IPA
expo build:ios

# O con EAS
eas build --platform ios
```

### Configuración EAS

```json
// eas.json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

## Debugging

### React Native Debugger

```bash
# Instalar
brew install --cask react-native-debugger

# O descargar desde
# https://github.com/jhen0409/react-native-debugger
```

### Console Logs

```javascript
// En desarrollo
console.log('Debug:', data);
console.error('Error:', error);
console.warn('Warning:', warning);

// En producción, usar un logger
import logger from './logger';
logger.info('Info:', data);
```

### Performance

```javascript
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // Código que puede esperar
});
```

## Seguridad

### API Keys

**NUNCA** commits API keys al repositorio.

Usa:

1. Variables de entorno (`.env`)
2. Servicios de secrets (AWS Secrets Manager)
3. Config nativa (iOS Keychain, Android Keystore)

### Validación

```javascript
// Validar inputs del usuario
const sanitizeInput = (text) => {
  return text.trim().substring(0, 500);
};

// Validar respuestas de API
const validateResponse = (data) => {
  if (!data || !data.choices) {
    throw new Error('Invalid response');
  }
  return data;
};
```

## 📈 Optimización

### Memoización

```javascript
import { useMemo, useCallback } from 'react';

const Component = () => {
  const valorExpensivo = useMemo(() => {
    return calcularAlgo();
  }, [dependencias]);

  const handleAction = useCallback(() => {
    // acción
  }, [dependencias]);
};
```

### FlatList

```javascript
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Optimizaciones
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## 🎯 Mejores Prácticas

1. **Componentes Pequeños**: Mantener componentes < 200 líneas
2. **Hooks Personalizados**: Extraer lógica reutilizable
3. **PropTypes**: Documentar props (o usar TypeScript)
4. **Constantes**: Usar archivos de constantes para valores mágicos
5. **Error Boundaries**: Implementar para capturar errores
6. **Loading States**: Siempre mostrar feedback al usuario
7. **Offline Support**: Manejar estados sin conexión
8. **Accessibility**: Agregar `accessibilityLabel` a componentes

## Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [React Navigation](https://reactnavigation.org/)
- [Perplexity AI](https://docs.perplexity.ai/)

---

**Happy Coding! 🚀**
