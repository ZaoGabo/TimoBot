# ADR 005: Pipeline de CI/CD con GitHub Actions

## Estado
Aceptado

## Contexto
Para asegurar la calidad del código y prevenir regresiones, necesitábamos un sistema automatizado para ejecutar pruebas y verificaciones de linting cada vez que se enviaran cambios de código al repositorio.

## Decisión
Decidimos utilizar **GitHub Actions** para nuestro pipeline de Integración Continua (CI).

## Consecuencias
### Positivas
*   **Integración**: Integración perfecta con nuestro repositorio de GitHub.
*   **Automatización**: Se ejecuta automáticamente en cada push y pull request a `main`.
*   **Aseguramiento de Calidad**: Impone estándares de calidad de código (linting) y funcionalidad (pruebas) antes de que el código se fusione.
*   **Costo**: Gratis para repositorios públicos y tiene un nivel gratuito generoso para los privados.

### Negativas
*   **Configuración**: Requiere mantenimiento de archivos de configuración YAML.
*   **Tiempo de Ejecución**: Las ejecuciones de CI pueden tomar tiempo, retrasando potencialmente los flujos de trabajo de fusión si no se optimizan.

## Implementación
Creamos un archivo de flujo de trabajo `.github/workflows/ci.yml` que:
1.  Se activa en pushes y pull requests a `main`.
2.  Configura un entorno Node.js.
3.  Instala dependencias usando `npm ci`.
4.  Ejecuta el linter (`npm run lint`).
5.  Ejecuta pruebas unitarias (`npm test`).
