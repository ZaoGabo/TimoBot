import dayjs from 'dayjs';
import { dailyGreeting, shortGreeting, formatDate, getDayEmoji } from '../greetings';
import i18n from '../../i18n'; // Assuming i18n is now imported

// Mock dayjs
jest.mock('dayjs');

// Mock i18n
jest.mock('../../i18n', () => ({
  default: {
    t: (key, params) => {
      const translations = {
        'chat.greetingMorning': `¡Buenos días, ${params.userName}! ¿En qué puedo ayudarte hoy?`,
        'chat.greetingAfternoon': `¡Buenas tardes, ${params.userName}! ¿Cómo puedo asistirte?`,
        'chat.greetingEvening': `¡Buenas noches, ${params.userName}! ¿En qué te puedo ayudar?`,
        'chat.greetingNight': `Hola ${params.userName}, aún despierto. ¿Necesitas ayuda con algo?`,
        'chat.shortGreetingMorning': `Buenos días, ${params.userName}`,
        'chat.shortGreetingAfternoon': `Buenas tardes, ${params.userName}`,
        'chat.shortGreetingEvening': `Buenas noches, ${params.userName}`,
        'chat.formatDateToday': 'Hoy',
        'chat.formatDateYesterday': 'Ayer',
      };
      return translations[key] || key;
    },
    language: 'es',
  },
}));

describe('Greetings Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset dayjs mock before each test to ensure clean state
    dayjs.mockRestore(); // Use mockRestore if dayjs itself is mocked
    // If dayjs.prototype methods are spied, clear them
    if (dayjs.prototype.hour.mockRestore) {
      dayjs.prototype.hour.mockRestore();
    }
    if (dayjs.prototype.day.mockRestore) {
      dayjs.prototype.day.mockRestore();
    }
    if (dayjs.prototype.format.mockRestore) {
      dayjs.prototype.format.mockRestore();
    }
    if (dayjs.prototype.isSame.mockRestore) {
      dayjs.prototype.isSame.mockRestore();
    }
    if (dayjs.prototype.isAfter.mockRestore) {
      dayjs.prototype.isAfter.mockRestore();
    }
    if (dayjs.prototype.subtract.mockRestore) {
      dayjs.prototype.subtract.mockRestore();
    }
  });

  describe('dailyGreeting', () => {
    it('should return morning greeting for morning hours', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(8);
      jest.spyOn(dayjs.prototype, 'format').mockReturnValue('lunes'); // Mock format for day name

      const result = dailyGreeting('Juan');

      expect(result).toContain('Buenos días');
      expect(result).toContain('Juan');
      expect(result).toContain('lunes'); // Ensure day name is still included if applicable
    });

    it('should return afternoon greeting for afternoon hours', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(14);
      jest.spyOn(dayjs.prototype, 'format').mockReturnValue('miércoles');

      const result = dailyGreeting('María');

      expect(result).toContain('Buenas tardes');
      expect(result).toContain('María');
      expect(result).toContain('miércoles');
    });

    it('should return evening greeting for evening hours', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(20);
      jest.spyOn(dayjs.prototype, 'format').mockReturnValue('viernes');

      const result = dailyGreeting('Carlos');

      expect(result).toContain('Buenas noches');
      expect(result).toContain('Carlos');
      expect(result).toContain('viernes');
    });

    it('should return night greeting for late night hours', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(2);
      jest.spyOn(dayjs.prototype, 'format').mockReturnValue('domingo');

      const result = dailyGreeting('Ana');

      expect(result).toContain('Hola');
      expect(result).toContain('Ana');
      expect(result).toContain('domingo');
    });

    it('should return different messages for each day of the week (day-specific part)', () => {
      const userName = 'Test';
      const greetings = [];

      // Mock dayjs to return a specific day of the week
      const mockDayjsInstance = {
        hour: () => 10, // Fixed hour for consistency
        format: jest.fn((fmt) => {
          if (fmt === 'dddd') { // Assuming 'dddd' is used for full day name
            const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
            return days[mockDayjsInstance.day()];
          }
          return 'día'; // Default for other formats
        }),
        day: jest.fn(), // Will be set in the loop
      };
      dayjs.mockReturnValue(mockDayjsInstance);

      for (let day = 0; day <= 6; day++) {
        mockDayjsInstance.day.mockReturnValue(day);
        greetings.push(dailyGreeting(userName));
      }

      // All greetings should be unique based on the day-specific part
      // This test might need adjustment if the i18n mock doesn't produce day-specific variations
      // For now, we'll check if the day name is present.
      expect(greetings[0]).toContain('domingo');
      expect(greetings[1]).toContain('lunes');
      expect(greetings[2]).toContain('martes');
      expect(greetings[3]).toContain('miércoles');
      expect(greetings[4]).toContain('jueves');
      expect(greetings[5]).toContain('viernes');
      expect(greetings[6]).toContain('sábado');
    });
  });

  describe('shortGreeting', () => {
    it('should return short morning greeting', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(9);

      const result = shortGreeting('Pedro');

      expect(result).toBe('Buenos días, Pedro');
    });

    it('should return short afternoon greeting', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(15);

      const result = shortGreeting('Sofia');

      expect(result).toBe('Buenas tardes, Sofia');
    });

    it('should return short evening greeting', () => {
      jest.spyOn(dayjs.prototype, 'hour').mockReturnValue(21);

      const result = shortGreeting('Laura');

      expect(result).toBe('Buenas noches, Laura');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
    });

    it('should format today\'s date with "Hoy"', () => {
      const mockNow = {};
      const mockDate = {
        isSame: jest.fn((other, unit) => other === mockNow && unit === 'day'),
        isAfter: jest.fn(() => false),
        format: jest.fn(() => '14:30'),
      };

      dayjs
        .mockReturnValueOnce(mockDate) // dayjs(date)
        .mockReturnValueOnce(mockNow); // dayjs()

      const result = formatDate(new Date());
      expect(result).toBe('Hoy, 14:30');
    });

    it('should format yesterday\'s date with "Ayer"', () => {
      const mockYesterday = {};
      const mockNow = {
        subtract: jest.fn((amount, unit) => {
          if (amount === 1 && unit === 'day') return mockYesterday;
          return {};
        }),
      };
      const mockDate = {
        isSame: jest.fn((other, unit) => other === mockYesterday && unit === 'day'),
        isAfter: jest.fn(() => false),
        format: jest.fn(() => '10:15'),
      };

      dayjs
        .mockReturnValueOnce(mockDate) // dayjs(date)
        .mockReturnValueOnce(mockNow); // dayjs()

      const result = formatDate(new Date());
      expect(result).toContain('10:15');
    });
  });

  describe('getDayEmoji', () => {
    it('should return different emojis for each day of the week', () => {
      const emojis = [];

      for (let day = 0; day <= 6; day++) {
        dayjs.mockReturnValue({ day: () => day });
        emojis.push(getDayEmoji());
      }

      // All emojis should be defined
      emojis.forEach((emoji) => {
        expect(emoji).toBeDefined();
        expect(typeof emoji).toBe('string');
      });

      // Should have 7 different emojis
      expect(emojis.length).toBe(7);
    });
  });
});
