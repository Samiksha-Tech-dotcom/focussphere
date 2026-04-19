// src/services/dataService.js
import {
  doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc,
  collection, query, where, getDocs, orderBy,
  serverTimestamp, increment, arrayUnion, limit,
} from 'firebase/firestore'
import { db } from './firebase'
import { format } from 'date-fns'

// ── Sessions ────────────────────────────────────────────────────────────────

export const saveSession = async (userId, sessionData) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  await addDoc(collection(db, 'sessions'), {
    userId,
    ...sessionData,
    date: today,
    timestamp: serverTimestamp(),
  })
  await updateDoc(doc(db, 'users', userId), {
    totalFocusTime: increment(sessionData.duration),
    sessionsCompleted: increment(1),
  })
}

export const getUserSessions = async (userId, days = 30) => {
  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(days * 10),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Habits ──────────────────────────────────────────────────────────────────

export const getHabits = async userId => {
  const q = query(collection(db, 'habits'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addHabit = async (userId, data) => {
  const ref = await addDoc(collection(db, 'habits'), {
    userId, ...data,
    createdAt: serverTimestamp(),
    completedDates: [],
    streak: 0,
  })
  return ref.id
}

export const updateHabit  = (id, data) => updateDoc(doc(db, 'habits', id), data)
export const deleteHabit  = id         => deleteDoc(doc(db, 'habits', id))

export const toggleHabitCompletion = async (habitId, date) => {
  const ref  = doc(db, 'habits', habitId)
  const snap = await getDoc(ref)
  const completed = snap.data().completedDates || []
  await updateDoc(ref, {
    completedDates: completed.includes(date)
      ? completed.filter(d => d !== date)
      : arrayUnion(date),
  })
}

// ── User ─────────────────────────────────────────────────────────────────────

export const getUserProfile   = async uid => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export const updateUserProfile = (uid, data) => updateDoc(doc(db, 'users', uid), data)

// ── Streak ───────────────────────────────────────────────────────────────────

export const updateStreak = async userId => {
  const ref  = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  const data = snap.data()
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

  let newStreak = data.currentStreak || 0
  if (data.lastSessionDate === yesterday) newStreak += 1
  else if (data.lastSessionDate !== today)  newStreak  = 1

  await updateDoc(ref, {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, data.longestStreak || 0),
    lastSessionDate: today,
  })
  return newStreak
}

// ── Rooms ─────────────────────────────────────────────────────────────────────

export const getRooms = async () => {
  const q = query(collection(db, 'rooms'), where('active', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createRoom = async (userId, data) => {
  const ref = await addDoc(collection(db, 'rooms'), {
    ...data,
    createdBy: userId,
    createdAt: serverTimestamp(),
    active: true,
    members: [userId],
    memberCount: 1,
  })
  return ref.id
}

export const joinRoom = (roomId, userId) =>
  updateDoc(doc(db, 'rooms', roomId), {
    members: arrayUnion(userId),
    memberCount: increment(1),
  })

export const leaveRoom = async (roomId, userId, members) => {
  const updated = members.filter(m => m !== userId)
  await updateDoc(doc(db, 'rooms', roomId), updated.length === 0
    ? { active: false, members: [] }
    : { members: updated, memberCount: updated.length })
}
