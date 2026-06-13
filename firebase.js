import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAF2d0MA7FE_D3M85mbVWqGNLUFhxh_GRw",
  authDomain: "kazi-app-2d673.firebaseapp.com",
  projectId: "kazi-app-2d673",
  storageBucket: "kazi-app-2d673.firebasestorage.app",
  messagingSenderId: "15005462545",
  appId: "1:15005462545:web:70996ece8b86937fc681b0",
  measurementId: "G-CPQVDNR43Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);