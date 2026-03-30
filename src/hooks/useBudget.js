import { useEffect, useState } from 'react'
import { subscribeToBudget } from '../services/budgetService'

export function useBudget(uid) {
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      return undefined
    }

    const unsubscribe = subscribeToBudget(
      uid,
      (budgetDoc) => {
        setBudget(budgetDoc)
        setLoading(false)
      },
      () => {
        setLoading(false)
      },
    )

    return unsubscribe
  }, [uid])

  if (!uid) {
    return { budget: null, loading: false }
  }

  return { budget, loading }
}
