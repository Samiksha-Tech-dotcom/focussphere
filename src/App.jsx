// src/App.jsx
import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { TimerProvider } from './context/TimerContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Lazy-loaded pages (React.lazy + Suspense for performance)
const Landing   = lazy(() => import('./pages/Landing'))
const Auth      = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Focus     = lazy(() => import('./pages/Focus'))
const Rooms     = lazy(() => import('./pages/Rooms'))
const Habits    = lazy(() => import('./pages/Habits'))
const Profile   = lazy(() => import('./pages/Profile'))

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-base)',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px',
      }} />
      <p style={{ color: 'var(--text-secondary)', fontFamily: 'Syne', fontWeight: 600 }}>
        Loading...
      </p>
    </div>
  </div>
)

const App = () => (
  <AuthProvider>
    <TimerProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/auth"      element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/focus"     element={<ProtectedRoute><Focus /></ProtectedRoute>} />
            <Route path="/rooms"     element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
            <Route path="/habits"    element={<ProtectedRoute><Habits /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1117',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#5cffd4', secondary: '#0d1117' } },
          error:   { iconTheme: { primary: '#ff5c5c', secondary: '#0d1117' } },
        }}
      />
    </TimerProvider>
  </AuthProvider>
)

export default App
