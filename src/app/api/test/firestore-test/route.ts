// File: src/app/api/test/firestore-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(request: NextRequest) {
  console.log('🔥 POST /api/test/firestore-test hit');

  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const db = getFirebaseAdminDb();
    const docRef = db.collection('test_users').doc();
    await docRef.set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'User written successfully', id: docRef.id }, { status: 201 });
  } catch (err: any) {
    console.error('❌ POST Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  console.log('📥 GET /api/test/firestore-test hit');

  try {
    const db = getFirebaseAdminDb();
    const snapshot = await db.collection('test_users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (err: any) {
    console.error('❌ GET Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
