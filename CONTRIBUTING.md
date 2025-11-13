# 🤝 Guía de Contribución - TimoBot

¡Gracias por tu interés en contribuir a TimoBot! Este documento te guiará en el proceso.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Estilo de Código](#estilo-de-código)
- [Estructura de Commits](#estructura-de-commits)
- [Testing](#testing)

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y acogedor para todos.

### Nuestros Estándares

✅ **Se recomienda:**

- Usar lenguaje inclusivo y acogedor
- Respetar diferentes puntos de vista
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

❌ **No se tolera:**

- Lenguaje o imágenes sexualizadas
- Comentarios insultantes o despectivos
- Acoso público o privado
- Publicar información privada de otros
- Conducta no profesional

## 🚀 ¿Cómo Contribuir?

### 1. Fork del Repositorio

```bash
# Clona tu fork
git clone https://github.com/tu-usuario/timobot.git
cd timobot

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/original/timobot.git
```

### 2. Crea una Rama

```bash
# Actualiza tu main
git checkout main
git pull upstream main

# Crea una rama para tu feature
git checkout -b feature/nombre-feature
# o para un bugfix
git checkout -b fix/nombre-bug
```

### 3. Haz tus Cambios

```bash
# Escribe código
# Prueba tus cambios
# Documenta lo necesario
```

### 4. Commit

```bash
git add .
git commit -m "feat: descripción breve del cambio"
```

### 5. Push

```bash
git push origin feature/nombre-feature
```

### 6. Pull Request

Abre un PR desde tu rama hacia `main` del repositorio original.

## 🐛 Reportar Bugs

### Antes de Reportar

- Verifica que no exista un issue similar
- Asegúrate de que sea reproducible
- Prueba en la última versión

### Cómo Reportar

Crea un issue con:

**Título:** Descripción breve y clara

**Descripción:**

```markdown
## Descripción del Bug

[Descripción clara del problema]

## Pasos para Reproducir

1. Ve a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento Esperado

[Qué debería pasar]

## Comportamiento Actual

[Qué pasa actualmente]

## Screenshots

[Si aplica, agrega capturas]

## Entorno

- OS: [e.g. iOS 16, Android 13]
- Versión de la App: [e.g. 1.0.0]
- Dispositivo: [e.g. iPhone 14, Pixel 7]
- Versión de Expo: [e.g. 50.0.0]

## Información Adicional

[Cualquier otro contexto relevante]
```

## 💡 Sugerir Mejoras

### Antes de Sugerir

- Verifica que no exista una sugerencia similar
- Asegúrate de que la feature tiene sentido para el proyecto

### Cómo Sugerir

Crea un issue con:

```markdown
## Descripción de la Feature

[Descripción clara de la funcionalidad]

## Motivación

[Por qué es útil esta feature]

## Propuesta de Implementación

[Ideas de cómo implementarlo]

## Alternativas Consideradas

[Otras formas de resolver el problema]

## Información Adicional

[Mockups, ejemplos, referencias]
```

## 🔄 Pull Requests

### Checklist

Antes de enviar un PR, verifica:

- [ ] El código sigue el estilo del proyecto
- [ ] Has ejecutado los linters
- [ ] Has actualizado la documentación
- [ ] Has agregado tests (si aplica)
- [ ] Todos los tests pasan
- [ ] Has actualizado el CHANGELOG.md
- [ ] Tu commit message sigue las convenciones
- [ ] Has probado en iOS y Android

### Plantilla de PR

```markdown
## Descripción

[Descripción clara de los cambios]

## Tipo de Cambio

- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva feature (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa cambios incompatibles)
- [ ] Documentación

## ¿Cómo se ha Probado?

[Describe las pruebas realizadas]

## Screenshots

[Si aplica, agrega capturas]

## Checklist

- [ ] Mi código sigue el estilo del proyecto
- [ ] He realizado self-review
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests
- [ ] Tests nuevos y existentes pasan

## Issues Relacionados

Closes #123
Related to #456
```

## 🎨 Estilo de Código

### JavaScript/React Native

#### Formato

```javascript
// ✅ Bueno
const Component = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Lógica
  }, [state]);

  return (
    <View style={styles.container}>
      <Text>Contenido</Text>
    </View>
  );
};

// ❌ Malo
const Component = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  return (
    <View>
      <Text>Contenido</Text>
    </View>
  );
};
```

#### Naming

```javascript
// ✅ Componentes: PascalCase
const ChatMessage = () => {};

// ✅ Variables: camelCase
const userName = 'Juan';

// ✅ Constantes: UPPER_SNAKE_CASE
const API_KEY = 'xxx';

// ✅ Archivos de componentes: PascalCase.js
// ChatMessage.js, SettingsScreen.js

// ✅ Archivos de utils: camelCase.js
// greetings.js, helpers.js
```

#### Imports

```javascript
// ✅ Orden correcto
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettingsStore from '../store/useSettingsStore';
import ChatMessage from '../components/ChatMessage';

// Línea en blanco

// Línea en blanco
const Component = () => {
  // ...
};
```

#### Props

```javascript
// ✅ Destructuring
const Component = ({ title, onPress }) => {};

// ✅ Default props
const Component = ({ title = 'Default', onPress }) => {};

// ✅ PropTypes (opcional pero recomendado)
Component.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};
```

### Estilos

```javascript
// ✅ StyleSheet al final del archivo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

// ✅ Inline styles solo para valores dinámicos
<View style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]} />;
```

### Comentarios

```javascript
/**
 * Descripción de la función
 * @param {string} message - Descripción del parámetro
 * @returns {Promise<string>} - Descripción del retorno
 */
const sendMessage = async (message) => {
  // Implementación
};

// Comentario de línea para lógica compleja
const result = complexCalculation(); // Por qué es necesario
```

## 📝 Estructura de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Tipos

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma, etc.
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Mantenimiento, dependencies, etc.
- `perf:` Mejoras de rendimiento

### Ejemplos

```bash
# ✅ Buenos commits
feat: agregar búsqueda en historial de chats
fix: corregir scroll en iOS
docs: actualizar README con instalación
style: formatear código con prettier
refactor: extraer lógica de API a hook
test: agregar tests para ChatMessage
chore: actualizar dependencias

# ❌ Malos commits
updated stuff
fix
changes
WIP
```

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

Ejemplo completo:

```
feat(chat): agregar soporte para imágenes

- Permite subir imágenes desde galería
- Preview de imagen antes de enviar
- Compresión automática

Closes #123
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Escribir Tests

```javascript
import { render, fireEvent } from '@testing-library/react-native';
import ChatInput from '../ChatInput';

describe('ChatInput', () => {
  it('should render correctly', () => {
    const { getByPlaceholder } = render(<ChatInput />);
    expect(getByPlaceholder('Escribe tu mensaje...')).toBeTruthy();
  });

  it('should call onSend when button is pressed', () => {
    const mockOnSend = jest.fn();
    const { getByPlaceholder, getByTestId } = render(<ChatInput onSend={mockOnSend} />);

    const input = getByPlaceholder('Escribe tu mensaje...');
    fireEvent.changeText(input, 'Hola');

    const button = getByTestId('send-button');
    fireEvent.press(button);

    expect(mockOnSend).toHaveBeenCalledWith('Hola');
  });
});
```

## 🏗️ Áreas de Contribución

### Fácil (Good First Issues)

- Corregir typos en documentación
- Mejorar mensajes de error
- Agregar comentarios al código
- Actualizar README
- Agregar ejemplos

### Media

- Implementar nuevas features pequeñas
- Corregir bugs conocidos
- Mejorar UI/UX
- Optimizar rendimiento
- Agregar tests

### Avanzada

- Implementar features complejas
- Refactorizar arquitectura
- Migrar a TypeScript
- Implementar CI/CD
- Integrar nuevas APIs

## 📬 Contacto

- Issues: [GitHub Issues](https://github.com/usuario/timobot/issues)
- Discussions: [GitHub Discussions](https://github.com/usuario/timobot/discussions)

## 🙏 Agradecimientos

Gracias a todos los que contribuyen a hacer TimoBot mejor cada día.

### Hall of Fame

- [Tu nombre aquí] - Primera contribución
- [Tu nombre aquí] - Mejor feature
- [Tu nombre aquí] - Más commits

---

**¿Tienes dudas?** No dudes en abrir un issue o discussion.
**¡Esperamos tu contribución! 🚀**
