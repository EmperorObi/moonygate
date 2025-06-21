
// This file is deprecated and will be removed.
// The functionality has been moved to /api/credit/initiate/route.ts
// to reflect the new identifier-based processing flow.

import {NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { error: "This endpoint is deprecated. Please use /api/credit/initiate." },
        { status: 410 } // HTTP 410 Gone
    );
}
