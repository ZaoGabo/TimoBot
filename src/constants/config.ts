/**
 * Constantes de Configuración de la App
 * Tiempos de espera, límites, configuraciones de API, etc.
 */

export const Config = {
    // Configuración de API
    api: {
        perplexity: {
            defaultModel: 'sonar',
            maxTokens: 1000,
            temperature: 0.7,
            topP: 0.9,
            timeout: 30000, // 30 segundos
        },
        huggingFace: {
            whisperModel: 'openai/whisper-base',
            timeout: 20000, // 20 segundos
        },
        retry: {
            maxAttempts: 3,
            initialDelay: 1000, // 1 segundo
            backoffMultiplier: 2,
        },
    },

    // Límites de Entrada
    input: {
        messageMaxLength: 500,
        messageMinLength: 1,
        userNameMaxLength: 50,
    },

    // Duraciones de Animación (ms)
    animation: {
        fast: 200,
        normal: 300,
        slow: 600,
        pulseDuration: 600,
    },

    // Rendimiento
    performance: {
        flatList: {
            windowSize: 21,
            maxToRenderPerBatch: 10,
            updateCellsBatchingPeriod: 50,
            initialNumToRender: 15,
        },
        debounceDelay: 300,
    },

    // Base de Datos
    database: {
        name: 'timobot.db',
        maxHistoryItems: 10, // Para llamadas a la API
    },

    // Grabación de Voz
    voiceRecording: {
        quality: 'HIGH_QUALITY',
        maxDuration: 60000, // 60 segundos
        minDuration: 500,   // 0.5 segundos
    },

    // Claves de Almacenamiento
    storageKeys: {
        theme: '@timobot_theme',
        language: '@timobot_language',
        userName: '@timobot_userName',
        isFirstTime: '@timobot_isFirstTime',
        primaryColor: '@timobot_primaryColor',
        fontFamily: '@timobot_fontFamily',
    },

    // URLs
    urls: {
        perplexityApi: 'https://api.perplexity.ai/chat/completions',
        defaultProxy: 'https://backend-timobot.vercel.app',
        huggingFaceInference: 'https://api-inference.huggingface.co',
    },
};

// Exportar secciones individuales para conveniencia
export const ApiConfig = Config.api;
export const InputLimits = Config.input;
export const AnimationDurations = Config.animation;
export const PerformanceConfig = Config.performance;
export const StorageKeys = Config.storageKeys;
export const URLs = Config.urls;
