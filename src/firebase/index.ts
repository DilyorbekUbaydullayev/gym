
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyAsPVicOVJ4SS-vDVwoq5vpijXlhQGqiDw",
  authDomain: "gym-training-a0030.firebaseapp.com",
  projectId: "gym-training-a0030",
  storageBucket: "gym-training-a0030.firebasestorage.app",
  messagingSenderId: "116022588938",
  appId: "1:116022588938:web:344051f897b3b4339591f3"
};

const app = initializeApp(firebaseConfig);
const auth =getAuth(app)

export {auth}