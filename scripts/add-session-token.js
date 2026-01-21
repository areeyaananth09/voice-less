const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function updateSessionTable() {
    try {
        console.log('Clearing session table to avoid constraint errors...');
        await pool.query('DELETE FROM "session"');

        console.log('Adding token column to session table...');
        await pool.query('ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "token" TEXT NOT NULL UNIQUE');

        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

updateSessionTable();
