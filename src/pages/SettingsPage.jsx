import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import SettingsSection from '../components/SettingsSection'
import ToggleSwitch from '../components/ToggleSwitch'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const [name, setName] = useState(profile?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categories, setCategories] = useState(() => {
    try {
      const raw = localStorage.getItem('sft.categories')
      return raw ? JSON.parse(raw) : ['Food', 'Transport', 'Tuition', 'Books']
    } catch {
      return ['Food', 'Transport', 'Tuition', 'Books']
    }
  })
  const [includeNotesOnExport, setIncludeNotesOnExport] = useState(true)
  const [budgetReminder, setBudgetReminder] = useState(80)

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

  const addCategory = () => {
    const next = newCategory.trim()
    if (!next) {
      return
    }
    if (categories.includes(next)) {
      toast.error('Category already exists')
      return
    }

    const updated = [...categories, next]
    setCategories(updated)
    localStorage.setItem('sft.categories', JSON.stringify(updated))
    setNewCategory('')
    toast.success('Category added')
  }

  const removeCategory = (item) => {
    const updated = categories.filter((category) => category !== item)
    setCategories(updated)
    localStorage.setItem('sft.categories', JSON.stringify(updated))
  }

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="app-content">
        <Topbar
          title="Settings"
          subtitle="Fine tune profile, preferences, exports, and reminders"
          onMenu={() => setMobileOpen(true)}
        />

        <section className="grid gap-6 xl:grid-cols-2">
          <SettingsSection title="Profile" description="Account details synced with Firebase profile documents.">
            <form onSubmit={saveProfile} className="grid gap-3">
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
              <p className="text-xs text-muted">Email cannot be edited.</p>

              <button type="submit" className="btn-primary mt-2" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </SettingsSection>

          <SettingsSection title="Appearance and Region" description="Theme, currency, date format, and timezone.">
            <div className="grid gap-4 md:grid-cols-2">
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

              <label className="field-label md:col-span-2">
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
          </SettingsSection>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <SettingsSection title="Notifications" description="Control alert behavior and reminders.">
            <div className="space-y-3">
              <ToggleSwitch
                label="Enable notifications"
                checked={preferences.notificationsEnabled}
                onChange={(next) => updatePreferences({ notificationsEnabled: next })}
              />
              <ToggleSwitch
                label="Budget overspend alerts"
                checked={preferences.overspendAlertsEnabled}
                onChange={(next) => updatePreferences({ overspendAlertsEnabled: next })}
              />
              <label className="field-label">
                Budget reminder threshold (%)
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={budgetReminder}
                  onChange={(event) => setBudgetReminder(Number(event.target.value || 0))}
                  className="field-input"
                />
              </label>
            </div>
          </SettingsSection>

          <SettingsSection title="Category Management" description="Manage frequently used categories.">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                className="field-input"
                placeholder="Add category"
              />
              <button type="button" className="btn-primary" onClick={addCategory}>
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="status-tag tag-income"
                  onClick={() => removeCategory(item)}
                  title="Click to remove"
                >
                  {item}
                </button>
              ))}
            </div>
          </SettingsSection>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <SettingsSection title="Export Preferences" description="Control what gets included in exports.">
            <div className="space-y-3">
              <ToggleSwitch
                label="Include notes in CSV exports"
                checked={includeNotesOnExport}
                onChange={setIncludeNotesOnExport}
              />
              <p className="text-sm text-muted">
                Exports from Transactions page will always include core fields and can include notes by preference.
              </p>
            </div>
          </SettingsSection>

          <SettingsSection title="Theme" description="Dark mode first with optional light switch.">
            <div className="flex flex-wrap gap-3">
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
              <button
                type="button"
                onClick={() => setTheme('dark-gray')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  preferences.theme === 'dark-gray' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Dark Gray
              </button>
            </div>
          </SettingsSection>
        </section>

        <section className="glass rounded-2xl border border-slate-500/20 p-5">
          <h2 className="font-display text-lg text-main">About Us</h2>
          <p className="text-sm text-muted">
            MoneyIN MoneyOUT helps students build better financial habits with privacy-safe, real-time insights.
          </p>
        </section>
      </main>
    </div>
  )
}
