import { initializeApp } from "firebase/app";
import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBV_TyY_4EGRj6ENXh6EJKaiFcYxIlE8QY",
  authDomain: "dogwitter.firebaseapp.com",
  projectId: "dogwitter",
  storageBucket: "dogwitter.appspot.com",
  messagingSenderId: "1029081199812",
  appId: "1:1029081199812:web:1eda310221c0b3c6450591"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);