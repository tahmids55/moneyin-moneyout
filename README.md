# Student Finance Tracker

Student Finance Tracker is a full-stack React + Firebase application for managing income, expenses, budgets, and analytics with realtime updates.

The app now includes professional-grade theming with Light and Dark modes, user settings persistence, and a consistent modern color palette across all pages.

## Tech Stack

- Frontend: React (Vite)
- Styling: Tailwind CSS (class-based dark mode)
- Backend: Firebase (Auth + Firestore, no Express)
- Database: Firestore (realtime)
- Charts: Chart.js + react-chartjs-2
- Notifications: react-hot-toast

## Theming and Color Palette

### Light Mode (default)

- Primary: #34D399
- Secondary: #1E3A8A
- Accent/Alerts: #FBBF24
- Background: #F3F4F6
- Card: #FFFFFF
- Text: #111827

### Dark Mode

- Background: #111827
- Card: #1F2937
- Primary/Buttons: #3B82F6
- Accent/Alerts: #FBBF24
- Text: #F9FAFB

### Behavior

- Theme toggle in Settings page
- User preference saved in localStorage and Firestore `settings/{uid}`
- App applies palette globally using CSS variables + Tailwind class strategy
- Income, expense, and alert colors are consistently mapped across cards/charts/alerts

## Core Features

### Authentication

- Email/password sign up and login
- Session persistence with Firebase Auth
- Protected routes and logout

### Transactions

- Add, edit, delete
- Filters: date range, type, category, note search
- User-scoped queries (`where uid == current user`)
- CSV export
- CSV import

### Dashboard and Analytics

- Total income, total expense, balance
- Pie chart: expense by category
- Bar chart: monthly income vs expense
- Monthly budget, remaining budget, overspending warning

### Settings Page

- Light/Dark mode toggle
- Currency selection (USD, BDT, EUR, GBP, INR, CAD, AUD)
- Date format selection (DD/MM/YYYY, MM/DD/YYYY)
- Timezone selection
- Profile info update (name/email)
- Notifications toggle
- Overspending alerts toggle

### Realtime and Offline

- Realtime updates via Firestore `onSnapshot`
- Offline support enabled with IndexedDB persistence

## Firestore Collections

- users
  - uid, name, email, createdAt, updatedAt
- transactions
  - uid, type, amount, category, note, date, createdAt, updatedAt
- budgets
  - uid, monthlyBudget, createdAt, updatedAt
- settings
  - uid, theme, currency, dateFormat, timezone, notificationsEnabled, overspendAlertsEnabled, updatedAt

## Project Structure

```
src/
  components/
  pages/
  firebase/
  hooks/
  services/
  utils/
```

## Setup

1. Create a Firebase project.
2. Enable Authentication -> Email/Password.
3. Create Firestore database.
4. Copy `.env.example` to `.env` and fill values.
5. Publish rules from `firestore.rules`.

### Environment Variables

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run lint
npm run build
npm run preview
```

## Deploy to Vercel

1. Push repository to GitHub.
2. Import in Vercel.
3. Framework: Vite.
4. Add all `VITE_FIREBASE_*` vars to Vercel Environment Variables.
5. Deploy.

If SPA fallback is needed:

- Source: /(.*)
- Destination: /index.html

## Firebase Security Rules Summary

- users: owner-only access (`doc id == auth.uid`)
- transactions: read/write allowed only when `uid == auth.uid`
- budgets: read/write allowed only when `uid == auth.uid`
- settings: owner-only access (`doc id == auth.uid`)

## Sample Test Data

Use this after creating a user and replacing `YOUR_UID`:

```json
{
  "users/YOUR_UID": {
    "uid": "YOUR_UID",
    "name": "Demo Student",
    "email": "demo@student.com"
  },
  "budgets/auto-generated-id": {
    "uid": "YOUR_UID",
    "monthlyBudget": 20000
  },
  "transactions/auto-generated-id-1": {
    "uid": "YOUR_UID",
    "type": "income",
    "amount": 15000,
    "category": "Scholarship",
    "note": "Monthly support",
    "date": "2026-03-01T00:00:00.000Z"
  },
  "transactions/auto-generated-id-2": {
    "uid": "YOUR_UID",
    "type": "expense",
    "amount": 3200,
    "category": "Food",
    "note": "Campus meals",
    "date": "2026-03-10T00:00:00.000Z"
  },
  "settings/YOUR_UID": {
    "uid": "YOUR_UID",
    "theme": "light",
    "currency": "USD",
    "dateFormat": "DD/MM/YYYY",
    "timezone": "Asia/Dhaka",
    "notificationsEnabled": true,
    "overspendAlertsEnabled": true
  }
}
```
