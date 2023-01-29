// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue, child, get, onChildAdded, onChildChanged, onChildRemoved, update, remove, off } from "firebase/database";
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signOut as _signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZAYM7_p1Stxrw97GgZGyTKFPVdWgRQJk",
  authDomain: "valueproptool.firebaseapp.com",
  projectId: "valueproptool",
  storageBucket: "valueproptool.appspot.com",
  messagingSenderId: "65125453176",
  appId: "1:65125453176:web:7cdd683313a536a1988c8d",
  measurementId: "G-7P78P9RRM8",
  databaseURL: "https://valueproptool-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const emailLinkSignIn = {
    isSignInWithEmailLink,
    sendSignInLinkToEmail,
    signInWithEmailLink
}
export const federatedSignIn = {
    signInWithRedirect,
    GoogleAuthProvider,
    getRedirectResult,
    signInWithPopup
}
export const signOut = _signOut;

// DB
const db = getDatabase(app);

const readObj = async (path) => {
  console.debug(`Fetching data from path: ${path}`);
  const dbRef = ref(db, path);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const value = snapshot.val();
    console.debug(`Fetched: `, value);
    return value;
  } else {
    console.debug(`No data available.`);
    return null;
  }
};

export const addedToList = async (path, callback, cancelCallback) => onChildAdded(ref(db, path), callback, cancelCallback);
export const removedFromList = async (path, callback, cancelCallback) => onChildRemoved(ref(db, path), callback, cancelCallback);
export const changedInList = async (path, callback, cancelCallback) => onChildChanged(ref(db, path), callback, cancelCallback);
export const unsubscribe = async (path) => off(ref(db, path));
export const readItem = async (path) => get(ref(db, path));
export const writeItem = async (path, data) => set(ref(db, path), data);
export const deleteItem = async (path) => remove(ref(db, path));
export const updateItem = async (path, val) => {
  const updateSpec = {};
  updateSpec[path] = val;
  return update(ref(db), updateSpec);
};

