// src/context/TimerContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { saveSession, updateStreak } from '../services/dataService'
import toast from 'react-hot-toast'

const TimerContext = createContext(null)

export const TimerProvider = ({ children }) => {
  const { user, refreshProfile } = useAuth()
  const [focusDuration, setFocusDuration] = useState(25 * 60)
  const [breakDuration, setBreakDuration] = useState(5 * 60)
  const [timeLeft,   setTimeLeft]   = useState(25 * 60)
  const [isRunning,  setIsRunning]  = useState(false)
  const [isBreak,    setIsBreak]    = useState(false)
  const [cycle,      setCycle]      = useState(1)
  const [sessionLabel, setSessionLabel] = useState('Deep Focus')
  const intervalRef = useRef(null)

  const playSound = useCallback((type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const schedule = (freq, startAt, dur) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.frequency.value = freq
        g.gain.setValueAtTime(0.25, ctx.currentTime + startAt)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + dur)
        o.start(ctx.currentTime + startAt)
        o.stop(ctx.currentTime + startAt + dur)
      }
      if (type === 'start') {
        schedule(528, 0, 0.4)
      } else {
        [0, 0.35, 0.7].forEach(t => schedule(type === 'complete' ? 880 : 440, t, 0.3))
      }
    } catch (_) {}
  }, [])

  const handleSessionComplete = useCallback(async () => {
    playSound('complete')
    const mins = Math.round(focusDuration / 60)
    if (user) {
      try {
        await saveSession(user.uid, { duration: mins, label: sessionLabel, cycle, type: 'focus' })
        await updateStreak(user.uid)
        await refreshProfile()
      } catch (e) { console.error(e) }
    }
    toast.success(`🎉 Session complete! +${mins} min`, { duration: 4000 })
    setIsBreak(true)
    setTimeLeft(breakDuration)
    setIsRunning(false)
  }, [user, focusDuration, breakDuration, sessionLabel, cycle, playSound, refreshProfile])

  const handleBreakComplete = useCallback(() => {
    playSound('start')
    toast('☕ Break over — ready to focus?', { icon: '⏱️' })
    setIsBreak(false)
    setCycle(c => c + 1)
    setTimeLeft(focusDuration)
    setIsRunning(false)
  }, [focusDuration, playSound])

  useEffect(() => {
    if (!isRunning) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          if (!isBreak) handleSessionComplete()
          else          handleBreakComplete()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isBreak, handleSessionComplete, handleBreakComplete])

  const start  = useCallback(() => { playSound('start'); setIsRunning(true)  }, [playSound])
  const pause  = useCallback(() => setIsRunning(false), [])
  const reset  = useCallback(() => {
    setIsRunning(false); setIsBreak(false)
    setTimeLeft(focusDuration); setCycle(1)
  }, [focusDuration])

  const updateFocusDuration = useCallback(mins => {
    const s = mins * 60
    setFocusDuration(s)
    if (!isRunning && !isBreak) setTimeLeft(s)
  }, [isRunning, isBreak])

  const updateBreakDuration = useCallback(mins => setBreakDuration(mins * 60), [])

  return (
    <TimerContext.Provider value={{
      timeLeft, isRunning, isBreak, cycle, sessionLabel,
      focusDuration, breakDuration,
      start, pause, reset, setSessionLabel,
      updateFocusDuration, updateBreakDuration,
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider')
  return ctx
}
