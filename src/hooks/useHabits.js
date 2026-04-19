// src/hooks/useHabits.js
import { useState, useEffect, useCallback } from 'react'
import { getHabits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } from '../services/dataService'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export const useHabits = () => {
  const { user } = useAuth()
  const [habits,  setHabits]  = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHabits = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try   { setHabits(await getHabits(user.uid)) }
    catch { toast.error('Failed to load habits') }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchHabits() }, [fetchHabits])

  const add = useCallback(async data => {
    if (!user) return
    const id = await addHabit(user.uid, data)
    setHabits(p => [...p, { id, userId: user.uid, completedDates: [], streak: 0, ...data }])
    toast.success('Habit added!')
  }, [user])

  const update = useCallback(async (id, data) => {
    await updateHabit(id, data)
    setHabits(p => p.map(h => h.id === id ? { ...h, ...data } : h))
  }, [])

  const remove = useCallback(async id => {
    await deleteHabit(id)
    setHabits(p => p.filter(h => h.id !== id))
    toast.success('Habit removed')
  }, [])

  const toggle = useCallback(async id => {
    const today = format(new Date(), 'yyyy-MM-dd')
    await toggleHabitCompletion(id, today)
    setHabits(p => p.map(h => {
      if (h.id !== id) return h
      const dates = h.completedDates || []
      return {
        ...h,
        completedDates: dates.includes(today)
          ? dates.filter(d => d !== today)
          : [...dates, today],
      }
    }))
  }, [])

  return { habits, loading, add, update, remove, toggle, refetch: fetchHabits }
}
