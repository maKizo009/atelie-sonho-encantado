import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

// Inicializa o banco SQLite nativo do Bun
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);
