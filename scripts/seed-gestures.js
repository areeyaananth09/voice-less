const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually load environment variables from .env.local
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                process.env[match[1]] = match[2].trim();
            }
        });
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

async function seedGestures() {
    const client = await pool.connect();
    try {
        console.log('Connected to database...');

        // Create table if not exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS gestures (
        id SERIAL PRIMARY KEY,
        word VARCHAR(255) UNIQUE NOT NULL,
        video_path VARCHAR(255) NOT NULL,
        category VARCHAR(50)
      );
    `);
        console.log('Table "gestures" ready.');

        // Data to insert
        const gestures = [
            { word: 'hello', video_path: '/gestures/hello.mp4', category: 'Greeting' },
            { word: 'thank you', video_path: '/gestures/thank-you.mp4', category: 'Polite' },
            { word: 'help', video_path: '/gestures/help.mp4', category: 'Urgent' }
        ];

        // Insert data
        for (const gesture of gestures) {
            await client.query(`
        INSERT INTO gestures (word, video_path, category)
        VALUES ($1, $2, $3)
        ON CONFLICT (word) 
        DO UPDATE SET video_path = EXCLUDED.video_path, category = EXCLUDED.category;
      `, [gesture.word, gesture.video_path, gesture.category]);
            console.log(`Upserted gesture: ${gesture.word}`);
        }

        console.log('Seeding completed successfully.');
    } catch (err) {
        console.error('Error seeding gestures:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedGestures();
