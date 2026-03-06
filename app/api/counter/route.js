import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Using a file in the system temp directory (or local project dir) to act as a basic global counter.
// Note: On Vercel, this will reset on cold starts. For true persistence, a database (like Redis) is required.
const getCounterFilePath = () => {
    // Determine path based on environment
    if (process.env.NODE_ENV === 'production') {
        return path.join('/tmp', 'elevatecv_counter.json');
    }
    return path.join(process.cwd(), 'counter.json');
};

const counterFilePath = getCounterFilePath();

const initializeCounter = () => {
    if (!fs.existsSync(counterFilePath)) {
        try {
            fs.writeFileSync(counterFilePath, JSON.stringify({ count: 9 }));
        } catch (e) {
            console.error('Cannot write to counter file', e);
        }
    }
};

export async function GET() {
    try {
        initializeCounter();
        const data = fs.readFileSync(counterFilePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ count: 9 });
    }
}

export async function POST() {
    try {
        initializeCounter();
        let currentCount = 9;
        if (fs.existsSync(counterFilePath)) {
            const data = fs.readFileSync(counterFilePath, 'utf8');
            currentCount = JSON.parse(data).count;
        }

        currentCount++;
        fs.writeFileSync(counterFilePath, JSON.stringify({ count: currentCount }));

        return NextResponse.json({ count: currentCount });
    } catch (error) {
        return NextResponse.json({ count: 10 });
    }
}
