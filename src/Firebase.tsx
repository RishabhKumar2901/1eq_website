import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOlRjW-Gu_WiQrgvOecn-xvRTccNM6Ny4",
  authDomain: "eqwebsite-cfebb.firebaseapp.com",
  projectId: "eqwebsite-cfebb",
  storageBucket: "eqwebsite-cfebb.firebasestorage.app",
  messagingSenderId: "686751750117",
  appId: "1:686751750117:web:d79785a749e2d58d10410c"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);