export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_apiKey || 'AIzaSy-placeholder',
  authDomain:
    import.meta.env.VITE_FIREBASE_authDomain || 'snowboarding-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_projectId || 'snowboarding-dev',
  storageBucket:
    import.meta.env.VITE_FIREBASE_storageBucket || 'snowboarding-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_appId || '1:000000000000:web:placeholder',
};
