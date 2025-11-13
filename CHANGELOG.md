# Changelog

Todos los cambios notables de TimoBot serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2024-11-09

### Lanzamiento Inicial

#### Agregado

- **Pantalla de Bienvenida**
  - Solicitud de nombre del usuario
  - Validación de entrada
  - Animación de fade-in
  - Almacenamiento permanente del nombre

- **Pantalla de Chat Principal**
  - Integración con API de Perplexity
  - Modo mock para pruebas sin API
  - Saludos personalizados diarios
  - Burbujas de chat diferenciadas (usuario/bot)
  - Indicador de "escribiendo..."
  - Auto-scroll a mensajes nuevos
  - Botón para iniciar nuevo chat

- **Sistema de Historial**
  - Guardado automático de conversaciones
  - Acceso a chats anteriores
  - Preview de cada conversación
  - Timestamp formateado
  - Opción de eliminar chats antiguos
  - Cargar conversaciones previas

- **Pantalla de Ajustes**
  - Toggle tema claro/oscuro
  - Selector de 6 colores principales:
    - Azul (#4A90E2)
    - Verde (#2ECC71)
    - Morado (#9B59B6)
    - Naranja (#E67E22)
    - Rojo (#E74C3C)
    - Rosa (#FF6B9D)
  - Selector de 3 tipos de letra:
    - Predeterminada
    - Serif
    - Monospace
  - Opción para borrar historial
  - Opción para reiniciar nombre
  - Información de versión

- **Componentes Reutilizables**
  - ChatMessage: Burbujas de mensaje personalizables
  - ChatInput: Input con validación y límites
  - Header: Barra de navegación adaptable

- **Estado Global (Zustand)**
  - Gestión de preferencias de usuario
  - Manejo de historial de chat
  - Persistencia en AsyncStorage
  - Carga automática al iniciar

- **Servicios**
  - Integración con Perplexity AI
  - Sistema de mock para desarrollo
  - Manejo robusto de errores
  - Personalización de respuestas

- **Utilidades**
  - Saludos personalizados por día de semana
  - Formateo inteligente de fechas
  - Manejo de timezones

#### Diseño

- Interfaz limpia y minimalista
- Soporte completo para tema oscuro
- Colores personalizables
- Tipografía adaptable
- Animaciones suaves
- Iconos de Ionicons
- Diseño responsive

#### Configuración

- Proyecto Expo configurado
- Navegación con React Navigation
- Babel configurado
- ESLint y Prettier (opcional)
- Variables de entorno
- Git ignore adecuado

#### Documentación

- README.md completo
- DESARROLLO.md con guía técnica
- Comentarios en código
- Estructura de carpetas clara
- Ejemplos de uso

#### Internacionalización

- Interfaz en español
- Saludos contextuales en español
- Formato de fechas en español
- Mensajes de error en español

### Seguridad

- API keys no incluidas en el código
- Ejemplo de .env
- AsyncStorage para datos locales
- Validación de inputs

### Rendimiento

- Lazy loading de pantallas
- Optimización de FlatList
- Memoización de componentes
- Reducción de re-renders innecesarios

### Conocidos

- Los assets de iconos usan placeholders de Expo
- El modo mock es limitado en contexto de conversación
- No hay soporte offline completo
- No hay sincronización en la nube

### Notas de Desarrollo

- Versión de React Native: 0.73.0
- Versión de Expo: ~50.0.0
- Node.js requerido: v16+
- Plataformas soportadas: iOS, Android, Web (beta)

---

## [Unreleased]

### Próximas Características

- [ ] Soporte para imágenes en chat
- [ ] Reconocimiento de voz
- [ ] Síntesis de voz (Text-to-Speech)
- [ ] Búsqueda en historial
- [ ] Exportar conversaciones (PDF/TXT)
- [ ] Backup en la nube
- [ ] Sincronización entre dispositivos
- [ ] Notificaciones push
- [ ] Widget para home screen
- [ ] Modo offline con caché
- [ ] Múltiples idiomas
- [ ] Temas personalizados
- [ ] Estadísticas de uso
- [ ] Integración con otros LLMs
- [ ] Comandos rápidos

### Mejoras Planificadas

- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] CI/CD con GitHub Actions
- [ ] TypeScript migration
- [ ] Mejoras de accesibilidad
- [ ] Optimizaciones de rendimiento
- [ ] Mejor manejo de errores de red
- [ ] Retry automático en errores
- [ ] Indicador de estado de conexión

### Bugs por Corregir

- [ ] Scroll intermitente en iOS
- [ ] Keyboard overlay en Android
- [ ] Memory leaks en navegación
- [ ] Formato de fechas en timezone diferente

---

## Tipos de Cambios

- **Agregado** - Para nuevas características
- **Cambiado** - Para cambios en funcionalidad existente
- **Deprecado** - Para características que serán removidas
- **Removido** - Para características removidas
- **Corregido** - Para corrección de bugs
- **Seguridad** - Para vulnerabilidades

---

**Convención de Versionado:**

- MAJOR: Cambios incompatibles de API
- MINOR: Nueva funcionalidad compatible hacia atrás
- PATCH: Correcciones de bugs compatibles hacia atrás
