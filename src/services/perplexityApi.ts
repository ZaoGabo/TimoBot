import axios from 'axios';
import Constants from 'expo-constants';
import type { ConversationMessage } from '../types';

// Configuración de la API
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

const extraConfig = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const runtimeApiKey =
  process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY ?? process.env.PERPLEXITY_API_KEY ?? null;
const runtimeProxyUrl =
  process.env.EXPO_PUBLIC_PERPLEXITY_PROXY_URL ?? process.env.PERPLEXITY_PROXY_URL ?? null;
const runtimeTimobotKey =
  process.env.EXPO_PUBLIC_TIMOBOT_API_KEY ?? process.env.TIMOBOT_API_KEY ?? null;
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

let USE_MOCK =
  typeof extraConfig.useMockApi === 'boolean'
    ? extraConfig.useMockApi
    : typeof runtimeUseMock === 'string'
      ? runtimeUseMock !== 'false'
      : !API_KEY && !PROXY_URL;

const sanitizeConversationHistory = (history: ConversationMessage[] = []): ConversationMessage[] => {
  const sanitized: ConversationMessage[] = [];
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
  'Perfecto, te ayudo con mucho gusto.',
];

/**
 * Simula una llamada a la API con un delay
 */
const getMockResponse = async (message: string, userName: string): Promise<string> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Seleccionar respuesta aleatoria
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  let response = mockResponses[randomIndex];

  // Personalizar con el nombre del usuario
  if (userName && Math.random() > 0.5) {
    response = `${response.split('.')[0]}, ${userName}. ${response.split('.').slice(1).join('.')}`;
  }

  // Si el mensaje contiene palabras clave, dar respuestas más específicas
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes('hola') ||
    lowerMessage.includes('buenos días') ||
    lowerMessage.includes('buenas')
  ) {
    response = `¡Hola ${userName}! ¿Cómo estás? Estoy aquí para ayudarte en lo que necesites.`;
  } else if (lowerMessage.includes('cómo estás') || lowerMessage.includes('como estas')) {
    response = `¡Muy bien, gracias por preguntar, ${userName}! Como siempre, listo para ayudarte. ¿Qué necesitas?`;
  } else if (lowerMessage.includes('gracias')) {
    response = `¡De nada, ${userName}! Siempre es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?`;
  } else if (
    lowerMessage.includes('adiós') ||
    lowerMessage.includes('adios') ||
    lowerMessage.includes('hasta luego')
  ) {
    response = `¡Hasta luego, ${userName}! Que tengas un excelente día. Vuelve cuando necesites ayuda.`;
  }

  return response;
};

/**
 * Sanitiza y valida la entrada del usuario
 * @param {string} input - Entrada a validar
 * @returns {string} - Entrada sanitizada
 */
const sanitizeInput = (input: unknown): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Remover caracteres potencialmente peligrosos
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Prevenir XSS básico
    .substring(0, 5000); // Limitar longitud

  if (sanitized.length === 0) {
    throw new Error('Input cannot be empty');
  }

  return sanitized;
};

/**
 * Retry utility with exponential backoff
 * @param fn - Function to retry
 * @param retries - Number of retries
 * @param delay - Initial delay in ms
 * @returns Promise with result
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    // Only retry on network errors or 5xx server errors
    if (axios.isAxiosError(error)) {
      const shouldRetry =
        !error.response || // Network error
        (error.response.status >= 500 && error.response.status < 600); // Server error

      if (!shouldRetry) {
        throw error; // Don't retry client errors (4xx)
      }
    }

    // Wait with exponential backoff
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry with double delay
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

/**
 * Envía un mensaje a la API de Perplexity
 * @param {string} message - Mensaje del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Array} conversationHistory - Historial de la conversación
 * @returns {Promise<string>} - Respuesta del bot
 */
export const sendMessageToPerplexity = async (
  message: string,
  userName: string = 'Usuario',
  conversationHistory: ConversationMessage[] = []
): Promise<string> => {
  try {
    // Validar y sanitizar entrada
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedUserName = sanitizeInput(userName);

    // Si estamos en modo mock, retornar respuesta simulada
    if (USE_MOCK) {
      return await getMockResponse(sanitizedMessage, sanitizedUserName);
    }

    // Preparar el historial de conversación para la API
    const sanitizedHistory = sanitizeConversationHistory(conversationHistory);

    const messages = [
      {
        role: 'system',
        content: `Eres TimoBot, un asistente amigable y personalizado. Siempre dirígete al usuario como ${sanitizedUserName}. Sé conciso, amable y útil.`,
      },
      ...sanitizedHistory,
      {
        role: 'user',
        content: sanitizedMessage,
      },
    ];

    const payload = {
      model: DEFAULT_MODEL,
      messages,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      top_p: DEFAULT_TOP_P,
      stream: false,
    };

    const endpoint = PROXY_URL
      ? PROXY_URL.includes('/api')
        ? PROXY_URL
        : `${PROXY_URL}/api/perplexity`
      : PERPLEXITY_API_URL;

    const requestConfig: {
      headers: Record<string, string>;
      timeout: number;
    } = {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
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

      requestConfig.headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    // Realizar la petición a la API de Perplexity (directa o vía proxy) con retry
    const response = await retryWithBackoff(
      async () => axios.post(endpoint, payload, requestConfig),
      3, // 3 retries
      1000 // Start with 1s delay
    );

    // Extraer la respuesta
    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Respuesta inválida de la API');
    }
  } catch (error: unknown) {
    console.error('Error en la API de Perplexity:', error);

    // Manejo de errores específicos
    if (axios.isAxiosError(error)) {
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
    }

    return `Lo siento ${userName}, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.`;
  }
};

/**
 * Envía un mensaje a la API de Perplexity con streaming
 * @param message - Mensaje del usuario
 * @param userName - Nombre del usuario
 * @param conversationHistory - Historial de la conversación
 * @param onChunk - Callback que recibe cada fragmento de texto
 * @param onComplete - Callback cuando se completa el stream
 * @param onError - Callback cuando hay un error
 */
export const sendMessageToPerplexityStreaming = async (
  message: string,
  userName: string = 'Usuario',
  conversationHistory: ConversationMessage[] = [],
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    // Validar y sanitizar entrada
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedUserName = sanitizeInput(userName);

    // Si estamos en modo mock, simular streaming
    if (USE_MOCK) {
      const mockResponse = await getMockResponse(sanitizedMessage, sanitizedUserName);
      // Simular typewriter effect
      for (let i = 0; i < mockResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20));
        onChunk(mockResponse[i]);
      }
      onComplete();
      return;
    }

    // Preparar el historial de conversación
    const sanitizedHistory = sanitizeConversationHistory(conversationHistory);

    const messages = [
      {
        role: 'system',
        content: `Eres TimoBot, un asistente amigable y personalizado. Siempre dirígete al usuario como ${sanitizedUserName}. Sé conciso, amable y útil.`,
      },
      ...sanitizedHistory,
      {
        role: 'user',
        content: sanitizedMessage,
      },
    ];

    const payload = {
      model: DEFAULT_MODEL,
      messages,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      top_p: DEFAULT_TOP_P,
      stream: true, // Enable streaming
    };

    const endpoint = PROXY_URL
      ? PROXY_URL.includes('/api')
        ? PROXY_URL
        : `${PROXY_URL}/api/perplexity`
      : PERPLEXITY_API_URL;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (PROXY_URL) {
      if (!TIMOBOT_API_KEY) {
        throw new Error('Timobot API key not configured');
      }
      headers['x-timobot-key'] = TIMOBOT_API_KEY;
    } else {
      if (!API_KEY) {
        throw new Error('Perplexity API key not configured');
      }
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    // Use fetch for streaming instead of axios
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
            console.warn('Failed to parse SSE chunk:', e);
          }
        }
      }
    }
  } catch (error: unknown) {
    console.error('Error en streaming de Perplexity:', error);

    let errorMessage = `Lo siento ${userName}, ocurrió un error al procesar tu mensaje.`;

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'Error: API key inválida. Por favor verifica tu configuración.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Error: Límite de solicitudes excedido. Intenta más tarde.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error: El servidor está experimentando problemas.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Error: No se pudo conectar con el servidor. Verifica tu conexión.';
      }
    }

    onError(errorMessage);
  }
};

/**
 * Configura la API key
 * @param {string} apiKey - Nueva API key
 */
export const setApiKey = (apiKey: string): void => {
  API_KEY = apiKey;
};

/**
 * Alterna entre modo mock y API real
 * @param {boolean} useMock - true para usar mock, false para API real
 */
export const setUseMock = (useMock: boolean): void => {
  USE_MOCK = useMock;
};
