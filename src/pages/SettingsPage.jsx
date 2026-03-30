import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { usePreferences } from '../hooks/usePreferences'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile } from '../services/userService'

const currencyOptions = ['USD', 'BDT', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY']
const fallbackTimezones = [
  'UTC',
  'Asia/Dhaka',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Madrid',
  'America/New_York',
]

const preferredTimezones = [
  'UTC',
  'Asia/Dhaka',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Asia/Bangkok',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Zurich',
  'America/New_York',
]

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const { preferences, updatePreferences } = usePreferences()

  const [name, setName] = useState(profile?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const timezoneOptions = useMemo(() => {
    if (typeof Intl.supportedValuesOf === 'function') {
      const supported = Intl.supportedValuesOf('timeZone')
      const merged = [...preferredTimezones, ...supported]
      return Array.from(new Set(merged))
    }

    return fallbackTimezones
  }, [])

  const saveProfile = async (event) => {
    event.preventDefault()

    try {
      setSavingProfile(true)
      await updateUserProfile(user.uid, { name })
      await refreshProfile()
      toast.success('Profile updated')
    } catch {
      toast.error('Could not update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const setTheme = async (theme) => {
    await updatePreferences({ theme })
    toast.success(`Switched to ${theme} mode`)
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="mx-auto mt-6 w-[94%] max-w-6xl space-y-6 pb-12">
        <section className="glass rounded-2xl p-5">
          <h1 className="font-display text-3xl text-main">Settings</h1>
          <p className="mt-1 text-sm text-muted">Personalize your dashboard and regional preferences.</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={saveProfile} className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl text-main">Profile</h2>
            <p className="mt-1 text-sm text-muted">Update your account information used inside the app.</p>

            <div className="mt-4 grid gap-3">
              <label className="field-label">
                Name
                <input
                  type="text"
                  className="field-input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>

              <label className="field-label">
                Email
                <input
                  type="email"
                  className="field-input"
                  value={profile?.email || user?.email || ''}
                  readOnly
                  disabled
                />
              </label>
              <p className="text-xs text-muted">
                Email cannot be edited.
              </p>
            </div>

            <button type="submit" className="btn-primary mt-4" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl text-main">Appearance</h2>
            <p className="mt-1 text-sm text-muted">Switch between light and dark mode instantly.</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  preferences.theme === 'light' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Light Mode
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  preferences.theme === 'dark' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Dark Mode
              </button>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl text-main">Regional Preferences</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="field-label">
              Currency
              <select
                className="field-input"
                value={preferences.currency}
                onChange={(event) => updatePreferences({ currency: event.target.value })}
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Date Format
              <select
                className="field-input"
                value={preferences.dateFormat}
                onChange={(event) => updatePreferences({ dateFormat: event.target.value })}
              >
                {dateFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Timezone
              <select
                className="field-input"
                value={preferences.timezone}
                onChange={(event) => updatePreferences({ timezone: event.target.value })}
              >
                {timezoneOptions.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl text-main">Notifications and Alerts</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="rounded-xl border border-slate-300/60 bg-white/40 p-4 text-main dark:border-slate-600 dark:bg-slate-700/40">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Enable notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notificationsEnabled}
                  onChange={(event) =>
                    updatePreferences({ notificationsEnabled: event.target.checked })
                  }
                />
              </div>
            </label>

            <label className="rounded-xl border border-slate-300/60 bg-white/40 p-4 text-main dark:border-slate-600 dark:bg-slate-700/40">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Budget overspend alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.overspendAlertsEnabled}
                  onChange={(event) =>
                    updatePreferences({ overspendAlertsEnabled: event.target.checked })
                  }
                />
              </div>
            </label>
          </div>
        </section>
      </main>
    </div>
  )
}
