import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {getFirebaseAdminAuth, getFirebaseAdminDb} from '@/lib/firebase/firebaseAdmin';

export const runtime = 'nodejs'; // Ensure Node.js runtime

// Note: User creation is typically handled via /api/auth/register
// This POST endpoint might be for admin-initiated user creation or bulk imports.
// For simplicity, we'll focus on GET for now.

export async function GET(request: NextRequest) {
  const auth = getFirebaseAdminAuth();
  const db = getFirebaseAdminDb();

  if (!auth || !db) {
    return NextResponse.json({error: 'Firebase Admin SDK not initialized.'}, {status: 500});
  }
  
  // TODO: Implement proper authorization (e.g., only admins can list all users)
  // const requestingUserUid = request.headers.get('X-User-UID');
  // if (!isUserAdmin(requestingUserUid)) {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  try {
    // Fetch users from Firestore (profiles)
    const usersSnap = await db.collection('users').get();
    const users = usersSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
    
    // Alternatively, list users from Firebase Auth (more comprehensive for auth properties)
    // const listUsersResult = await auth.listUsers(1000); // Max 1000 users per page
    // const authUsers = listUsersResult.users.map(userRecord => ({
    //   uid: userRecord.uid,
    //   email: userRecord.email,
    //   displayName: userRecord.displayName,
    //   disabled: userRecord.disabled,
    //   metadata: userRecord.metadata,
    // }));

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({error: 'Failed to fetch users', details: error.message}, {status: 500});
  }
}

// Example schema if you were to implement POST for user creation here (different from register)
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8).optional(), // Password might be auto-generated or set later
  role: z.enum(['User', 'Admin', 'Editor']).default('User'),
});

export async function POST(request: NextRequest) {
    // This endpoint is largely superseded by /api/auth/register for typical user sign-ups.
    // If used, it would be for admin-driven user creation.
    // For now, let's return a "Not Implemented" or point to the registration endpoint.
    return NextResponse.json({ message: "User creation should generally use /api/auth/register. This endpoint is for admin use cases (not fully implemented)." }, { status: 501 });
}
