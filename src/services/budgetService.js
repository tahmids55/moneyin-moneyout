import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../firebase/config'

const budgetsRef = collection(db, 'budgets')

export function subscribeToBudget(uid, onData, onError) {
  const q = query(budgetsRef, where('uid', '==', uid), limit(1))

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(null)
        return
      }

      const budgetDoc = snapshot.docs[0]
      onData({ id: budgetDoc.id, ...budgetDoc.data() })
    },
    onError,
  )
}

export async function upsertMonthlyBudget(uid, monthlyBudget, existingBudgetId = null) {
  const value = Number(monthlyBudget)

  const q = query(budgetsRef, where('uid', '==', uid), limit(1))

  if (existingBudgetId) {
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      return updateDoc(snapshot.docs[0].ref, {
        monthlyBudget: value,
        updatedAt: serverTimestamp(),
      })
    }
  }

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return addDoc(budgetsRef, {
      uid,
      monthlyBudget: value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  return updateDoc(snapshot.docs[0].ref, {
    monthlyBudget: value,
    updatedAt: serverTimestamp(),
  })
}
