import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithCustomToken,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

// Firebase configuration — replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSy-placeholder',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'snowboarding-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'snowboarding-dev',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'snowboarding-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:placeholder',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();

// --- Auth Helper Functions ---

export async function firebaseSignInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function firebaseRegisterWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function firebaseSignInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function firebaseSignInWithCustomToken(token: string) {
  return signInWithCustomToken(auth, token);
}

export async function firebaseSignOut() {
  return signOut(auth);
}

/**
 * Get the current user's Firebase ID Token.
 * This is used as the Bearer token for all API calls to the NestJS backend.
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/**
 * Force refresh the ID Token (useful when token is about to expire).
 */
export async function getIdTokenForced(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(true);
}

export { onAuthStateChanged, type FirebaseUser };
