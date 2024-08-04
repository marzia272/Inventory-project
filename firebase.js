// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {Firestore, getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE2HtF1r1NKgKNSINe6cXa97blliu3FQY",
  authDomain: "inventory-management-361b9.firebaseapp.com",
  projectId: "inventory-management-361b9",
  storageBucket: "inventory-management-361b9.appspot.com",
  messagingSenderId: "467608936971",
  appId: "1:467608936971:web:4bc8758e50e26a223e1d0e",
  measurementId: "G-XL0J7151F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export{firestore}