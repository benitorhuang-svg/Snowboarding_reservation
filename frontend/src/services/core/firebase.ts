import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@core/config/firebase.config';
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

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
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
