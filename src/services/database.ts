import * as SQLite from 'expo-sqlite';
import type { Message, Session } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<boolean> => {
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

export const createSession = async (id: string, date: string, preview: string): Promise<boolean> => {
    if (!db) await initDatabase();
    try {
        await db!.runAsync(
            'INSERT INTO sessions (id, date, preview, title) VALUES (?, ?, ?, ?)',
            [id, date, preview, 'Nuevo Chat']
        );
        return true;
    } catch (error) {
        console.error('Error creating session:', error);
        return false;
    }
};

export const getSessions = async (): Promise<Session[]> => {
    if (!db) await initDatabase();
    try {
        const result = await db!.getAllAsync<Session>('SELECT * FROM sessions ORDER BY date DESC');
        return result;
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
};

export const deleteSession = async (sessionId: string): Promise<boolean> => {
    if (!db) await initDatabase();
    try {
        await db!.runAsync('DELETE FROM sessions WHERE id = ?', [sessionId]);
        return true;
    } catch (error) {
        console.error('Error deleting session:', error);
        return false;
    }
};

export const saveMessage = async (sessionId: string, message: Message): Promise<boolean> => {
    if (!db) await initDatabase();
    try {
        // Asegurarse de que la sesión existe, si no, crearla (fallback)
        const sessionExists = await db!.getFirstAsync('SELECT id FROM sessions WHERE id = ?', [sessionId]);
        if (!sessionExists) {
            await createSession(sessionId, new Date().toISOString(), message.text.substring(0, 50));
        } else {
            // Actualizar preview de la sesión con el último mensaje
            await db!.runAsync(
                'UPDATE sessions SET preview = ?, date = ? WHERE id = ?',
                [message.text.substring(0, 50), message.timestamp, sessionId]
            );
        }

        await db!.runAsync(
            'INSERT INTO messages (id, session_id, text, is_user, timestamp) VALUES (?, ?, ?, ?, ?)',
            [message.id, sessionId, message.text, message.isUser ? 1 : 0, message.timestamp]
        );
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
};

interface MessageRow {
    id: string;
    session_id: string;
    text: string;
    is_user: number;
    timestamp: string;
}

export const getMessages = async (sessionId: string): Promise<Message[]> => {
    if (!db) await initDatabase();
    try {
        const result = await db!.getAllAsync<MessageRow>(
            'SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC',
            [sessionId]
        );

        // Convertir is_user de 0/1 a boolean
        return result.map(msg => ({
            id: msg.id,
            text: msg.text,
            isUser: msg.is_user === 1,
            timestamp: msg.timestamp
        }));
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
};
