import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

let app: admin.app.App;

if (serviceAccountPath) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const serviceAccount = require(serviceAccountPath) as ServiceAccount;
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // Fallback for local dev if only project ID is provided
  app = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'snowboarding-v2-dev',
  });
}

export const firebaseAuth: admin.auth.Auth = admin.auth(app);
