const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually load environment variables from .env.local
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        const lines = envConfig.split('\n');
        for (const line of lines) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        }
        console.log('Loaded environment variables from .env.local');
    } else {
        console.warn('.env.local file not found');
    }
} catch (e) {
    console.warn('Could not load .env.local:', e);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkGestures() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM gestures');
        console.log('Gestures found:', res.rows);
    } catch (err) {
        console.error('Error querying gestures:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkGestures();
