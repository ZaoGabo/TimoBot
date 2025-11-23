import * as db from '../database';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
    openDatabaseAsync: jest.fn(),
}));

describe('Database Service', () => {
    let mockDb;
    let openDatabaseAsync;

    beforeEach(async () => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mock database
        mockDb = {
            execAsync: jest.fn().mockResolvedValue(undefined),
            runAsync: jest.fn().mockResolvedValue(undefined),
            getAllAsync: jest.fn().mockResolvedValue([]),
            getFirstAsync: jest.fn().mockResolvedValue(null),
        };

        openDatabaseAsync = require('expo-sqlite').openDatabaseAsync;
        openDatabaseAsync.mockResolvedValue(mockDb);

        // Initialize database to set the db instance
        await db.initDatabase();
    });

    describe('initDatabase', () => {
        it('should initialize database successfully', async () => {
            const result = await db.initDatabase();

            expect(result).toBe(true);
            expect(mockDb.execAsync).toHaveBeenCalledWith('PRAGMA foreign_keys = ON;');
            expect(mockDb.execAsync).toHaveBeenCalledWith(
                expect.stringContaining('CREATE TABLE IF NOT EXISTS sessions')
            );
            expect(mockDb.execAsync).toHaveBeenCalledWith(
                expect.stringContaining('CREATE TABLE IF NOT EXISTS messages')
            );
        });

        it('should return false on error', async () => {
            mockDb.execAsync.mockRejectedValueOnce(new Error('DB Error'));

            const result = await db.initDatabase();

            expect(result).toBe(false);
        });
    });

    describe('createSession', () => {
        it('should create a new session', async () => {
            const sessionId = 'test-session-123';
            const date = '2025-01-01T00:00:00.000Z';
            const preview = 'Test message preview';

            const result = await db.createSession(sessionId, date, preview);

            expect(result).toBe(true);
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'INSERT INTO sessions (id, date, preview, title) VALUES (?, ?, ?, ?)',
                [sessionId, date, preview, 'Nuevo Chat']
            );
        });

        it('should return false on error', async () => {
            mockDb.runAsync.mockRejectedValueOnce(new Error('Insert failed'));

            const result = await db.createSession('id', 'date', 'preview');

            expect(result).toBe(false);
        });
    });

    describe('getSessions', () => {
        it('should return list of sessions', async () => {
            const mockSessions = [
                { id: '1', title: 'Chat 1', date: '2025-01-01', preview: 'Preview 1' },
                { id: '2', title: 'Chat 2', date: '2025-01-02', preview: 'Preview 2' },
            ];

            mockDb.getAllAsync.mockResolvedValueOnce(mockSessions);

            const sessions = await db.getSessions();

            expect(sessions).toEqual(mockSessions);
            expect(mockDb.getAllAsync).toHaveBeenCalledWith(
                'SELECT * FROM sessions ORDER BY date DESC'
            );
        });

        it('should return empty array on error', async () => {
            mockDb.getAllAsync.mockRejectedValueOnce(new Error('Query failed'));

            const sessions = await db.getSessions();

            expect(sessions).toEqual([]);
        });
    });

    describe('deleteSession', () => {
        it('should delete session successfully', async () => {
            const sessionId = 'session-to-delete';

            const result = await db.deleteSession(sessionId);

            expect(result).toBe(true);
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'DELETE FROM sessions WHERE id = ?',
                [sessionId]
            );
        });

        it('should return false on error', async () => {
            mockDb.runAsync.mockRejectedValueOnce(new Error('Delete failed'));

            const result = await db.deleteSession('id');

            expect(result).toBe(false);
        });
    });

    describe('saveMessage', () => {
        it('should save message to existing session', async () => {
            const sessionId = 'existing-session';
            const message = {
                id: 'msg-123',
                text: 'Hello world',
                isUser: true,
                timestamp: '2025-01-01T00:00:00.000Z',
            };

            // Mock session exists
            mockDb.getFirstAsync.mockResolvedValueOnce({ id: sessionId });

            const result = await db.saveMessage(sessionId, message);

            expect(result).toBe(true);
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'UPDATE sessions SET preview = ?, date = ? WHERE id = ?',
                [message.text.substring(0, 50), message.timestamp, sessionId]
            );
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'INSERT INTO messages (id, session_id, text, is_user, timestamp) VALUES (?, ?, ?, ?, ?)',
                [message.id, sessionId, message.text, 1, message.timestamp]
            );
        });

        it('should create session if it does not exist', async () => {
            const sessionId = 'new-session';
            const message = {
                id: 'msg-123',
                text: 'Hello world',
                isUser: false,
                timestamp: '2025-01-01T00:00:00.000Z',
            };

            // Mock session doesn't exist
            mockDb.getFirstAsync.mockResolvedValueOnce(null);

            const result = await db.saveMessage(sessionId, message);

            expect(result).toBe(true);
            // Should create session first
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'INSERT INTO sessions (id, date, preview, title) VALUES (?, ?, ?, ?)',
                [sessionId, expect.any(String), message.text.substring(0, 50), 'Nuevo Chat']
            );
            // Then save message
            expect(mockDb.runAsync).toHaveBeenCalledWith(
                'INSERT INTO messages (id, session_id, text, is_user, timestamp) VALUES (?, ?, ?, ?, ?)',
                [message.id, sessionId, message.text, 0, message.timestamp]
            );
        });

        it('should return false on error', async () => {
            mockDb.getFirstAsync.mockRejectedValueOnce(new Error('DB Error'));

            const result = await db.saveMessage('id', {
                id: '1',
                text: 'test',
                isUser: true,
                timestamp: 'now',
            });

            expect(result).toBe(false);
        });
    });

    describe('getMessages', () => {
        it('should return messages with boolean isUser', async () => {
            const mockRows = [
                { id: '1', text: 'User msg', is_user: 1, timestamp: 'time1' },
                { id: '2', text: 'Bot msg', is_user: 0, timestamp: 'time2' },
            ];

            mockDb.getAllAsync.mockResolvedValueOnce(mockRows);

            const messages = await db.getMessages('session-id');

            expect(messages).toEqual([
                { id: '1', text: 'User msg', isUser: true, timestamp: 'time1' },
                { id: '2', text: 'Bot msg', isUser: false, timestamp: 'time2' },
            ]);
        });

        it('should return empty array on error', async () => {
            mockDb.getAllAsync.mockRejectedValueOnce(new Error('Query failed'));

            const messages = await db.getMessages('id');

            expect(messages).toEqual([]);
        });
    });
});
