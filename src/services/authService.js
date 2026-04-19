// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const googleProvider = new GoogleAuthProvider()

export const registerUser = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName })
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName,
    email,
    createdAt: serverTimestamp(),
    totalFocusTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessionsCompleted: 0,
    lastSessionDate: null,
    avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${displayName}`,
  })
  return user
}

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password).then(c => c.user)

export const loginWithGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProvider)
  const snap = await getDoc(doc(db, 'users', user.uid))
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
      totalFocusTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      sessionsCompleted: 0,
      lastSessionDate: null,
      avatar: user.photoURL || `https://api.dicebear.com/7.x/shapes/svg?seed=${user.uid}`,
    })
  }
  return user
}

export const logoutUser = () => signOut(auth)
