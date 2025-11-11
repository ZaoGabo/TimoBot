# TimoBot

**TimoBot** es un asistente conversacional inteligente desarrollado con React Native (Expo) que integra la API de Perplexity para ofrecer respuestas contextuales y personalizadas.

## Características

- **Chat Inteligente**: Conversaciones naturales powered by Perplexity AI
- **Personalización**: Guarda tu nombre y te saluda diferente cada día
- **Temas**: Modo claro y oscuro con colores personalizables
- **Fuentes**: Elige entre diferentes tipos de letra
- **Historial**: Guarda y accede a conversaciones anteriores
- **Saludos Diarios**: Mensaje diferente según el día de la semana
- **Almacenamiento Local**: Todo se guarda en tu dispositivo

## Capturas de Pantalla

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Bienvenida     │  │  Chat Principal │  │    Ajustes      │
│                 │  │                 │  │                 │
│      │         │  │  Mensaje 1   │  │  Tema        │
│                 │  │  Mensaje 2   │  │  Color       │
│  Tu nombre:     │  │  Mensaje 3   │  │  Fuente      │
│  [________]     │  │                 │  │  Limpiar     │
│                 │  │  [Escribir...]  │  │                 │
│  [Comenzar]     │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Expo Go app en tu dispositivo móvil (opcional)

### Pasos de Instalación

1. **Clonar el repositorio** (o descargar los archivos)
```bash
cd TimoBot
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Ejecutar la aplicación**
```bash
npm start
# o
expo start
```

4. **Abrir en tu dispositivo**
   - Escanea el código QR con Expo Go (Android) o la cámara (iOS)
   - O presiona `a` para Android emulator
   - O presiona `i` para iOS simulator

## Configuración de la API de Perplexity

### Modo Mock (Predeterminado)

Por defecto, la aplicación funciona en **modo mock** con respuestas simuladas. No necesitas configurar nada para probar la app.

### Modo API Real (Recomendado: Proxy en Vercel)

1. **Obtén tu API Key**
   - Visita [Perplexity AI](https://www.perplexity.ai/)
   - Crea una cuenta y genera tu API key

2. **Despliega el proxy en Vercel**
   - Crea un repositorio aparte (por ejemplo, `timobot-backend`) con el contenido de `backend-vercel/`.
   - Conecta ese repositorio a [Vercel](https://vercel.com/) y despliega; la función estará disponible en `https://tu-backend.vercel.app/api/perplexity`.
   - En *Project Settings → Environment Variables* agrega `PERPLEXITY_API_KEY` con tu clave de Perplexity y vuelve a desplegar.

3. **Configura el cliente**
   - Copia el archivo de entorno si aún no lo has hecho:
     ```bash
     cp .env.example .env
     ```
   - Edita `.env` y añade la URL de tu despliegue:
     ```env
     PERPLEXITY_PROXY_URL=https://tu-backend.vercel.app
     ```
   - (Opcional) añade `PERPLEXITY_API_KEY` si quieres que el proyecto pueda funcionar sin proxy durante desarrollo.

4. **Inicia la aplicación**
   ```bash
   npm run start
   ```

Con esta configuración la app móvil enviará las solicitudes a Vercel, y la clave de Perplexity nunca viajará al cliente ni se expondrá en el repositorio.

### Opción alternativa: Llamada directa desde el cliente

Si necesitas conectarte directamente (por ejemplo, para pruebas rápidas), puedes rellenar `PERPLEXITY_API_KEY` en `.env`. Ten en cuenta que cualquier build distribuida contendrá la clave, por lo que no es recomendable para producción.

## Estructura del Proyecto

```
TimoBot/
├── App.js                          # Punto de entrada principal
├── app.json                        # Configuración de Expo
├── package.json                    # Dependencias
├── babel.config.js                 # Configuración de Babel
├── .env.example                    # Ejemplo de variables de entorno
├── README.md                       # Este archivo
│
└── src/
    ├── components/                 # Componentes reutilizables
    │   ├── ChatMessage.js          # Burbuja de mensaje
    │   ├── ChatInput.js            # Input de texto
    │   └── Header.js               # Barra superior
    │
    ├── screens/                    # Pantallas principales
    │   ├── WelcomeScreen.js        # Pantalla de bienvenida
    │   ├── ChatScreen.js           # Pantalla de chat
    │   └── SettingsScreen.js       # Pantalla de ajustes
    │
    ├── store/                      # Estado global
    │   └── useSettingsStore.js     # Zustand store
    │
    ├── services/                   # Servicios externos
    │   └── perplexityApi.js        # API de Perplexity
    │
    └── utils/                      # Utilidades
        └── greetings.js            # Saludos personalizados
```

## Personalización

### Cambiar Colores

En la pantalla de **Ajustes**, puedes elegir entre 6 colores predefinidos:
- Azul
- Verde
- Morado
- Naranja
- Rojo
- Rosa

### Agregar Más Colores

Edita `src/screens/SettingsScreen.js`:

```javascript
const colorOptions = [
  { name: 'Tu Color', value: '#HEXCODE' },
  // ... más colores
];
```

### Cambiar Fuentes

Por defecto hay 3 opciones:
- Predeterminada
- Serif
- Monospace

Para agregar fuentes personalizadas, usa `expo-google-fonts`:

```bash
npm install @expo-google-fonts/roboto
```

```javascript
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
```

## Tecnologías Utilizadas

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **Zustand** - Manejo de estado
- **AsyncStorage** - Almacenamiento local
- **Axios** - Cliente HTTP
- **Day.js** - Manejo de fechas
- **React Navigation** - Navegación entre pantallas
- **Perplexity AI** - API de inteligencia artificial

## Funcionalidades Detalladas

### 1. Pantalla de Bienvenida
- Se muestra solo la primera vez
- Solicita el nombre del usuario
- Animación de fade-in
- Valida que el nombre no esté vacío

### 2. Pantalla de Chat
- Saludo personalizado según el día
- Burbujas de chat diferenciadas (usuario/bot)
- Indicador de "escribiendo..."
- Botón para nuevo chat
- Acceso rápido al historial
- Auto-scroll al último mensaje

### 3. Pantalla de Ajustes
- Toggle de tema claro/oscuro
- Selector de color principal
- Selector de tipo de letra
- Opción para borrar historial
- Opción para cambiar nombre
- Información de versión

### 4. Historial de Chats
- Guarda automáticamente al crear nuevo chat
- Muestra fecha y preview del chat
- Permite cargar chat anterior
- Permite eliminar chats

## Solución de Problemas

### La app no inicia
```bash
# Limpiar caché
expo start -c
```

### Error de dependencias
```bash
# Reinstalar
rm -rf node_modules
npm install
```

### Problemas con AsyncStorage
```bash
# En iOS
cd ios && pod install && cd ..

# Reinstalar la dependencia
npm install @react-native-async-storage/async-storage
```

### Error con la API
- Verifica que `USE_MOCK = false` si quieres usar la API real
- Verifica que tu API key sea válida
- Revisa los límites de tu plan en Perplexity

## Próximas Mejoras

- [ ] Soporte para imágenes en el chat
- [ ] Búsqueda en el historial
- [ ] Exportar conversaciones
- [ ] Reconocimiento de voz
- [ ] Notificaciones push
- [ ] Backup en la nube
- [ ] Múltiples idiomas
- [ ] Temas personalizados
- [ ] Widget para pantalla de inicio

## Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo y modificarlo.

## Autor

Desarrollado con ❤️ para crear asistentes conversacionales inteligentes.

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de Solución de Problemas
2. Busca en los Issues existentes
3. Crea un nuevo Issue con detalles del problema

---

**¡Disfruta usando TimoBot! 🤖💬**
