import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQKSe5o4gSYy6l9UWEG60NTORmG2N3HwQ",
  authDomain: "homework04-43746.firebaseapp.com",
  projectId: "homework04-43746",
  storageBucket: "homework04-43746.appspot.com",
  messagingSenderId: "349385116485",
  appId: "1:349385116485:web:66c9990d6e6877d3e1cc2c",
  measurementId: "G-5X72JKPLN1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
