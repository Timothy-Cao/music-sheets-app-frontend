// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCHoujM4HqvNmKTHpowYRVorHZ7dXSuirI",
  authDomain: "music-sheets-app-6315a.firebaseapp.com",
  projectId: "music-sheets-app-6315a",
  storageBucket: "music-sheets-app-6315a.firebasestorage.app",
  messagingSenderId: "950463371339",
  appId: "1:950463371339:web:c31e0ef855ef63924ad5ce",
  measurementId: "G-XK8X0MJ9C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { db, app };