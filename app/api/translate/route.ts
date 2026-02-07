import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Initialize Neon SQL client
        const sql = neon(process.env.DATABASE_URL!);

        // 1. Normalization: Lowercase and remove punctuation
        const normalized = message.toLowerCase().replace(/[^\w\s]/g, "");

        // 2. Tokenization: Split into words
        const words = normalized.split(/\s+/).filter(w => w.length > 0);

        if (words.length === 0) {
            return NextResponse.json({ sequence: [] });
        }

        // 3. Direct SQL Query to fetch matching gestures
        const results = await sql`
      SELECT word, video_path 
      FROM gestures 
      WHERE word = ANY(${words})
    `;

        // 4. Create a map for quick lookup
        const wordToVideoMap = new Map();
        results.forEach((row: any) => {
            wordToVideoMap.set(row.word, row.video_path);
        });

        // 5. Build sequence maintaining original word order
        const sequence = words.map(word => {
            if (wordToVideoMap.has(word)) {
                return {
                    word: word,
                    video: wordToVideoMap.get(word),
                    found: true
                };
            } else {
                // Word not found in database
                return {
                    word: word,
                    video: null,
                    found: false
                };
            }
        });

        return NextResponse.json({ sequence });

    } catch (error) {
        console.error('Translation API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
