// Firebase entry point

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
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
    fireStorage,
  };
}

export const firebase: InitializeFirebaseAppType = initializeFirebaseApp();

// collections
export const musicsColRef = collection(firebase.firebaseStore, "musics");
export const adminsColRef = collection(firebase.firebaseStore, "admins")

// export function uploadBingo (title: string)

export function uploadMusic(title: string, artist: string, bingoName: string) {
  const docRef = doc(musicsColRef);
  return setDoc(docRef, {
    id: docRef.id,
    title,
    artist,
    bingos: arrayUnion(bingoName),
  });
}

export function updateMusic(doc_id: string, title: string, artist: string) {
  const docRef = doc(musicsColRef, doc_id);
  return updateDoc(docRef, {
    id: docRef.id,
    title,
    artist,
  });
}

export const bingosColRef = collection(firebase.firebaseStore, "bingos");
export const refCodeColRef = collection(firebase.firebaseStore, "refCodes");

export const deleteRefCode = (id: string) => {
  const docRef = doc(refCodeColRef, id);
  return deleteDoc(docRef);
};

export const uploadRefCode = async (
  code: string,
  bingo_id: string,
  onSuccess: () => void,
  onFail: (reason: string) => void,
) => {
  // check if bingo exists
  const res = await getCountFromServer(
    query(bingosColRef, where("id", "==", bingo_id)),
  );

  if (res.data().count == 0) {
    onFail("Bingo not found");
    return;
  }

  const docRef = doc(refCodeColRef, code);
  try {
    await setDoc(docRef, {
      id: code,
      code,
      bingo_id,
    });
    onSuccess();
  } catch (err) {
    onFail("Code already exists");
    return;
  }
};

export const uploadBingo = async (
  title: string,
  onFail: () => void,
  onSuccess: () => void,
) => {
  const docRef = doc(bingosColRef);

  const res = await getCountFromServer(
    query(bingosColRef, where("title", "==", title)),
  );
  if (res.data().count > 0) {
    onFail();
    return;
  }

  await setDoc(docRef, {
    id: docRef.id,
    title,
  });
  onSuccess();
};

export const updateBingo = async (
  doc_id: string,
  title: string,
  onFail: () => void,
  onSuccess: () => void,
) => {
  const res = await getCountFromServer(
    query(bingosColRef, where("title", "==", title)),
  );
  if (res.data().count > 0) {
    onFail();
    return;
  }

  const docRef = doc(bingosColRef, doc_id);
  await updateDoc(docRef, {
    id: docRef.id,
    title,
  });
  onSuccess();
};

export const deleteBingo = (id: string) => {
  const docRef = doc(bingosColRef, id);
  return deleteDoc(docRef);
};
