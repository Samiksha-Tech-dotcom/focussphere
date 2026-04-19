// src/components/layout/AppLayout.jsx
import React from 'react'
import Sidebar from './Sidebar'

const AppLayout = ({ children }) => (
  <div style={{ display:'flex', minHeight:'100vh', position:'relative' }}>
    <div className="orb" style={{ width:600, height:600, background:'var(--accent)', top:-200, left:-200 }} />
    <div className="orb" style={{ width:400, height:400, background:'var(--accent-2)', bottom:-100, right:-100 }} />
    <Sidebar />
    <main style={{ flex:1, minHeight:'100vh', overflowY:'auto', position:'relative', zIndex:1 }}>
      {children}
    </main>
  </div>
)

export default AppLayout
