// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-state-app-6584b.firebaseapp.com",
  projectId: "real-state-app-6584b",
  storageBucket: "real-state-app-6584b.appspot.com",
  messagingSenderId: "290860482689",
  appId: "1:290860482689:web:b51743966e239b993dcd80",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
