import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

// Öffne die SQLite-Datenbank
export async function getDatabase() {
  if (!db) {
    db = await open({
      filename: './server/database/database.sqlite', // Pfad zur SQLite-Datenbank
      driver: sqlite3.Database,
    });
  }
  return db;
}

// Beispiel für das Erstellen der Tabelle
export async function setupDatabase() {
  const db = await getDatabase();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
