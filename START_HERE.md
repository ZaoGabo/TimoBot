# START HERE - TimoBot

¡Bienvenido a TimoBot! Este archivo te guiará para poner en marcha la aplicación en minutos.

## ¿Qué es TimoBot?

**TimoBot** es un asistente conversacional inteligente creado con:

- ⚛️ React Native + Expo
- 🤖 API de Perplexity AI
- 💾 Almacenamiento local con AsyncStorage
- 🎨 Temas y colores personalizables
- 📱 Funciona en iOS y Android

## Inicio Rápido (3 comandos)

```bash
# 1. Instala dependencias
npm install

# 2. Inicia el servidor
npm start

# 3. Escanea el código QR con Expo Go
```

¡Listo! La app se abrirá en tu dispositivo.

## Opciones de Ejecución

### En Dispositivo Físico (Recomendado)

1. Descarga **Expo Go**:
   - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
   - [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Ejecuta:

   ```bash
   npm start
   ```

3. Escanea el código QR con Expo Go

### En Emulador

**Android:**

```bash
npm run android
```

**iOS (solo Mac):**

```bash
npm run ios
```

### En Web (Experimental)

```bash
npm run web
```

## Primer Uso

1. **Pantalla de Bienvenida**
   - Ingresa tu nombre
   - Presiona "Comenzar"

2. **Chat Principal**
   - Escribe un mensaje
   - Presiona enviar ✈️
   - Recibe respuesta de TimoBot

3. **Personalización**
   - Toca el ícono ⚙️ (arriba derecha)
   - Cambia tema, color y fuente
   - ¡Los cambios se guardan automáticamente!

## Configuración de la API

### Modo Mock (Actual)

Por defecto, usa respuestas simuladas. **No necesitas configurar nada.**

### Modo API Real

1. Obtén tu API key de [Perplexity AI](https://www.perplexity.ai/)

2. Edita `src/services/perplexityApi.js`:

   ```javascript
   const API_KEY = 'pplx-tu-api-key-aqui';
   const USE_MOCK = false; // Cambia a false
   ```

3. Reinicia:
   ```bash
   npm start
   ```

## Documentación

| Archivo                 | Descripción                         |
| ----------------------- | ----------------------------------- |
| `README.md`             | Documentación completa del proyecto |
| `INSTALACION_RAPIDA.md` | Guía de instalación paso a paso     |
| `DESARROLLO.md`         | Guía técnica para desarrolladores   |
| `CONTRIBUTING.md`       | Cómo contribuir al proyecto         |
| `CHANGELOG.md`          | Historia de versiones y cambios     |

## Estructura del Proyecto

```
TimoBot/
├── App.js                      # Punto de entrada
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── ChatMessage.js      # Burbujas de chat
│   │   ├── ChatInput.js        # Input de texto
│   │   └── Header.js           # Barra superior
│   ├── screens/                # Pantallas
│   │   ├── WelcomeScreen.js    # Bienvenida
│   │   ├── ChatScreen.js       # Chat principal
│   │   └── SettingsScreen.js   # Ajustes
│   ├── store/                  # Estado global (Zustand)
│   │   └── useSettingsStore.js
│   ├── services/               # APIs externas
│   │   └── perplexityApi.js
│   └── utils/                  # Utilidades
│       └── greetings.js
└── assets/                     # Imágenes e iconos
```

## Características Principales

### Chat Inteligente

- Conversaciones naturales con Perplexity AI
- Personalización con tu nombre
- Historial de conversaciones

### Personalización Total

- **Tema:** Claro y oscuro
- **Colores:** 6 opciones predefinidas
- **Fuentes:** 3 tipos de letra
- Todo se guarda automáticamente

### Saludos Dinámicos

- Mensaje diferente cada día de la semana
- Saludo según la hora (buenos días/tardes/noches)
- Emojis temáticos por día

### Historial Local

- Guarda todas tus conversaciones
- Accede a chats anteriores
- Crea múltiples sesiones de chat

## Comandos Disponibles

```bash
# Desarrollo
npm start              # Inicia el servidor de desarrollo
npm start -- -c        # Inicia limpiando caché

# Ejecutar en plataformas
npm run android        # Abre en Android
npm run ios            # Abre en iOS (Mac only)
npm run web            # Abre en navegador

# Utilidades
npm install            # Instala dependencias
npm update             # Actualiza dependencias
```

## Problemas Comunes

### "Command not found: expo"

```bash
npm install -g expo-cli
```

### Error de dependencias

```bash
rm -rf node_modules
npm install
```

### App no se conecta

- Verifica estar en la misma red WiFi
- Intenta con túnel: `expo start --tunnel`

### Caché corrupta

```bash
expo start -c
```

## Primeros Pasos de Personalización

### Cambiar el Nombre del Bot

Busca y reemplaza "TimoBot" en todos los archivos.

### Cambiar el Saludo de Bienvenida

Edita `src/screens/WelcomeScreen.js`:

```javascript
<Text style={styles.title}>¡Hola! Soy TuBot</Text>
```

### Agregar Más Colores

Edita `src/screens/SettingsScreen.js`:

```javascript
const colorOptions = [
  { name: 'Tu Color', value: '#HEXCODE' },
  // ... más colores
];
```

### Modificar Mensajes Mock

Edita `src/services/perplexityApi.js`:

```javascript
const mockResponses = [
  'Tu mensaje personalizado',
  'Otro mensaje',
  // ...
];
```

## Siguientes Pasos

1. ✅ **Explora la app**
   - Prueba todas las funciones
   - Experimenta con diferentes ajustes
   - Crea varios chats

2. 📖 **Lee la documentación**
   - `README.md` para detalles completos
   - `DESARROLLO.md` para modificar código

3. 🔌 **Configura la API**
   - Obtén tu API key de Perplexity
   - Cambia de modo mock a modo real

4. 🎨 **Personaliza**
   - Cambia colores y temas
   - Modifica saludos
   - Agrega tus propias features

5. 🚀 **Comparte**
   - Genera un APK para Android
   - Comparte con amigos
   - Contribuye mejoras

## Soporte

- **Issues:** [GitHub Issues](https://github.com/usuario/timobot/issues)
- **Preguntas:** Lee `README.md` y `DESARROLLO.md`
- **Contribuir:** Lee `CONTRIBUTING.md`

## Checklist de Inicio

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)
- [ ] App abierta en dispositivo
- [ ] Nombre configurado
- [ ] Primer mensaje enviado
- [ ] Ajustes personalizados
- [ ] Documentación leída

## ¡Todo Listo!

Ya tienes TimoBot funcionando. Ahora puedes:

- 💬 **Chatear** con el asistente
- 🎨 **Personalizar** colores y temas
- 📱 **Compartir** con amigos
- 🔧 **Desarrollar** nuevas features
- 🤝 **Contribuir** al proyecto

---

## Roadmap

### Próximamente

- [ ] Soporte para imágenes
- [ ] Reconocimiento de voz
- [ ] Exportar conversaciones
- [ ] Sincronización en la nube
- [ ] Múltiples idiomas

### ¿Quieres contribuir?

Lee `CONTRIBUTING.md` y empieza a desarrollar. ¡Los PRs son bienvenidos!

---

**¡Disfruta usando TimoBot!**

_¿Problemas? Crea un issue._  
_¿Mejoras? ¡Envía un PR!_  
_¿Preguntas? Lee la documentación._
