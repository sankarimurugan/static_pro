// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THESE WITH YOUR OWN KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBDmEndp2NsaB_Ly_zjDHRbQwP8lzb1Oi8",
  authDomain: "registation-form-f5fa4.firebaseapp.com",
  projectId: "registation-form-f5fa4",
  storageBucket: "registation-form-f5fa4.firebasestorage.app",
  messagingSenderId: "719081363223",
  appId: "1:719081363223:web:416914f3096894efa00952",
  measurementId: "G-X65YL151DF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
