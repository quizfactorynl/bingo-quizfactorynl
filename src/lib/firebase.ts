// Firebase entry point

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_apiKey,
   authDomain: process.env.NEXT_PUBLIC_authDomain,
   projectId: process.env.NEXT_PUBLIC_projectId,
   storageBucket: process.env.NEXT_PUBLIC_storageBucket,
   messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
   appId: process.env.NEXT_PUBLIC_appId,
   measurementId: process.env.NEXT_PUBLIC_measurementId
};

interface InitializeFirebaseAppType {
   firebaseApp: FirebaseApp;
   firebaseAuth: Auth;
   firebaseStore: Firestore;
   fireStorage: FirebaseStorage;
}

function initializeFirebaseApp(): InitializeFirebaseAppType {
   const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
   const firebaseAuth: Auth = getAuth(firebaseApp);
   const firebaseStore: Firestore = getFirestore(firebaseApp);
   const fireStorage: FirebaseStorage = getStorage(firebaseApp);

   return {
      firebaseApp,
      firebaseAuth,
      firebaseStore,
      fireStorage
   };
}

export const firebase: InitializeFirebaseAppType = initializeFirebaseApp();



// collections
export const musicsColRef = collection(firebase.firebaseStore, 'musics');
// export function uploadBingo (title: string)


export function uploadMusic (title: string, artist: string, bingoName: string) {
   const docRef = doc(musicsColRef)
   return setDoc(docRef, {
      id: docRef.id,
      title,
      artist,
      bingos: arrayUnion(bingoName)
   });
}

export function updateMusic (doc_id: string, title: string, artist: string) {
   const docRef = doc(musicsColRef, doc_id)
   return updateDoc(docRef, {
      id: docRef.id,
      title,
      artist
   });
}