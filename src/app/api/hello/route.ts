import { NextResponse } from 'next/server';

export function GET() {
  console.log('🔔 hello route hit');
  return NextResponse.json({ ok: true });
}
