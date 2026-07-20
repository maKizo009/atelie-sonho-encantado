import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db } from './db.ts';

/**
 * Executa as migrações SQL geradas pelo Drizzle Kit no banco SQLite nativo.
 */
export async function rodarMigracoes() {
  console.log('⏳ Aplicando migrações no SQLite...');
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrações aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Falha ao aplicar migrações:', error);
    process.exit(1);
  }
}
