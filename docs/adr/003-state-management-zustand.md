# ADR 003: Gestión de Estado con Zustand

## Estado
Aceptado

## Contexto
La aplicación requiere gestión de estado global para características como configuración de usuario, historial de chat y preferencias de tema. Necesitábamos una solución que fuera ligera, fácil de usar y eficiente, evitando el "boilerplate" de Redux o los posibles problemas de rendimiento de Contextos de React complejos.

## Decisión
Seleccionamos **Zustand** como nuestra biblioteca de gestión de estado.

## Consecuencias
### Positivas
*   **Simplicidad**: Código repetitivo mínimo en comparación con Redux.
*   **Rendimiento**: Los componentes solo se renderizan de nuevo cuando cambian las partes específicas del estado que seleccionan.
*   **Flexibilidad**: Funciona bien con o sin componentes de React (puede acceder al estado fuera de los componentes si es necesario).
*   **Persistencia**: Fácil integración con `AsyncStorage` para persistir el estado (ej. tema, nombre de usuario) a través de middleware.

### Negativas
*   **Ecosistema**: Ecosistema más pequeño que Redux, aunque suficiente para nuestras necesidades.
*   **Patrón**: Requiere disciplina para organizar los stores lógicamente (ej. separando `useChatStore`, `useThemeStore`, `useUserStore`) para evitar un único store monolítico.

## Implementación
Dividimos el estado en stores modulares ubicados en `src/store/`:
*   `useThemeStore`: Gestiona el tema (claro/oscuro), color primario y configuración de fuentes.
*   `useUserStore`: Gestiona la información del perfil del usuario.
*   `useChatStore`: Gestiona sesiones de chat, mensajes e interacción con la base de datos local.
