// Firebase Configuration for NHBC Osogbo
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCDNxNbeCcPey_hbHIs4azKWfvnvngthkc",
  authDomain: "nhbcosogbo-aef94.firebaseapp.com",
  databaseURL: "https://nhbcosogbo-aef94-default-rtdb.firebaseio.com",
  projectId: "nhbcosogbo-aef94",
  storageBucket: "nhbcosogbo-aef94.firebasestorage.app",
  messagingSenderId: "382219691884",
  appId: "1:382219691884:web:233542d1bbdc2b63877549",
  measurementId: "G-42WW20WEN6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
