import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, serverTimestamp } from '../firebase/config'

export function subscribeToSettings(uid, onData, onError) {
  const settingsRef = doc(db, 'settings', uid)

  return onSnapshot(
    settingsRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null)
        return
      }

      onData(snapshot.data())
    },
    onError,
  )
}

export async function upsertUserSettings(uid, settings) {
  const settingsRef = doc(db, 'settings', uid)

  await setDoc(
    settingsRef,
    {
      uid,
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
