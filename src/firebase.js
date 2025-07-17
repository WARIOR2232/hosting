// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// GANTI dengan config dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAswgg7ldhHDVmzFXNcgB9H1Yf8u1Knqk8",
  authDomain: "kek-ni.firebaseapp.com",
  projectId: "kek-ni",
  storageBucket: "kek-ni.firebasestorage.app",
  messagingSenderId: "432775372626",
  appId: "1:432775372626:web:931b5b9f291f724cf1248b",
  measurementId: "G-70SWRR5MCP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
