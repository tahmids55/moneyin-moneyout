import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../firebase/config'

const transactionsRef = collection(db, 'transactions')

export function subscribeToTransactions(uid, onData, onError) {
  const q = query(
    transactionsRef,
    where('uid', '==', uid),
    orderBy('date', 'desc'),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
      onData(items)
    },
    onError,
  )
}

export async function addTransaction(uid, payload) {
  return addDoc(transactionsRef, {
    uid,
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
