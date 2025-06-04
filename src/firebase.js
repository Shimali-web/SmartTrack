// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6ea9yUvGqKmkpJfnSdwFA2VDgTinkUmc",
  authDomain: "unlife-dashboard.firebaseapp.com",
  projectId: "unlife-dashboard",
  storageBucket: "unlife-dashboard.firebasestorage.app",
  messagingSenderId: "119265525373",
  appId: "1:119265525373:web:a39687bce655de7c9d3b14",
  measurementId: "G-SYFED66R2Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);