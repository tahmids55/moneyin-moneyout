# MoneyIN MoneyOUT

Personal finance web app focused on fast tracking, clear insights, and secure user-scoped data.

## Overview

MoneyIN MoneyOUT helps users manage day-to-day financial activity with a dashboard-first experience. It combines transaction management, budgeting, and analytics in a responsive React interface powered by Firebase realtime data.

## Highlights

- Authenticated, user-isolated finance workspace
- Income/expense tracking with full CRUD flow
- Advanced filtering by date, type, category, and notes
- Budget monitoring with remaining balance and overspending cues
- Analytics with category and monthly trend charts
- Import/export support for CSV transaction workflows
- Theme and preference persistence (light/dark, currency, date format, timezone)
- Realtime data sync and offline-capable Firestore persistence

## Product Areas

- Dashboard: at-a-glance balance, spending patterns, and budget status
- Transactions: searchable ledger with edit/delete operations
- Analytics: chart-based breakdowns for decision support
- Settings: profile and localization preferences synced per user

## Architecture Snapshot

- Frontend: React 19 + Vite
- UI System: Tailwind CSS
- Authentication: Firebase Auth (email/password)
- Data Layer: Cloud Firestore
- Charting: Chart.js + react-chartjs-2
- Notifications: react-hot-toast

## Security Model

Firestore rules enforce owner-based access on user data collections:

- users: owner-only read/write
- transactions: uid must match authenticated user
- budgets: uid must match authenticated user
- settings: owner-only read/write

## Repository Structure

```text
src/
  components/
  pages/
  firebase/
  hooks/
  services/
  utils/
```

## Status

Active project with production-oriented structure, modular service layer, and deployment-ready frontend architecture.
