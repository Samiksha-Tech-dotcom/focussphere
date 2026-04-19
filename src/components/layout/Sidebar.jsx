// src/components/layout/Sidebar.jsx
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/authService'
import { useTimer } from '../../context/TimerContext'
import { LayoutDashboard, Timer, Users, CheckSquare, User, LogOut, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/focus',     icon: Timer,           label: 'Focus Timer' },
  { to: '/rooms',     icon: Users,           label: 'Study Rooms' },
  { to: '/habits',    icon: CheckSquare,     label: 'Habits' },
  { to: '/profile',   icon: User,            label: 'Profile' },
]

const Sidebar = () => {
  const { userProfile, user } = useAuth()
  const { isRunning, isBreak, timeLeft } = useTimer()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    await logoutUser()
    toast.success('See you soon! 👋')
    navigate('/')
  }

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      minHeight: '100vh',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 0',
      transition: 'width 0.25s ease',
      position: 'relative', flexShrink: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--accent),var(--accent-2))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Zap size={18} color="white" />
          </div>
          {!collapsed && (
            <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:'1.1rem' }}>
              Focus<span style={{ color:'var(--accent)' }}>Sphere</span>
            </span>
          )}
        </div>
      </div>

      {/* Timer pill */}
      {isRunning && !collapsed && (
        <div style={{ margin:'8px 12px', padding:'10px 14px', background: isBreak ? 'rgba(92,255,212,0.08)' : 'rgba(124,92,255,0.1)', border:`1px solid ${isBreak ? 'rgba(92,255,212,0.2)' : 'rgba(124,92,255,0.25)'}`, borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background: isBreak ? 'var(--success)' : 'var(--accent)', animation:'pulse-glow 2s infinite' }} />
          <span style={{ fontFamily:'Syne', fontSize:'0.8rem', color: isBreak ? 'var(--success)' : 'var(--accent)', fontWeight:600 }}>
            {isBreak ? 'Break' : 'Focusing'} · {fmt(timeLeft)}
          </span>
        </div>
      )}

      {/* Nav links */}
      <nav style={{ flex:1, padding:'8px' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:12,
            padding:'10px 12px', borderRadius:'var(--radius-md)',
            textDecoration:'none', marginBottom:4,
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            background: isActive ? 'rgba(124,92,255,0.1)' : 'transparent',
            fontFamily:'Syne', fontWeight:600, fontSize:'0.875rem',
            transition:'all 0.15s',
            justifyContent: collapsed ? 'center' : 'flex-start',
          })}>
            <Icon size={18} strokeWidth={1.75} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding:'12px 8px 0', borderTop:'1px solid var(--border)' }}>
        {!collapsed && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', marginBottom:4 }}>
            <img
              src={userProfile?.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.uid}`}
              alt="avatar"
              style={{ width:32, height:32, borderRadius:'50%', border:'2px solid var(--border)', flexShrink:0 }}
            />
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:'Syne', fontWeight:700, fontSize:'0.8rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {userProfile?.displayName || 'User'}
              </div>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>
                🔥 {userProfile?.currentStreak || 0} day streak
              </div>
            </div>
          </div>
        )}
        <button onClick={logout} className="btn-ghost" style={{ width:'100%', justifyContent: collapsed ? 'center' : 'flex-start', color:'var(--danger)', borderRadius:'var(--radius-md)', padding:'10px 12px' }}>
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(c => !c)} style={{ position:'absolute', top:'50%', right:-12, width:24, height:24, borderRadius:'50%', background:'var(--bg-surface)', border:'1px solid var(--border)', color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20 }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}

export default Sidebar
