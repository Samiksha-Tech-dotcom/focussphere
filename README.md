# 🚀 FocusSphere – Social Deep Work Platform

> "Focus deeper, together."

FocusSphere is a real-time, social productivity web app that combines **Pomodoro focus sessions**, **live group study rooms**, and **habit tracking** into one immersive dark-mode experience — with real people keeping you accountable.

---

## 🎯 Problem Statement

Students and remote learners struggle with focus, consistency, and accountability. Existing solutions (standalone Pomodoro timers or habit trackers) work in isolation and fail to provide the social motivation needed for sustained deep work.

**Target Users:** College students · Remote learners · Competitive exam aspirants · Solo developers & designers

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧑‍🤝‍🧑 **Live Study Rooms** | Create/join rooms by category, see members live |
| ⏱️ **Smart Pomodoro** | Custom intervals, auto-cycles, sound alerts, session labels |
| 📊 **Dashboard** | 7-day chart, streak tracking, focus insights |
| ✅ **Habit Tracker** | Full CRUD, emoji/color picker, 21-day completion grid |
| 🧠 **Focus Insights** | Personalized patterns based on your sessions |
| 🏆 **Achievements** | 6 unlockable badges on Profile page |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React 18** + Vite 5 |
| Routing | React Router v6 |
| Global State | Context API (AuthContext + TimerContext) |
| Backend | Firebase (Firestore + Authentication) |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Fonts | Syne + DM Sans |

---

## ⚛️ React Concepts Covered

### Core (Compulsory)
- ✅ Functional Components – every component is a function
- ✅ Props & Component Composition – Sidebar, AppLayout, StatCard, etc.
- ✅ `useState` – form fields, UI toggles, timer state, rooms list
- ✅ `useEffect` – auth listener, data fetching, timer interval
- ✅ Conditional Rendering – loading states, auth guard, modal visibility
- ✅ Lists & Keys – habits list, rooms grid, session chart data

### Intermediate
- ✅ Lifting State Up – timer state lifted into TimerContext
- ✅ Controlled Components – all form inputs controlled via state
- ✅ React Router v6 – 7 routes with `<Routes>`, `<Route>`, `<NavLink>`, `<Navigate>`
- ✅ Context API – `AuthContext` (user + profile), `TimerContext` (Pomodoro)

### Advanced
- ✅ `useMemo` – session stats, weekly chart data, achievement calculations, habit streaks
- ✅ `useCallback` – timer handlers, CRUD operations in custom hooks
- ✅ `useRef` – `setInterval` reference for timer to prevent stale closures
- ✅ `React.lazy` + `Suspense` – all 7 pages are lazy loaded
- ✅ Custom Hooks – `useHabits`, `useSessions`, `useRooms`

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- A Firebase project (free tier is enough)

### Step 1 — Clone & Install

```bash
git clone https://github.com/yourusername/focussphere.git
cd focussphere
npm install
```

### Step 2 — Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Enable **Authentication** → Sign-in providers → **Email/Password** + **Google**
3. Enable **Firestore Database** → Start in **test mode**
4. Go to **Project Settings** → **Your apps** → Add Web App → Copy config

### Step 3 — Add Your Firebase Config

Open `src/services/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID',
}
```

### Step 4 — Firestore Security Rules

In Firebase Console → Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /sessions/{id} {
      allow read, write: if request.auth != null;
    }
    match /habits/{id} {
      allow read, write: if request.auth != null;
    }
    match /rooms/{id} {
      allow read:  if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5 — Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
focussphere/
├── index.html                  ← Vite entry HTML
├── vite.config.js              ← Vite configuration
├── package.json
└── src/
    ├── main.jsx                ← ReactDOM.createRoot entry
    ├── App.jsx                 ← Router + Providers + Suspense
    ├── index.css               ← Global styles + CSS variables
    ├── components/
    │   ├── common/
    │   │   └── ProtectedRoute.jsx
    │   └── layout/
    │       ├── AppLayout.jsx
    │       └── Sidebar.jsx
    ├── context/
    │   ├── AuthContext.jsx     ← onAuthStateChanged + user profile
    │   └── TimerContext.jsx    ← Pomodoro logic, sound, session save
    ├── hooks/
    │   ├── useHabits.js        ← Habit CRUD + optimistic updates
    │   ├── useSessions.js      ← Session fetch + memoized stats
    │   └── useRooms.js         ← Room create/join/leave
    ├── pages/
    │   ├── Landing.jsx         ← Public landing with hero
    │   ├── Auth.jsx            ← Login + Signup + Google
    │   ├── Dashboard.jsx       ← Stats, chart, insights, quick actions
    │   ├── Focus.jsx           ← SVG ring timer + settings
    │   ├── Rooms.jsx           ← Room grid, create, join
    │   ├── Habits.jsx          ← Habit list, modal, 21-day grid
    │   └── Profile.jsx         ← Stats, chart, achievements
    ├── services/
    │   ├── firebase.js         ← Firebase init
    │   ├── authService.js      ← register / login / google / logout
    │   └── dataService.js      ← All Firestore CRUD operations
    └── utils/
        └── helpers.js          ← formatTime, calculateStreak, etc.
```

---

## 🌐 Deployment

```bash
npm run build
# Upload the `dist/` folder to Vercel, Netlify, or Firebase Hosting
```

**Vercel (recommended):**
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Framework preset: **Vite** — it auto-detects everything

---

## 🧑‍⚖️ Viva Talking Points

| Question | Answer |
|---|---|
| Why Vite over CRA? | Vite uses native ES modules — `npm run dev` starts in <500ms vs 10s+ |
| Why Context API? | Avoids Redux boilerplate; AuthContext + TimerContext cover all global state |
| Why custom hooks? | Separation of concerns — pages stay clean, logic lives in hooks |
| Timer with `useRef`? | `setInterval` callback captures stale closure; `useRef` gives mutable reference that persists across renders |
| Why `useMemo` for stats? | Session array computation is O(n); memoizing prevents recalculation on every keystroke |
| Lazy loading? | All 7 pages are `React.lazy` — initial JS bundle is ~40% smaller |

---

## 👨‍💻 Author

Built for **Building Web Applications with React** · Batch 2029

> "Build something you'd be proud to show in an interview."
