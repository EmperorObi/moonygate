// File: lib/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

let db: admin.firestore.Firestore;

// Initialize Admin SDK once using ADC (Application Default Credentials)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('✅ Firebase Admin initialized with Application Default Credentials');

  db = admin.firestore();

  const host = process.env.FIRESTORE_EMULATOR_HOST;
  if (host) {
    db.settings({ host, ssl: false });
    console.log(`📦 Firestore emulator connected at ${host}`);
  }
} else {
  db = admin.firestore();
}

// Export helpers
export const getFirebaseAdminAuth = () => admin.auth();
export const getFirebaseAdminDb = () => db;
