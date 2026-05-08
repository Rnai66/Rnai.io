import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let adminAuth: ReturnType<typeof getAuth>;
let adminDb: ReturnType<typeof getFirestore>;
let adminStorage: ReturnType<typeof getStorage>;

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const storageBucket = (
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${projectId}.appspot.com`
    ).trim().replace(/^gs:\/\//, "");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase admin credentials not configured");
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.includes("\n") ? privateKey : privateKey.replace(/\\n/g, "\n"),
      }),
      storageBucket,
    });
  }

  if (!adminAuth) adminAuth = getAuth();
  if (!adminDb) adminDb = getFirestore();
  if (!adminStorage) adminStorage = getStorage();
}

export function getAdminAuth() {
  if (!adminAuth) initializeFirebaseAdmin();
  return adminAuth;
}

export function getAdminDb() {
  if (!adminDb) initializeFirebaseAdmin();
  return adminDb;
}

export function getAdminStorage() {
  if (!adminStorage) initializeFirebaseAdmin();
  return adminStorage;
}
