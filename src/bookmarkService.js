// src/services/bookmarkService.js
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Add a bookmark
export const addBookmark = async (userId, movie) => {
  const userDoc = doc(db, "users", userId);
  await setDoc(
    userDoc,
    { bookmarks: arrayUnion(movie) },
    { merge: true }
  );
};

// Remove a bookmark
export const removeBookmark = async (userId, movie) => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    bookmarks: arrayRemove(movie),
  });
};

// Get bookmarks for a user
export const getBookmarks = async (userId) => {
  const userDoc = doc(db, "users", userId);
  const docSnapshot = await getDoc(userDoc);
  return docSnapshot.exists() ? docSnapshot.data().bookmarks : [];
};
