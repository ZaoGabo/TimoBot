# ADR 002: Implementación de Design Tokens

## Estado
Aceptado

## Contexto
El estilo de la aplicación era inconsistente, con valores codificados ("números mágicos" y códigos hex) dispersos por los componentes. Esto dificultaba:
*   Mantener una identidad visual consistente.
*   Implementar y cambiar entre temas (Claro/Oscuro).
*   Actualizar estilos globales (por ejemplo, cambiar el color primario o el tamaño de fuente).

## Decisión
Decidimos implementar un sistema de Design Tokens para centralizar todas las constantes de estilo.

## Consecuencias
### Positivas
*   **Consistencia**: Asegura colores, espaciado y tipografía uniformes en toda la aplicación.
*   **Mantenibilidad**: Los cambios de estilo globales se pueden hacer en una sola ubicación (`src/constants`).
*   **Tematización**: Simplifica la implementación del modo oscuro y temas dinámicos usando nombres de tokens semánticos (ej. `themeColors.background`) en lugar de valores crudos.
*   **Escalabilidad**: Más fácil de agregar nuevos temas o ajustar el sistema de diseño en el futuro.

### Negativas
*   **Indirección**: Los desarrolladores deben buscar nombres de tokens en lugar de escribir valores directamente, lo que podría ralentizar ligeramente el desarrollo inicial hasta que se establezca familiaridad.

## Implementación
Creamos un directorio `src/constants` con la siguiente estructura:
*   `colors.ts`: Define paletas de colores y roles semánticos (primario, error, fondo, etc.).
*   `typography.ts`: Define familias de fuentes, tamaños y pesos.
*   `spacing.ts`: Define unidades de espaciado, dimensiones de diseño y radios de borde.
*   `index.ts`: Exporta todos los tokens para un consumo fácil.

Los componentes fueron refactorizados para consumir estos tokens a través del hook `useThemeStore` o importaciones directas.
