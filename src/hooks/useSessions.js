// src/hooks/useSessions.js
import { useState, useEffect, useCallback, useMemo } from 'react'
import { getUserSessions } from '../services/dataService'
import { useAuth } from '../context/AuthContext'
import { format, subDays } from 'date-fns'

export const useSessions = () => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)

  const fetchSessions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try   { setSessions(await getUserSessions(user.uid, 30)) }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')

    const todaySessions = sessions.filter(s => s.date === today)
    const todayMinutes  = todaySessions.reduce((a, s) => a + (s.duration || 0), 0)

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d    = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
      const mins = sessions.filter(s => s.date === d).reduce((a, s) => a + (s.duration || 0), 0)
      return { date: d, label: format(subDays(new Date(), 6 - i), 'EEE'), minutes: mins }
    })

    const totalMinutes = sessions.reduce((a, s) => a + (s.duration || 0), 0)

    // best focus hour
    const hourMap = {}
    sessions.forEach(s => {
      if (s.timestamp?.toDate) {
        const h = s.timestamp.toDate().getHours()
        hourMap[h] = (hourMap[h] || 0) + (s.duration || 0)
      }
    })
    const bestHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]
    const bestTimeLabel = bestHour
      ? parseInt(bestHour[0]) < 12 ? 'morning' : parseInt(bestHour[0]) < 17 ? 'afternoon' : 'evening'
      : null

    return {
      todayMinutes,
      todaySessions: todaySessions.length,
      weeklyData,
      totalMinutes,
      avgDaily: totalMinutes / 30,
      bestTimeLabel,
    }
  }, [sessions])

  return { sessions, loading, stats, refetch: fetchSessions }
}
