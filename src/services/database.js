import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync('timobot.db');

        // Habilitar claves foráneas
        await db.execAsync('PRAGMA foreign_keys = ON;');

        // Crear tabla de sesiones
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        title TEXT,
        date TEXT,
        preview TEXT
      );
    `);

        // Crear tabla de mensajes
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        text TEXT,
        is_user INTEGER,
        timestamp TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
      );
    `);

        console.log('Database initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        return false;
    }
};

export const createSession = async (id, date, preview) => {
    if (!db) await initDatabase();
    try {
        await db.runAsync(
            'INSERT INTO sessions (id, date, preview, title) VALUES (?, ?, ?, ?)',
            [id, date, preview, 'Nuevo Chat']
        );
        return true;
    } catch (error) {
        console.error('Error creating session:', error);
        return false;
    }
};

export const getSessions = async () => {
    if (!db) await initDatabase();
    try {
        const result = await db.getAllAsync('SELECT * FROM sessions ORDER BY date DESC');
        return result;
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
};

export const deleteSession = async (sessionId) => {
    if (!db) await initDatabase();
    try {
        await db.runAsync('DELETE FROM sessions WHERE id = ?', [sessionId]);
        return true;
    } catch (error) {
        console.error('Error deleting session:', error);
        return false;
    }
};

export const saveMessage = async (sessionId, message) => {
    if (!db) await initDatabase();
    try {
        // Asegurarse de que la sesión existe, si no, crearla (fallback)
        const sessionExists = await db.getFirstAsync('SELECT id FROM sessions WHERE id = ?', [sessionId]);
        if (!sessionExists) {
            await createSession(sessionId, new Date().toISOString(), message.text.substring(0, 50));
        } else {
            // Actualizar preview de la sesión con el último mensaje
            await db.runAsync(
                'UPDATE sessions SET preview = ?, date = ? WHERE id = ?',
                [message.text.substring(0, 50), message.timestamp, sessionId]
            );
        }

        await db.runAsync(
            'INSERT INTO messages (id, session_id, text, is_user, timestamp) VALUES (?, ?, ?, ?, ?)',
            [message.id, sessionId, message.text, message.isUser ? 1 : 0, message.timestamp]
        );
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
};

export const getMessages = async (sessionId) => {
    if (!db) await initDatabase();
    try {
        const result = await db.getAllAsync(
            'SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC',
            [sessionId]
        );

        // Convertir is_user de 0/1 a boolean
        return result.map(msg => ({
            ...msg,
            isUser: msg.is_user === 1
        }));
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
};
