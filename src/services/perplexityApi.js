import axios from 'axios';
import Constants from 'expo-constants';

// Configuración de la API
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

const extraConfig = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const runtimeApiKey = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY ?? process.env.PERPLEXITY_API_KEY ?? null;
const runtimeProxyUrl = process.env.EXPO_PUBLIC_PERPLEXITY_PROXY_URL ?? process.env.PERPLEXITY_PROXY_URL ?? null;
const runtimeTimobotKey = process.env.EXPO_PUBLIC_TIMOBOT_API_KEY ?? process.env.TIMOBOT_API_KEY ?? null;
const runtimeUseMock = process.env.EXPO_PUBLIC_USE_MOCK ?? process.env.USE_MOCK_API;

let API_KEY = extraConfig.perplexityApiKey ?? runtimeApiKey;
let PROXY_URL = extraConfig.perplexityProxyUrl ?? runtimeProxyUrl ?? null;
const TIMOBOT_API_KEY = extraConfig.timobotApiKey ?? runtimeTimobotKey ?? null;

if (typeof PROXY_URL === 'string' && PROXY_URL.endsWith('/')) {
  PROXY_URL = PROXY_URL.slice(0, -1);
}

const DEFAULT_MODEL = extraConfig.perplexityModel ?? 'sonar';
const DEFAULT_MAX_TOKENS = extraConfig.perplexityMaxTokens ?? 1000;
const DEFAULT_TEMPERATURE = extraConfig.perplexityTemperature ?? 0.7;
const DEFAULT_TOP_P = extraConfig.perplexityTopP ?? 0.9;

let USE_MOCK = typeof extraConfig.useMockApi === 'boolean'
  ? extraConfig.useMockApi
  : typeof runtimeUseMock === 'string'
    ? runtimeUseMock !== 'false'
    : !API_KEY && !PROXY_URL;

const sanitizeConversationHistory = (history = []) => {
  const sanitized = [];
  let started = false;

  for (const item of history) {
    if (!item || typeof item.role !== 'string' || typeof item.content !== 'string') {
      continue;
    }

    if (!started) {
      if (item.role !== 'user') {
        continue;
      }
      started = true;
      sanitized.push({ role: item.role, content: item.content });
      continue;
    }

    const previous = sanitized[sanitized.length - 1];
    if (previous.role === item.role) {
      sanitized[sanitized.length - 1] = { role: item.role, content: item.content };
      continue;
    }

    sanitized.push({ role: item.role, content: item.content });
  }

  return sanitized;
};

/**
 * Mock de respuestas para pruebas sin conexión
 */
const mockResponses = [
  '¡Hola! Soy TimoBot, tu asistente personal. ¿En qué puedo ayudarte hoy?',
  'Claro, entiendo tu pregunta. Déjame ayudarte con eso.',
  'Esa es una excelente pregunta. Te explico...',
  'Por supuesto, puedo ayudarte con eso. Aquí está la información que necesitas.',
  'Interesante pregunta. La respuesta es...',
  'Me alegra que me lo preguntes. Te cuento que...',
  '¡Genial! Sobre eso puedo decirte que...',
  'Perfecto, te ayudo con mucho gusto.'
];

/**
 * Simula una llamada a la API con un delay
 */
const getMockResponse = async (message, userName) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Seleccionar respuesta aleatoria
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  let response = mockResponses[randomIndex];
  
  // Personalizar con el nombre del usuario
  if (userName && Math.random() > 0.5) {
    response = `${response.split('.')[0]}, ${userName}. ${response.split('.').slice(1).join('.')}`;
  }
  
  // Si el mensaje contiene palabras clave, dar respuestas más específicas
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas')) {
    response = `¡Hola ${userName}! ¿Cómo estás? Estoy aquí para ayudarte en lo que necesites.`;
  } else if (lowerMessage.includes('cómo estás') || lowerMessage.includes('como estas')) {
    response = `¡Muy bien, gracias por preguntar, ${userName}! Como siempre, listo para ayudarte. ¿Qué necesitas?`;
  } else if (lowerMessage.includes('gracias')) {
    response = `¡De nada, ${userName}! Siempre es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?`;
  } else if (lowerMessage.includes('adiós') || lowerMessage.includes('adios') || lowerMessage.includes('hasta luego')) {
    response = `¡Hasta luego, ${userName}! Que tengas un excelente día. Vuelve cuando necesites ayuda.`;
  }
  
  return response;
};

/**
 * Envía un mensaje a la API de Perplexity
 * @param {string} message - Mensaje del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Array} conversationHistory - Historial de la conversación
 * @returns {Promise<string>} - Respuesta del bot
 */
export const sendMessageToPerplexity = async (message, userName = 'Usuario', conversationHistory = []) => {
  try {
    // Si estamos en modo mock, retornar respuesta simulada
    if (USE_MOCK) {
      return await getMockResponse(message, userName);
    }

    // Preparar el historial de conversación para la API
    const sanitizedHistory = sanitizeConversationHistory(conversationHistory);

    const messages = [
      {
        role: 'system',
        content: `Eres TimoBot, un asistente amigable y personalizado. Siempre dirígete al usuario como ${userName}. Sé conciso, amable y útil.`
      },
      ...sanitizedHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const payload = {
      model: DEFAULT_MODEL,
      messages,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      top_p: DEFAULT_TOP_P,
      stream: false
    };

    const endpoint = PROXY_URL
      ? (PROXY_URL.includes('/api') ? PROXY_URL : `${PROXY_URL}/api/perplexity`)
      : PERPLEXITY_API_URL;

    const requestConfig = {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };

    if (PROXY_URL) {
      if (!TIMOBOT_API_KEY) {
        throw new Error('Timobot API key not configured');
      }

      requestConfig.headers['x-timobot-key'] = TIMOBOT_API_KEY;
    } else {
      if (!API_KEY) {
        throw new Error('Perplexity API key not configured');
      }

      requestConfig.headers.Authorization = `Bearer ${API_KEY}`;
    }

    // Realizar la petición a la API de Perplexity (directa o vía proxy)
    const response = await axios.post(
      endpoint,
      payload,
      requestConfig
    );

    // Extraer la respuesta
    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Respuesta inválida de la API');
    }

  } catch (error) {
    console.error('Error en la API de Perplexity:', error);
    
    // Manejo de errores específicos
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status;
      if (status === 401) {
        return 'Error: API key inválida. Por favor verifica tu configuración.';
      } else if (status === 429) {
        return 'Error: Límite de solicitudes excedido. Intenta más tarde.';
      } else if (status === 500) {
        return 'Error: El servidor está experimentando problemas. Intenta más tarde.';
      }
    } else if (error.request) {
      // Error de red
      return 'Error: No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }
    
    return `Lo siento ${userName}, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.`;
  }
};

/**
 * Configura la API key
 * @param {string} apiKey - Nueva API key
 */
export const setApiKey = (apiKey) => {
  API_KEY = apiKey;
};

/**
 * Alterna entre modo mock y API real
 * @param {boolean} useMock - true para usar mock, false para API real
 */
export const setUseMock = (useMock) => {
  USE_MOCK = useMock;
};
