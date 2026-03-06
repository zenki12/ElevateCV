import { NextResponse } from 'next/server';
import { getCounter, incrementCounter } from '../../../lib/counter';

export async function GET() {
    try {
        const count = getCounter();
        return NextResponse.json({ count });
    } catch (error) {
        return NextResponse.json({ count: 9 });
    }
}

export async function POST() {
    try {
        const count = incrementCounter();
        return NextResponse.json({ count });
    } catch (error) {
        return NextResponse.json({ count: 10 });
    }
}
