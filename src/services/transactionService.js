import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../firebase/config'

const transactionsRef = collection(db, 'transactions')

function toMillis(value) {
  if (!value) {
    return 0
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate().getTime()
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }

  return 0
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => toMillis(b.date) - toMillis(a.date))
}

async function migrateLegacyUserIdDocs(uid) {
  const legacyQuery = query(transactionsRef, where('userId', '==', uid))
  const snapshot = await getDocs(legacyQuery)

  await Promise.all(
    snapshot.docs
      .filter((docItem) => !docItem.data().uid)
      .map((docItem) =>
        updateDoc(doc(db, 'transactions', docItem.id), {
          uid,
          updatedAt: serverTimestamp(),
        }),
      ),
  )
}

export function subscribeToTransactions(uid, onData, onError) {
  // Legacy compatibility: older documents may use userId instead of uid.
  const byUid = query(transactionsRef, where('uid', '==', uid))
  const byLegacyUserId = query(transactionsRef, where('userId', '==', uid))

  const combined = new Map()

  const publish = () => {
    onData(sortByDateDesc(Array.from(combined.values())))
  }

  const unsubscribeUid = onSnapshot(
    byUid,
    (snapshot) => {
      snapshot.docs.forEach((docItem) => {
        combined.set(docItem.id, {
          id: docItem.id,
          ...docItem.data(),
        })
      })
      publish()
    },
    onError,
  )

  const unsubscribeLegacy = onSnapshot(
    byLegacyUserId,
    (snapshot) => {
      snapshot.docs.forEach((docItem) => {
        combined.set(docItem.id, {
          id: docItem.id,
          ...docItem.data(),
        })
      })
      publish()
    },
    onError,
  )

  migrateLegacyUserIdDocs(uid).catch(() => {
    // Safe no-op: migration is best effort only.
  })

  return () => {
    unsubscribeUid()
    unsubscribeLegacy()
  }
}

export async function addTransaction(uid, payload) {
  return addDoc(transactionsRef, {
    uid,
    userId: uid,
    type: payload.type,
    amount: Number(payload.amount),
    category: payload.category.trim(),
    note: payload.note?.trim() || '',
    date: payload.date,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateTransaction(id, payload) {
  const txRef = doc(db, 'transactions', id)

  return updateDoc(txRef, {
    type: payload.type,
    amount: Number(payload.amount),
    category: payload.category.trim(),
    note: payload.note?.trim() || '',
    date: payload.date,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTransaction(id) {
  return deleteDoc(doc(db, 'transactions', id))
}
