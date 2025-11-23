import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import i18n from '../i18n';

/**
 * Obtiene un saludo personalizado según la hora del día
 * @param {string} userName - Nombre del usuario
 * @returns {string} - Saludo personalizado
 */
export const dailyGreeting = (userName: string): string => {
    const now = dayjs();
    const hour = now.hour();

    // Establecer locale de dayjs basado en el idioma de i18n
    dayjs.locale(i18n.language);

    // Saludos según la hora del día
    if (hour >= 5 && hour < 12) {
        return i18n.t('chat.greetingMorning', { userName });
    } else if (hour >= 12 && hour < 19) {
        return i18n.t('chat.greetingAfternoon', { userName });
    } else if (hour >= 19 && hour < 23) {
        return i18n.t('chat.greetingEvening', { userName });
    } else {
        return i18n.t('chat.greetingNight', { userName });
    }
};

/**
 * Obtiene un saludo corto para el header
 * @param {string} userName - Nombre del usuario
 * @returns {string} - Saludo corto
 */
export const shortGreeting = (userName: string): string => {
    const now = dayjs();
    const hour = now.hour();

    if (hour >= 5 && hour < 12) {
        return i18n.t('chat.greetingMorning', { userName }).split('!')[0] + '!';
    } else if (hour >= 12 && hour < 19) {
        return i18n.t('chat.greetingAfternoon', { userName }).split('!')[0] + '!';
    } else {
        return i18n.t('chat.greetingEvening', { userName }).split('!')[0] + '!';
    }
};

/**
 * Formatea una fecha para mostrar
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date: string | Date): string => {
    const d = dayjs(date);
    const now = dayjs();

    dayjs.locale(i18n.language);

    // Si es hoy
    if (d.isSame(now, 'day')) {
        return `${i18n.language === 'es' ? 'Hoy' : 'Today'}, ${d.format('HH:mm')}`;
    }

    // Si es ayer
    if (d.isSame(now.subtract(1, 'day'), 'day')) {
        return `${i18n.language === 'es' ? 'Ayer' : 'Yesterday'}, ${d.format('HH:mm')}`;
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
export const getDayEmoji = (): string => {
    const dayOfWeek = dayjs().day();
    const emojis = ['🌅', '💪', '🚀', '🌟', '⚡', '🎉', '🌈'];
    return emojis[dayOfWeek];
};
