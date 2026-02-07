const { neon } = require('@neondatabase/serverless');
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
        console.log('✅ Loaded environment variables from .env.local');
    } else {
        console.warn('⚠️  .env.local file not found');
    }
} catch (e) {
    console.warn('⚠️  Could not load .env.local:', e);
}

async function setupDatabase() {
    try {
        const sql = neon(process.env.DATABASE_URL);

        console.log('\n🔍 Checking existing gestures table...\n');

        // Check if table exists and show current data
        const existing = await sql`SELECT * FROM gestures ORDER BY id`;

        if (existing.length > 0) {
            console.log('📊 Current gestures in database:');
            console.table(existing);
        } else {
            console.log('ℹ️  Gestures table exists but is empty.');
        }

        // Add more test data if needed
        console.log('\n➕ Adding additional test gestures...\n');

        const newGestures = [
            { word: 'hello', video_path: '/gestures/hello.mp4' },
            { word: 'how', video_path: '/gestures/how.mp4' },
            { word: 'are', video_path: '/gestures/are.mp4' },
            { word: 'you', video_path: '/gestures/you.mp4' },
            { word: 'thank you', video_path: '/gestures/thank-you.mp4' },
            { word: 'help', video_path: '/gestures/help.mp4' },
            { word: 'please', video_path: '/gestures/please.mp4' },
            { word: 'sorry', video_path: '/gestures/sorry.mp4' },
        ];

        for (const gesture of newGestures) {
            try {
                await sql`
          INSERT INTO gestures (word, video_path)
          VALUES (${gesture.word}, ${gesture.video_path})
          ON CONFLICT (word) 
          DO UPDATE SET video_path = EXCLUDED.video_path
        `;
                console.log(`✅ Upserted: ${gesture.word} -> ${gesture.video_path}`);
            } catch (err) {
                console.error(`❌ Error with "${gesture.word}":`, err.message);
            }
        }

        // Show final state
        console.log('\n📊 Final gestures in database:');
        const final = await sql`SELECT * FROM gestures ORDER BY id`;
        console.table(final);

        console.log('\n✅ Database setup complete!');
        console.log('\n💡 Next steps:');
        console.log('   1. Add your actual video files to public/gestures/');
        console.log('   2. Test the translation feature in your app');

    } catch (error) {
        console.error('❌ Database setup error:', error);
    }
}

setupDatabase();
