// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLexJG2KiyOcsHhkFWLj9Wy9gG_-fmwRI",
  authDomain: "task-manager-voosh-961be.firebaseapp.com",
  projectId: "task-manager-voosh-961be",
  storageBucket: "task-manager-voosh-961be.appspot.com",
  messagingSenderId: "350221886264",
  appId: "1:350221886264:web:9b461bb5a6f4d67d77d7cd",
  measurementId: "G-B6KFW21REW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };