# ADR 004: Estrategia de Entrada de Voz (Hugging Face Whisper)

## Estado
Aceptado

## Contexto
Queríamos agregar funcionalidad de voz a texto a TimoBot. Las APIs nativas (`expo-speech-recognition` o APIs específicas de la plataforma) a menudo tienen limitaciones con respecto al soporte de idiomas, precisión o consistencia entre iOS y Android. Necesitábamos una solución robusta y de alta precisión.

## Decisión
Decidimos utilizar la **API de Inferencia de Hugging Face** ejecutando el modelo **OpenAI Whisper** para la transcripción de voz a texto.

## Consecuencias
### Positivas
*   **Precisión**: Whisper es de última generación y proporciona una precisión de transcripción superior en comparación con muchos modelos nativos en el dispositivo.
*   **Soporte Multi-idioma**: Excelente soporte para múltiples idiomas, incluyendo español e inglés.
*   **Consistencia**: Proporciona los mismos resultados independientemente del dispositivo del usuario (iOS vs Android).

### Negativas
*   **Dependencia de Red**: Requiere una conexión a internet activa para transcribir audio.
*   **Latencia**: Hay un retraso mientras el audio se sube y procesa por la API.
*   **Costo/Límites**: El nivel gratuito de Hugging Face tiene límites de tasa (aprox. 1k solicitudes/día), lo cual es suficiente para desarrollo pero podría requerir un plan pago para escalar.
*   **Privacidad**: Los datos de audio se envían a un servidor de terceros (Hugging Face) para su procesamiento.

## Implementación
*   Integramos `expo-av` para grabar audio en el dispositivo.
*   Implementamos un servicio `src/services/speechToText.ts` que sube el archivo de audio grabado a la API de Hugging Face.
*   Aseguramos el token de la API usando un archivo `secrets.js` (no comprometido en el control de versiones).
