// Import the functions you need from the SDKs you need
import { getDatabase } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5SBaxgR27-iWZo-5wYmynCHpOalI68kE",
  authDomain: "evaluacion-27638.firebaseapp.com",
  projectId: "evaluacion-27638",
  storageBucket: "evaluacion-27638.appspot.com",
  messagingSenderId: "263287456282",
  appId: "1:263287456282:web:30c579c45d40db27cbc7a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  const db = getDatabase(app)