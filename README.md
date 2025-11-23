# TimoBot

**TimoBot** es un asistente conversacional inteligente desarrollado con React Native (Expo) y **TypeScript** que integra la API de Perplexity para ofrecer respuestas contextuales y personalizadas, y la API de Hugging Face (Whisper) para reconocimiento de voz de alta precisión.

## Tabla de Contenidos

- [Características](#características)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Configuración de la API](#configuración-de-la-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Pruebas y Calidad](#pruebas-y-calidad)
- [Documentación](#documentación)
- [Licencia](#licencia)

## Características

- **Chat Inteligente**: Conversaciones naturales potenciadas por Perplexity AI con efecto de escritura en tiempo real (streaming).
- **Entrada de Voz**: Transcripción de voz a texto de alta precisión utilizando el modelo Whisper de OpenAI a través de Hugging Face.
- **Personalización**: Guarda tu nombre y te saluda diferente cada día.
- **Temas**: Modo claro y oscuro con colores personalizables (Design Tokens).
- **Internacionalización**: Soporte multi-idioma (Español/Inglés).
- **Accesibilidad**: Etiquetas para lectores de pantalla y soporte para escalado de texto dinámico.
- **Historial**: Guarda y accede a conversaciones anteriores localmente.
- **Robustez**: Manejo de errores con Error Boundaries y reconexión automática.

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Expo Go en tu dispositivo móvil o un emulador (Android/iOS)

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

3. **Configurar Secretos**:
   Crea un archivo `secrets.js` en la raíz del proyecto (este archivo está ignorado por git) con tus claves de API:

   ```javascript
   // secrets.js
   module.exports = {
     PERPLEXITY_API_KEY: 'tu-api-key-de-perplexity',
     HUGGING_FACE_TOKEN: 'tu-token-de-hugging-face',
   };
   ```

4. **Ejecutar la aplicación**:

   ```bash
   npm start
   ```

5. **Abrir en tu dispositivo**:
   - Escanea el código QR con Expo Go (Android) o la cámara (iOS).
   - O presiona `a` para el emulador de Android.
   - O presiona `i` para el simulador de iOS.

## Estructura del Proyecto

```
TimoBot/
├── src/
│   ├── components/    # Componentes UI reutilizables (.tsx)
│   ├── screens/       # Pantallas de la aplicación (.tsx)
│   ├── store/         # Gestión de estado con Zustand (.ts)
│   ├── services/      # Servicios de API (Perplexity, Whisper) (.ts)
│   ├── constants/     # Design Tokens (Colores, Tipografía, Espaciado) (.ts)
│   ├── i18n/          # Configuración de idiomas
│   └── utils/         # Funciones de utilidad
├── docs/
│   └── adr/           # Registros de Decisiones de Arquitectura
├── maestro/           # Tests E2E con Maestro
├── .github/           # Workflows de CI/CD
├── App.tsx            # Punto de entrada
└── app.config.js      # Configuración de Expo
```

## Arquitectura

- **Lenguaje**: TypeScript para seguridad de tipos y mantenibilidad.
- **State Management**: Zustand para un manejo de estado global ligero y eficiente.
- **Estilos**: Sistema de Design Tokens centralizado para consistencia visual y tematización.
- **Navegación**: React Navigation (Native Stack).
- **Persistencia**: AsyncStorage para guardar preferencias e historial.
- **Voz**: Expo AV para grabación + Hugging Face Inference API para transcripción.

## Pruebas y Calidad

- **Linting**: ESLint configurado para asegurar calidad de código.
- **CI/CD**: GitHub Actions ejecuta linter y tests en cada push.
- **E2E**: Flujos de prueba automatizados con Maestro.

Para ejecutar el linter:
```bash
npm run lint
```

## Documentación

Las decisiones técnicas importantes están documentadas en `docs/adr/`:
- [ADR 001: Migración a TypeScript](docs/adr/001-typescript-migration.md)
- [ADR 002: Design Tokens](docs/adr/002-design-tokens.md)
- [ADR 003: Gestión de Estado (Zustand)](docs/adr/003-state-management-zustand.md)
- [ADR 004: Entrada de Voz (Whisper)](docs/adr/004-voice-input-whisper.md)
- [ADR 005: CI/CD](docs/adr/005-ci-cd-github-actions.md)

## Licencia

Este proyecto está bajo la licencia MIT.
