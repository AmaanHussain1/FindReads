// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in your Firebase Console -> Project Settings -> General -> "Your apps"
const firebaseConfig = {
  apiKey: "AIzaSyBqFp3HbGw0uEAvnwRi9biLdRd39TQdDUQ",
  authDomain: "book-search-app-1b983.firebaseapp.com",
  projectId: "book-search-app-1b983",
  storageBucket: "book-search-app-1b983.firebasestorage.app",
  messagingSenderId: "786790626002",
  appId: "1:786790626002:web:7995b64ef40a573767b30b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);