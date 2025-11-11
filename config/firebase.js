// config/firebase.js
// Initialisation Firebase robuste pour Expo + React Native

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// ✅ Ton vrai projet Firebase analytique :
/*const firebaseConfig = {
  apiKey: "AIzaSyDkIeKM32iqK1IdIjb6WB3v1POPealWHNY",
  authDomain: "arrosageintelligent.firebaseapp.com",
  databaseURL: "https://arrosageintelligent-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "arrosageintelligent",
  storageBucket: "arrosageintelligent.firebasestorage.app",
  //storageBucket: "arrosageintelligent.appspot.com",
  messagingSenderId: "964040889499",
  appId: "1:964040889499:web:a4ac93f38d5797d7c8223e",
  measurementId: "G-P3GWGNE99V"
};

// 🧠 Vérifie si Firebase est déjà initialisé (important pour Expo)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentification & Base de données
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;*/
