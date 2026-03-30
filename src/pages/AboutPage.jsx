import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AboutPage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="app-content">
        <Topbar
          title="About Us"
          subtitle="Why this tracker exists and how it helps students"
          onMenu={() => setMobileOpen(true)}
        />

        <section className="glass rounded-2xl border border-slate-500/20 p-6">
          <h2 className="font-display text-2xl text-main">MoneyIN MoneyOUT</h2>
          <p className="mt-3 text-sm text-muted">
            This app is built to help students understand cashflow clearly, reduce unplanned spending,
            and build sustainable budgeting habits.
          </p>
          <p className="mt-3 text-sm text-muted">
            It combines secure Firebase authentication, realtime data syncing, and compact visual
            analytics so students can make better decisions every day.
          </p>
        </section>
      </main>
    </div>
  )
}
