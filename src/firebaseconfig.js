// firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvZNXo6BZX1H1FirYqCuFEBTrHWP0zXEQ",
  authDomain: "loginfirebase234.firebaseapp.com",
  databaseURL: "https://loginfirebase234-default-rtdb.firebaseio.com",
  projectId: "loginfirebase234",
  storageBucket: "loginfirebase234.appspot.com",
  messagingSenderId: "87433981635",
  appId: "1:87433981635:web:b34945622e1c839672fc76",
  measurementId: "G-21N31C4WR0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider, storage, analytics };
