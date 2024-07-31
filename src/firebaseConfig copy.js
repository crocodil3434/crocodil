// src/firebaseConfig.js
// Firebase v9 modüler importlarını kullanın
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDch4m4dgIWA3XsqYprR2zh03jIlDibsnE",
  authDomain: "crocodil-9f989.firebaseapp.com",
  projectId: "crocodil-9f989",
  storageBucket: "crocodil-9f989.appspot.com",
  messagingSenderId: "348555788628",
  appId: "1:348555788628:web:a8d710bd31ce4cb1a108c1"
};
  

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase hizmetlerini al
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
