import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

// Configuración adicional de Expo
const extraConfig = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const HUGGING_FACE_TOKEN =
    extraConfig.huggingFaceToken ??
    process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN ??
    null;

// Modelo Whisper de Hugging Face
const WHISPER_MODEL = 'openai/whisper-base'; // Rápido y preciso
// Alternativa: 'openai/whisper-large-v3' para mejor calidad pero más lento

/**
 * Transcribe un archivo de audio a texto usando el modelo Whisper de Hugging Face
 * @param {string} audioUri - URI local del archivo de audio
 * @returns {Promise<string>} - Texto transcrito
 */
export const transcribeAudio = async (audioUri: string): Promise<string> => {
    try {
        if (!HUGGING_FACE_TOKEN) {
            throw new Error('Token de Hugging Face no configurado');
        }

        console.log('Transcribiendo audio:', audioUri);

        // Leer archivo de audio como base64
        const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
            encoding: 'base64',
        });

        // Convertir base64 a binario
        const audioData = atob(audioBase64);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
        }

        // Llamada a la API de Hugging Face Inference
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${WHISPER_MODEL}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
                    'Content-Type': 'audio/wav',
                },
                body: audioArray,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error API HF:', errorText);

            // Verificar si el modelo está cargando
            if (response.status === 503) {
                throw new Error('El modelo está cargando. Por favor intenta en 30 segundos.');
            }

            throw new Error(`Error en la API: ${response.status}`);
        }

        const result = await response.json();
        console.log('Resultado de transcripción:', result);
        return result.text || '';
    } catch (error) {
        console.error('Error al transcribir audio:', error);
        throw error;
    }
};

/**
 * Verifica si Hugging Face está configurado
 * @returns {boolean}
 */
export const isHuggingFaceConfigured = (): boolean => {
    return !!HUGGING_FACE_TOKEN;
};
