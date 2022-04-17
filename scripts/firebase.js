// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC03axJUQTmADQF3IY_RUXv3pPizwmNkkw",
  authDomain: "react-chat-app-47c06.firebaseapp.com",
  projectId: "react-chat-app-47c06",
  storageBucket: "react-chat-app-47c06.appspot.com",
  messagingSenderId: "1066999950371",
  appId: "1:1066999950371:web:a3ddb6ae99ff07d923d596",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messagesRef = collection(db, "messages");

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}
