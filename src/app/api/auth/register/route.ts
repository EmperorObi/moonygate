import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getFirebaseAdminAuth, getFirebaseAdminDb } from '@/lib/firebase/firebaseAdmin';
import type { UserRecord } from 'firebase-admin/auth';

export const runtime = 'nodejs'; // Ensures compatibility with Firebase Admin SDK

// 🛡️ Zod Schema for user registration
const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export async function POST(request: NextRequest) {
  const auth = getFirebaseAdminAuth();
  const db = getFirebaseAdminDb();

  if (!auth || !db) {
    console.error('Firebase Admin SDK not initialized.');
    return NextResponse.json(
      { error: 'Firebase Admin not available.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid registration data',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, name, password } = validation.data;

    // ✅ Create Firebase Auth user
    let userRecord: UserRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (error: any) {
      const isEmailTaken = error.code === 'auth/email-already-exists';
      console.error('Firebase createUser error:', error);
      return NextResponse.json(
        { error: isEmailTaken ? 'Email already in use.' : 'Firebase user creation failed.', details: error.message },
        { status: isEmailTaken ? 409 : 500 }
      );
    }

    // 🗂 Create corresponding user profile in Firestore
    const now = new Date().toISOString();
    const userProfile = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || name,
      role: 'User',
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.collection('users').doc(userRecord.uid).set(userProfile);
    } catch (error: any) {
      console.error('Firestore profile creation failed:', error);

      // 🧼 Rollback: delete user if Firestore fails to sync
      await auth.deleteUser(userRecord.uid);

      return NextResponse.json(
        {
          error: 'Failed to create user profile. User has been rolled back.',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 🎉 Success response
    return NextResponse.json(
      {
        message: 'Registration successful',
        userId: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unexpected error in registration route:', error);
    return NextResponse.json(
      { error: 'Unexpected registration failure', details: error.message },
      { status: 500 }
    );
  }
}
