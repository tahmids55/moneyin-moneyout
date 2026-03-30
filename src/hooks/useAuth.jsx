import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getUserProfile } from '../services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setFirebaseUser(nextUser)

      if (nextUser) {
        try {
          const fetchedProfile = await getUserProfile(nextUser.uid)
          setProfile(fetchedProfile)
        } catch (error) {
          console.error('Profile read failed:', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser?.uid) {
      return
    }

    try {
      const fetchedProfile = await getUserProfile(firebaseUser.uid)
      setProfile(fetchedProfile)
    } catch {
      // Ignore refresh failures to avoid breaking active session.
    }
  }, [firebaseUser])

  const value = useMemo(
    () => ({
      user: firebaseUser,
      profile,
      loading,
      isAuthenticated: Boolean(firebaseUser),
      refreshProfile,
    }),
    [firebaseUser, profile, loading, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
