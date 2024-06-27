// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRABASE_API_KEY,
  authDomain: "real-estate-d3467.firebaseapp.com",
  projectId: "real-estate-d3467",
  storageBucket: "real-estate-d3467.appspot.com",
  messagingSenderId: "1058997382446",
  appId: "1:1058997382446:web:815348cd25e97f21899ebf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);