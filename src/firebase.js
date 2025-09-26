// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8S5npQ7dwu8wqMc5oA_xR9l-qLT2qjfo",
  authDomain: "yapgpt-5116e.firebaseapp.com",
  projectId: "yapgpt-5116e",
  storageBucket: "yapgpt-5116e.firebasestorage.app",
  messagingSenderId: "73051226011",
  appId: "1:73051226011:web:b29b39eadd0900c0072b3e",
  measurementId: "G-Q7FGG45MGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);