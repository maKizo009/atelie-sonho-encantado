import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schemas/db_schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'sqlite.db',
  },
});
