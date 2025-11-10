import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

/**
 * Obtiene un saludo personalizado según el día de la semana
 * @param {string} userName - Nombre del usuario
 * @returns {string} - Saludo personalizado
 */
export const dailyGreeting = (userName) => {
  const now = dayjs();
  const dayOfWeek = now.day(); // 0 = Domingo, 1 = Lunes, etc.
  const hour = now.hour();
  const dayName = now.format('dddd');
  
  // Saludos según la hora del día
  let timeGreeting = '';
  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Buenos días';
  } else if (hour >= 12 && hour < 19) {
    timeGreeting = 'Buenas tardes';
  } else {
    timeGreeting = 'Buenas noches';
  }

  // Mensajes especiales según el día de la semana
  const weekdayMessages = {
    0: `¡${timeGreeting}, ${userName}! 🌅 Es domingo, perfecto para relajarse. ¿En qué puedo ayudarte hoy?`,
    1: `¡${timeGreeting}, ${userName}! 💪 ¡Feliz lunes! Empecemos la semana con energía. ¿Qué necesitas?`,
    2: `¡${timeGreeting}, ${userName}! 🚀 ¡Feliz martes! La semana está en marcha. ¿Cómo puedo asistirte?`,
    3: `¡${timeGreeting}, ${userName}! 🌟 ¡Feliz miércoles! Ya vamos a mitad de semana. ¿En qué te ayudo?`,
    4: `¡${timeGreeting}, ${userName}! ⚡ ¡Feliz jueves! Un día más cerca del fin de semana. ¿Qué necesitas?`,
    5: `¡${timeGreeting}, ${userName}! 🎉 ¡Feliz viernes! El fin de semana está cerca. ¿Cómo puedo ayudarte?`,
    6: `¡${timeGreeting}, ${userName}! 🌈 ¡Feliz sábado! Hora de disfrutar. ¿En qué puedo asistirte?`
  };

  return weekdayMessages[dayOfWeek];
};

/**
 * Obtiene un saludo corto para el header
 * @param {string} userName - Nombre del usuario
 * @returns {string} - Saludo corto
 */
export const shortGreeting = (userName) => {
  const now = dayjs();
  const hour = now.hour();
  
  if (hour >= 5 && hour < 12) {
    return `Buenos días, ${userName}`;
  } else if (hour >= 12 && hour < 19) {
    return `Buenas tardes, ${userName}`;
  } else {
    return `Buenas noches, ${userName}`;
  }
};

/**
 * Formatea una fecha para mostrar
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date) => {
  const d = dayjs(date);
  const now = dayjs();
  
  // Si es hoy
  if (d.isSame(now, 'day')) {
    return `Hoy, ${d.format('HH:mm')}`;
  }
  
  // Si es ayer
  if (d.isSame(now.subtract(1, 'day'), 'day')) {
    return `Ayer, ${d.format('HH:mm')}`;
  }
  
  // Si es esta semana
  if (d.isAfter(now.subtract(7, 'day'))) {
    return d.format('dddd, HH:mm');
  }
  
  // Fecha completa
  return d.format('DD/MM/YYYY HH:mm');
};

/**
 * Obtiene el emoji según el día de la semana
 * @returns {string} - Emoji del día
 */
export const getDayEmoji = () => {
  const dayOfWeek = dayjs().day();
  const emojis = ['🌅', '💪', '🚀', '🌟', '⚡', '🎉', '🌈'];
  return emojis[dayOfWeek];
};
