import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, serverTimestamp } from '../firebase/config'

export async function createUserProfile({ uid, name, email }) {
  const userRef = doc(db, 'users', uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid,
      name,
      email,
      createdAt: serverTimestamp(),
    })
  }
}

export async function getUserProfile(uid) {
  const userRef = doc(db, 'users', uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data()
}

export async function updateUserProfile(uid, payload) {
  const userRef = doc(db, 'users', uid)
  const safeName = typeof payload?.name === 'string' ? payload.name.trim() : null

  await setDoc(
    userRef,
    {
      ...(safeName ? { name: safeName } : {}),
      uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
