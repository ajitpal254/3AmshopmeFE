// firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCX6CoXASoXATS5qP0XTv-NpzQQ2BWpvqk",
  authDomain: "lostandfound-ce0a0.firebaseapp.com",
  databaseURL: "https://lostandfound-ce0a0-default-rtdb.firebaseio.com",
  projectId: "lostandfound-ce0a0",
  storageBucket: "lostandfound-ce0a0.appspot.com",
  messagingSenderId: "3856268723",
  appId: "1:3856268723:web:2020985d73eec247f4dfc6",
  measurementId: "G-5SHNL5GCD8",
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
