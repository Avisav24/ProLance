import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9shbsR35LOkW7e_isf3JpBkImYhJ-gnA",
  authDomain: "gradely-17e3c.firebaseapp.com",
  projectId: "gradely-17e3c",
  storageBucket: "gradely-17e3c.firebasestorage.app",
  messagingSenderId: "581564163198",
  appId: "1:581564163198:web:c5e124475b8156af75a42f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
