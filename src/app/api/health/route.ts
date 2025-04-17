import { NextResponse } from 'next/server';

export async function GET() {
    // Return a simple response indicating the service is healthy
    return NextResponse.json(
        {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'kafi-web-client',
        },
        { status: 200 },
    );
}
