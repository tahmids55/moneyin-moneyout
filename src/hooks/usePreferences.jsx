import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { subscribeToSettings, upsertUserSettings } from '../services/settingsService'

const STORAGE_KEY = 'sft.preferences'
const DEFAULT_THEME = 'dark-gray'

const defaultPreferences = {
  theme: DEFAULT_THEME,
  currency: 'USD',
  dateFormat: 'DD/MM/YYYY',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  notificationsEnabled: true,
  overspendAlertsEnabled: true,
}

function forceDarkGrayTheme(preferences) {
  return {
    ...preferences,
    theme: DEFAULT_THEME,
  }
}

function getStoredPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultPreferences
    }

    return forceDarkGrayTheme({ ...defaultPreferences, ...JSON.parse(raw) })
  } catch {
    return defaultPreferences
  }
}

const PreferencesContext = createContext(null)

export function PreferencesProvider({ children }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState(() => getStoredPreferences())

  useEffect(() => {
    if (!user?.uid) {
      return undefined
    }

    const unsubscribe = subscribeToSettings(
      user.uid,
      (settings) => {
        if (!settings) {
          return
        }

        const merged = forceDarkGrayTheme({ ...defaultPreferences, ...settings })
        setPreferences(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      },
      () => {
        // Keep local preferences on settings read errors.
      },
    )

    return unsubscribe
  }, [user])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
    root.classList.add('dark-gray')
  }, [preferences.theme])

  const updatePreferences = useCallback(async (partial) => {
    let nextPreferences = null

    setPreferences((prev) => {
      nextPreferences = forceDarkGrayTheme({ ...prev, ...partial })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences))
      return nextPreferences
    })

    if (user?.uid && nextPreferences) {
      await upsertUserSettings(user.uid, nextPreferences)
    }
  }, [user])

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
      currency: preferences.currency,
      dateFormat: preferences.dateFormat,
      timezone: preferences.timezone,
      notificationsEnabled: preferences.notificationsEnabled,
      overspendAlertsEnabled: preferences.overspendAlertsEnabled,
      theme: preferences.theme,
    }),
    [preferences, updatePreferences],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider')
  }

  return context
}
