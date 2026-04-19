// src/components/common/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-base)' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:48, height:48, border:'3px solid var(--border)', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
          <p style={{ color:'var(--text-secondary)', fontFamily:'Syne', fontWeight:600 }}>Entering FocusSphere...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" replace />
}

export default ProtectedRoute
