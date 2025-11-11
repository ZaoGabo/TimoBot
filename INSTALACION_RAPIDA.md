# Instalación Rápida de TimoBot

Guía Rápida de Instalación - TimoBot corriendo en 5 minutos.

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

```bash
# Node.js (v16 o superior)
node --version

# npm (viene con Node.js)
npm --version
```

Si no tienes Node.js: [Descargar aquí](https://nodejs.org/)

## Instalación en 4 Pasos

### 1. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y coloca tu API key real
PERPLEXITY_API_KEY="pplx-..."
```

> ⚠️ No subas el archivo `.env` a Git: ya está ignorado por defecto.

### 2. Instalar Dependencias

```bash
# Navega a la carpeta del proyecto
cd TimoBot

# Instala las dependencias
npm install
```

### 3. Iniciar la Aplicación

```bash
npm run start
# o
npx expo start
```

Verás algo como esto:
```
› Metro waiting on exp://192.168.1.X:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 4. Abrir en tu Dispositivo

**Opción A - Dispositivo Físico:**

1. Descarga **Expo Go** desde:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Abre Expo Go y escanea el código QR

**Opción B - Emulador:**

```bash
# Android (requiere Android Studio + SDK configurado)
npm run android

# iOS (solo en Mac con Xcode)
npm run ios
```

## ¡Listo!

La app debería estar corriendo. Verás:
1. Pantalla de bienvenida pidiendo tu nombre
2. Después, el chat con TimoBot

## Solución Rápida de Problemas

### Error: "Command not found: expo"

Usa `npx expo <comando>` para evitar instalar Expo CLI globalmente.

### Error de dependencias

```bash
# Limpia e instala
rm -rf node_modules
npm install
```

### Puerto en uso

```bash
# Inicia en otro puerto
expo start --port 8082
```

### Caché corrupta

```bash
# Limpia caché de Expo
expo start -c
```

### No aparece el código QR

```bash
# Ejecuta en modo túnel (más lento pero funciona con firewall)
expo start --tunnel
```

## Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Limpiar caché
expo start -c

# Ver en web
npm run web

# Android
npm run android

# iOS
npm run ios

# Actualizar dependencias
npm update

# Ver logs
expo logs
```

## ¿Necesitas Ayuda?

### Documentación Adicional

- Lee `README.md` para información detallada
- Lee `DESARROLLO.md` para guía técnica

### Problemas Comunes

1. **App no se conecta:** Verifica que estés en la misma red WiFi
2. **Errores de instalación:** Actualiza Node.js y npm
3. **Pantalla en blanco:** Revisa la consola de Expo
4. **Tipado lento:** Es normal en desarrollo, en producción es más rápido

### Recursos

- [Documentación Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnavigation.org/)
- [Perplexity API](https://docs.perplexity.ai/)

## Checklist de Instalación

- [ ] Node.js instalado (v16+)
- [ ] Expo CLI instalado globalmente
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)
- [ ] App abierta en dispositivo/emulador
- [ ] Nombre configurado en primera apertura
- [ ] Chat funcionando (modo mock)
- [ ] Ajustes personalizados

## Próximos Pasos

Una vez que la app esté funcionando:

1. **Explora las funciones:**
   - Envía varios mensajes
   - Prueba diferentes días (cambia fecha del sistema)
   - Experimenta con temas y colores
   - Crea múltiples chats

2. **Personaliza:**
   - Cambia los colores
   - Modifica los saludos
   - Ajusta los mensajes mock

3. **Configura la API:**
   - Obtén tu API key de Perplexity
   - Configúrala en el proyecto
   - Prueba con la API real

4. **Desarrolla:**
   - Lee `DESARROLLO.md`
   - Agrega nuevas funciones
   - Mejora el diseño
   - Contribuye al proyecto

## Build para Producción

### Android APK

```bash
# Instala EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configura el proyecto
eas build:configure

# Genera APK
eas build --platform android --profile preview
```

### iOS IPA

```bash
# Requiere cuenta de Apple Developer
eas build --platform ios --profile preview
```

## Tips Finales

1. **Desarrollo:**
   - Usa `expo start -c` si algo no funciona
   - Revisa la consola de Expo siempre
   - Guarda cambios para hot-reload automático

2. **Testing:**
   - Prueba en diferentes dispositivos
   - Verifica ambos temas (claro/oscuro)
   - Testea con/sin conexión

3. **Producción:**
   - Configura la API real antes de publicar
   - Crea assets personalizados
   - Testea exhaustivamente

---

**¡Disfruta desarrollando con TimoBot!**

¿Problemas? Crea un issue en el repositorio.
¿Mejoras? ¡Los PRs son bienvenidos!
