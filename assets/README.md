# Assets de TimoBot

Esta carpeta contiene los recursos gráficos de la aplicación.

## 📁 Archivos Requeridos

### icon.png
- **Tamaño:** 1024x1024 px
- **Formato:** PNG con transparencia
- **Uso:** Icono principal de la app

### splash.png
- **Tamaño:** 1242x2436 px (ratio 9:19.5)
- **Formato:** PNG
- **Uso:** Pantalla de splash

### adaptive-icon.png (Android)
- **Tamaño:** 1024x1024 px
- **Formato:** PNG con transparencia
- **Uso:** Icono adaptativo de Android
- **Área segura:** 512x512 px en el centro

### favicon.png (Web)
- **Tamaño:** 48x48 px
- **Formato:** PNG
- **Uso:** Favicon para versión web

## 🎨 Recomendaciones de Diseño

### Icono Principal (icon.png)
- Usar colores del branding de TimoBot
- Incluir el emoji 🤖 o una versión estilizada
- Fondo con gradiente o color sólido
- Asegurar buena visibilidad en diferentes tamaños

### Splash Screen (splash.png)
- Fondo blanco (#FFFFFF) o del color principal
- Centrar el logo/icono
- Texto "TimoBot" debajo del icono (opcional)
- Mantener diseño minimalista

## 🛠️ Herramientas Sugeridas

### Generadores Online
- [App Icon Generator](https://www.appicon.co/)
- [Expo Asset Generator](https://github.com/dwmkerr/app-icon)
- [MakeAppIcon](https://makeappicon.com/)

### Software de Diseño
- Figma (gratis)
- Adobe Illustrator
- Sketch
- Canva

## 📝 Cómo Reemplazar los Assets

1. Crea tus imágenes con las dimensiones correctas
2. Nómbralas exactamente como se indica arriba
3. Colócalas en esta carpeta (`assets/`)
4. Reinicia Expo: `expo start -c`

## 🚀 Generar Assets Automáticamente

Si tienes un solo diseño en 1024x1024:

```bash
# Instalar generador
npm install -g @expo/generate-assets

# Generar assets
npx @expo/generate-assets assets/icon.png
```

## 📐 Dimensiones Completas

| Asset | iOS | Android | Tamaño Base |
|-------|-----|---------|-------------|
| App Icon | ✅ | ✅ | 1024x1024 |
| Splash | ✅ | ✅ | 1242x2436 |
| Adaptive Icon | ❌ | ✅ | 1024x1024 |
| Favicon | ❌ | ❌ | 48x48 |

## 🎯 Placeholder Actual

Actualmente la app usa los assets por defecto de Expo.
Reemplázalos con tus propios diseños para personalizar TimoBot.

---

**Nota:** Los archivos de assets NO están incluidos en el repositorio por defecto.
Debes crearlos o usar los placeholders de Expo.
