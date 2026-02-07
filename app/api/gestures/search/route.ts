import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const phrase = searchParams.get('phrase');

    if (!phrase) {
        return NextResponse.json({ found: false }, { status: 400 });
    }

    try {
        const client = await pool.connect();

        // Normalize input
        const normalizedPhrase = phrase.toLowerCase().replace(/[^\w\s]/g, "");

        // Search for exact phrase match
        const result = await client.query('SELECT word, video_path FROM gestures WHERE word = $1', [normalizedPhrase]);

        client.release();

        if (result.rows.length > 0) {
            return NextResponse.json({
                found: true,
                video_path: result.rows[0].video_path,
                word: result.rows[0].word
            });
        }

        // Not found as a whole phrase, check individual words for fallback guidance
        // (Optional: Could check if individual words exist, but frontend logic handles this)
        return NextResponse.json({ found: false });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ found: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
