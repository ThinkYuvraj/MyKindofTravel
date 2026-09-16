import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ferrous-quota-gc9s2",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:376041942655:web:54efdeb3e2f5a20876994a",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyASTPvUZiHicjHG_MpmcgCc2ZX09RhIgaM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ferrous-quota-gc9s2.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ferrous-quota-gc9s2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "376041942655",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-mykindoftravel2-5bb715a6-cf81-437f-90f7-ac770280edc5");
