import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {verifyIdToken, getFirebaseAdminDb} from '@/lib/firebase/firebaseAdmin';

export const runtime = 'nodejs'; // Ensure Node.js runtime

const LoginRequestSchema = z.object({
  idToken: z.string().describe("Firebase ID token obtained from client-side authentication."),
});

export async function POST(request: NextRequest) {
  const db = getFirebaseAdminDb();
  if (!db) {
    return NextResponse.json({error: 'Firebase Admin SDK (Firestore) not initialized.'}, {status: 500});
  }
  
  try {
    const body = await request.json();
    const validation = LoginRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({error: 'Invalid request: idToken is required.', details: validation.error.flatten()}, {status: 400});
    }

    const {idToken} = validation.data;

    const decodedToken = await verifyIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json({error: 'Invalid or expired ID token.'}, {status: 401});
    }

    // Optionally, fetch user profile from Firestore
    const userProfileRef = db.collection('users').doc(decodedToken.uid);
    const userProfileSnap = await userProfileRef.get();

    if (!userProfileSnap.exists) {
      // This case should ideally not happen if registration ensures profile creation
      console.warn(`User profile not found in Firestore for UID: ${decodedToken.uid}`);
      // You might choose to create a profile here if it's missing, or return an error/limited data
      return NextResponse.json({
        message: 'Login successful (token verified), but user profile missing.',
        uid: decodedToken.uid,
        email: decodedToken.email,
      }, {status: 200});
    }

    return NextResponse.json({
      message: 'Login successful (token verified)',
      user: userProfileSnap.data(),
    }, {status: 200});

  } catch (error: any) {
    console.error('Error in login route:', error);
    return NextResponse.json({error: 'Login verification failed', details: error.message}, {status: 500});
  }
}
