import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {getFirebaseAdminAuth, getFirebaseAdminDb} from '@/lib/firebase/firebaseAdmin';
import type {UserRecord} from 'firebase-admin/auth';

export const runtime = 'nodejs'; // Ensure Node.js runtime

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  // Email updates need careful consideration (e.g., re-verification)
  // email: z.string().email().optional(), 
  role: z.enum(['User', 'Admin', 'Editor']).optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended']).optional(), // Maps to Firebase Auth disabled state
});


export async function GET(
  request: NextRequest,
  {params}: {params: {userId: string}}
) {
  const db = getFirebaseAdminDb();
  if (!db) {
    return NextResponse.json({error: 'Firebase Admin SDK (Firestore) not initialized.'}, {status: 500});
  }

  const userId = params.userId;
  const requestingUserUid = request.headers.get('X-User-UID');

  // TODO: Implement proper authorization (user can fetch their own, admin can fetch any)
  // if (requestingUserUid !== userId && !isUserAdmin(requestingUserUid)) {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      return NextResponse.json({error: 'User not found in Firestore'}, {status: 404});
    }
    return NextResponse.json({id: userDocSnap.id, ...userDocSnap.data()});
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    return NextResponse.json({error: `Failed to fetch user ${userId}`, details: error.message}, {status: 500});
  }
}

export async function PUT(
  request: NextRequest,
  {params}: {params: {userId: string}}
) {
  const auth = getFirebaseAdminAuth();
  const db = getFirebaseAdminDb();
  if (!auth || !db) {
    return NextResponse.json({error: 'Firebase Admin SDK not initialized.'}, {status: 500});
  }

  const userId = params.userId;
  const requestingUserUid = request.headers.get('X-User-UID');

  // TODO: Implement proper authorization (user can update their own limited fields, admin can update more)
  // if (requestingUserUid !== userId && !isUserAdmin(requestingUserUid)) {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  try {
    const body = await request.json();
    const validation = UpdateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({error: 'Invalid user data for update', details: validation.error.flatten()}, {status: 400});
    }

    const updateData = validation.data;
    const firestoreUpdateData: Record<string, any> = {...updateData};
    let authUpdateData: Record<string, any> = {};

    if (updateData.name) {
      authUpdateData.displayName = updateData.name;
    }
    if (updateData.status) {
      authUpdateData.disabled = updateData.status !== 'Active';
      firestoreUpdateData.status = updateData.status; // Keep status in Firestore as well
    }
    
    firestoreUpdateData.updatedAt = new Date().toISOString();

    // Update Firebase Auth record if necessary
    if (Object.keys(authUpdateData).length > 0) {
      await auth.updateUser(userId, authUpdateData);
    }

    // Update Firestore profile
    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.update(firestoreUpdateData);
    
    const updatedUserDoc = await userDocRef.get();

    return NextResponse.json({id: updatedUserDoc.id, ...updatedUserDoc.data()});

  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    // Check for specific Firebase errors e.g., user not found in Auth
    if ((error as any).code === 'auth/user-not-found') {
        return NextResponse.json({ error: `User with ID ${userId} not found in Firebase Auth.` }, { status: 404 });
    }
    return NextResponse.json({error: `Failed to update user ${userId}`, details: error.message}, {status: 500});
  }
}

export async function DELETE(
  request: NextRequest,
  {params}: {params: {userId: string}}
) {
  const auth = getFirebaseAdminAuth();
  const db = getFirebaseAdminDb();
  if (!auth || !db) {
    return NextResponse.json({error: 'Firebase Admin SDK not initialized.'}, {status: 500});
  }

  const userId = params.userId;
  const requestingUserUid = request.headers.get('X-User-UID');

  // TODO: Implement proper authorization (admin only)
  // if (!isUserAdmin(requestingUserUid)) {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }
  
  try {
    // Delete from Firebase Auth
    await auth.deleteUser(userId);
    
    // Delete from Firestore
    await db.collection('users').doc(userId).delete();
    
    // TODO: Consider deleting related data (e.g., user's reports, disputes) or anonymizing it.

    console.log(`User ${userId} deleted successfully`);
    return NextResponse.json({message: `User ${userId} deleted successfully`}, {status: 200});
  } catch (error: any) {
    console.error(`Error deleting user ${userId}:`, error);
    if ((error as any).code === 'auth/user-not-found') {
        // If user not in Auth, still attempt to delete from Firestore if they exist there
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                await db.collection('users').doc(userId).delete();
                return NextResponse.json({ message: `User ${userId} deleted from Firestore (was not in Auth).` }, { status: 200 });
            }
        } catch (firestoreError) {
            // ignore, main error is auth/user-not-found
        }
        return NextResponse.json({ error: `User ${userId} not found.` }, { status: 404 });
    }
    return NextResponse.json({error: `Failed to delete user ${userId}`, details: error.message}, {status: 500});
  }
}
