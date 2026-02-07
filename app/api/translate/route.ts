import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Normalization: Lowercase and remove punctuation except spaces
        const normalized = message.toLowerCase().replace(/[^\w\s]/g, "");

        // 2. Tokenization: Split into unique words to optimize query
        const words = normalized.split(/\s+/).filter(w => w.length > 0);

        if (words.length === 0) {
            return NextResponse.json({ videos: [] });
        }

        // 3. Database Query
        // Fetch all videos matching any of the words in the sentence
        // Uses the existing 'gestures' table with 'word' and 'video_path' columns
        const client = await pool.connect();

        try {
            // Query to get video path for each word in the list
            // Note: We use video_path as per your existing table schema
            const query = `
        SELECT word, video_path 
        FROM gestures 
        WHERE word = ANY($1)
      `;

            const { rows } = await client.query(query, [words]);

            // Create a map for quick lookup
            const wordToVideoMap = new Map();
            rows.forEach((row: any) => {
                wordToVideoMap.set(row.word, row.video_path);
            });

            // 4. Sequence Construction
            // Reconstruct the sequence in original order, using fallbacks if needed
            const videoSequence = words.map(word => {
                if (wordToVideoMap.has(word)) {
                    return {
                        word: word,
                        video: wordToVideoMap.get(word),
                        found: true
                    };
                } else {
                    // Fallback mechanism: could be spelling out letters, or just a placeholder
                    // For now, we return the word without a video path
                    return {
                        word: word,
                        video: null,
                        found: false
                    };
                }
            });

            return NextResponse.json({ sequence: videoSequence });

        } finally {
            request.signal.addEventListener('abort', () => {
                // handle abortion if necessary
            });
            // release client back to pool
            // With @neondatabase/serverless, pool handles connections, 
            // typically we don't manually release in the same way as pg unless using `connect()`
            // But since we did `await pool.connect()`, we should release.
            // However, @neondatabase/serverless documentation suggests `pool.query` directly 
            // or releasing the client if connected.
            // Wait, the client from pool.connect() in 'pg' style needs release.
            // 'client.release()' exists on the client object.
            // (The standard pg types might be missing if we uninstalled pg types, 
            // but let's assume standard behavior).
            // Actually, @neondatabase/serverless Pool.connect() returns a client compatible with pg.
            // It has a .release() method.
            // Let's safe-guard.
            if ((client as any).release) (client as any).release();
        }

    } catch (error) {
        console.error('Translation API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
