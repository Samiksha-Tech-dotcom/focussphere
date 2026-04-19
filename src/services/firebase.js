// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0NsyzEHZa7zB4m7AxbxpQqS5ocUjSmac",
  authDomain: "focus-sphere-88d68.firebaseapp.com",
  projectId: "focus-sphere-88d68",
  storageBucket: "focus-sphere-88d68.firebasestorage.app",
  messagingSenderId: "713214654979",
  appId: "1:713214654979:web:0ecd8f8807f52ec0c6ac36",
  measurementId: "G-DQX7VC1XB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);