# TimoBot

**TimoBot** es un asistente conversacional inteligente desarrollado con React Native (Expo) que integra la API de Perplexity para ofrecer respuestas contextuales y personalizadas.

## Tabla de Contenidos

- [Características](#características)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Configuración de la API](#configuración-de-la-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Personalización](#personalización)
- [Solución de Problemas](#solución-de-problemas)
- [Próximas Mejoras](#próximas-mejoras)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- **Chat Inteligente**: Conversaciones naturales powered by Perplexity AI.
- **Personalización**: Guarda tu nombre y te saluda diferente cada día.
- **Temas**: Modo claro y oscuro con colores personalizables.
- **Fuentes**: Elige entre diferentes tipos de letra.
- **Historial**: Guarda y accede a conversaciones anteriores.
- **Saludos Diarios**: Mensaje diferente según el día de la semana.
- **Almacenamiento Local**: Todo se guarda en tu dispositivo.

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/TimoBot.git
   cd TimoBot
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Ejecutar la aplicación**:

   ```bash
   npm start
   ```

4. **Abrir en tu dispositivo**:
   - Escanea el código QR con Expo Go (Android) o la cámara (iOS).
   - O presiona `a` para el emulador de Android.
   - O presiona `i` para el simulador de iOS.

## Configuración de la API

### Modo Mock (Predeterminado)

La aplicación funciona en **modo mock** por defecto. No necesitas configurar nada para probarla.

### Modo API Real

1. **Obtén tu API Key** de [Perplexity AI](https://www.perplexity.ai/).
2. **Crea un archivo `.env`**: `cp .env.example .env`.
3. **Añade tu API key** al archivo `.env`:
   ```
   PERPLEXITY_API_KEY="pplx-..."
   ```

## Estructura del Proyecto

```
TimoBot/
├── App.js
├── package.json
├── ...
└── src/
    ├── components/
    ├── screens/
    ├── store/
    ├── services/
    └── utils/
```

## Arquitectura

- **State Management**: Zustand
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **API**: Axios

## Personalización

### Cambiar Colores y Fuentes

Puedes personalizar los colores y fuentes en la pantalla de **Ajustes**. Para agregar más opciones, edita `src/screens/SettingsScreen.js`.

## Solución de Problemas

- **La app no inicia**: `expo start -c`
- **Error de dependencias**: `rm -rf node_modules && npm install`

## Próximas Mejoras

- [ ] Soporte para imágenes en el chat
- [ ] Búsqueda en el historial
- [ ] Exportar conversaciones

## Contribuciones

Las contribuciones son bienvenidas. Lee `CONTRIBUTING.md` para más detalles.

## Licencia

Este proyecto está bajo la licencia MIT.
