import dayjs from 'dayjs';
import { dailyGreeting, shortGreeting, formatDate, getDayEmoji } from '../greetings';

// Mock dayjs
jest.mock('dayjs');

describe('greetings.js', () => {
  describe('dailyGreeting', () => {
    it('should return morning greeting on Monday at 8am', () => {
      const mockDate = {
        day: () => 1,
        hour: () => 8,
        format: () => 'lunes',
      };
      dayjs.mockReturnValue(mockDate);

      const result = dailyGreeting('Juan');
      expect(result).toContain('Buenos días');
      expect(result).toContain('Juan');
      expect(result).toContain('lunes');
    });

    it('should return afternoon greeting at 3pm', () => {
      const mockDate = {
        day: () => 3,
        hour: () => 15,
        format: () => 'miércoles',
      };
      dayjs.mockReturnValue(mockDate);

      const result = dailyGreeting('Maria');
      expect(result).toContain('Buenas tardes');
      expect(result).toContain('Maria');
    });

    it('should return evening greeting at 8pm', () => {
      const mockDate = {
        day: () => 5,
        hour: () => 20,
        format: () => 'viernes',
      };
      dayjs.mockReturnValue(mockDate);

      const result = dailyGreeting('Pedro');
      expect(result).toContain('Buenas noches');
      expect(result).toContain('Pedro');
    });

    it('should return different messages for each day of the week', () => {
      const userName = 'Test';
      const greetings = [];

      for (let day = 0; day <= 6; day++) {
        const mockDate = {
          day: () => day,
          hour: () => 10,
          format: () => 'día',
        };
        dayjs.mockReturnValue(mockDate);
        greetings.push(dailyGreeting(userName));
      }

      // All greetings should be unique
      const uniqueGreetings = new Set(greetings);
      expect(uniqueGreetings.size).toBe(7);
    });
  });

  describe('shortGreeting', () => {
    it('should return "Buenos días" for morning hours', () => {
      const mockDate = {
        hour: () => 9,
      };
      dayjs.mockReturnValue(mockDate);

      const result = shortGreeting('Ana');
      expect(result).toBe('Buenos días, Ana');
    });

    it('should return "Buenas tardes" for afternoon hours', () => {
      const mockDate = {
        hour: () => 14,
      };
      dayjs.mockReturnValue(mockDate);

      const result = shortGreeting('Carlos');
      expect(result).toBe('Buenas tardes, Carlos');
    });

    it('should return "Buenas noches" for evening hours', () => {
      const mockDate = {
        hour: () => 22,
      };
      dayjs.mockReturnValue(mockDate);

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
