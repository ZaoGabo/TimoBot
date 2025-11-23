# ADR 001: Migración a TypeScript

## Estado
Aceptado

## Contexto
La aplicación TimoBot fue desarrollada originalmente utilizando JavaScript. A medida que la aplicación crecía en complejidad, mantener la calidad del código y prevenir errores en tiempo de ejecución se volvió cada vez más difícil. La falta de tipado estático conducía a problemas que solo se descubrían durante la ejecución, y la refactorización era arriesgada sin la red de seguridad de un sistema de tipos.

## Decisión
Decidimos migrar todo el código base de JavaScript a TypeScript.

## Consecuencias
### Positivas
*   **Seguridad de Tipos**: TypeScript proporciona verificación de tipos estática, lo que detecta errores relacionados con tipos en tiempo de compilación en lugar de en tiempo de ejecución.
*   **Mejor Experiencia de Desarrollo**: Soporte mejorado del IDE con mejor autocompletado, navegación y herramientas de refactorización.
*   **Código Autodocumentado**: Las definiciones de tipos sirven como una forma de documentación, facilitando que los nuevos desarrolladores entiendan las estructuras de datos y las firmas de funciones.
*   **Mantenibilidad**: Más fácil de refactorizar y expandir el código base con confianza.

### Negativas
*   **Curva de Aprendizaje**: El equipo necesita ser competente en los conceptos de TypeScript.
*   **Paso de Compilación**: Requiere un paso de construcción para transpilar TypeScript a JavaScript (manejado por Metro/Expo).
*   **Velocidad Inicial**: El proceso de migración en sí requirió tiempo y esfuerzo significativos para agregar tipos a los componentes y lógica existentes.

## Implementación
La migración se ejecutó en fases:
1.  Configuración de `tsconfig.json` e instalación de dependencias.
2.  Creación de interfaces y tipos compartidos.
3.  Migración de funciones de utilidad y servicios.
4.  Migración de stores de gestión de estado (Zustand).
5.  Migración de componentes y pantallas de React.
