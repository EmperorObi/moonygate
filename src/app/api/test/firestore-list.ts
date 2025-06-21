// Adds a GET Endpoint for Quick Verification
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirebaseAdminDb } from '@/lib/firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getFirebaseAdminDb();
  if (!db) return res.status(500).json({ error: 'Firestore not initialized' });

  try {
    const snapshot = await db.collection('test_users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
