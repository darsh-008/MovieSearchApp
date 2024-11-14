// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3Ql_2j8Fx8TFZtGGSCAiWUfG6XaZY6_I",
  authDomain: "moveapp-e688b.firebaseapp.com",
  projectId: "moveapp-e688b",
  storageBucket: "moveapp-e688b.firebasestorage.app",
  messagingSenderId: "218424725321",
  appId: "1:218424725321:web:9fdfe9f99beabea38dd498"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
