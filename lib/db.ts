import { Pool } from 'pg';

const globalForDb = global as unknown as { pool: Pool };

export const pool = globalForDb.pool || new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export default pool;
