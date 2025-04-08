// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ace-t3.firebaseapp.com",
  projectId: "ace-t3",
  storageBucket: "ace-t3.firebasestorage.app",
  messagingSenderId: "939064013647",
  appId: "1:939064013647:web:a88a1f8447dc3b0413cb3a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
