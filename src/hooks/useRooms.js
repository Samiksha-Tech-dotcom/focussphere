// src/hooks/useRooms.js
import { useState, useEffect, useCallback } from 'react'
import { getRooms, createRoom, joinRoom, leaveRoom } from '../services/dataService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const useRooms = () => {
  const { user } = useAuth()
  const [rooms,       setRooms]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [currentRoom, setCurrentRoom] = useState(null)

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    try   { setRooms(await getRooms()) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  const create = useCallback(async data => {
    if (!user) return
    const id  = await createRoom(user.uid, data)
    const room = { id, ...data, createdBy: user.uid, members: [user.uid], memberCount: 1, active: true }
    setRooms(p => [room, ...p])
    setCurrentRoom(room)
    toast.success('Room created!')
    return id
  }, [user])

  const join = useCallback(async room => {
    if (!user || currentRoom?.id === room.id) return
    if (currentRoom) await leaveRoom(currentRoom.id, user.uid, currentRoom.members)
    await joinRoom(room.id, user.uid)
    setCurrentRoom(room)
    toast.success(`Joined "${room.name}"`)
  }, [user, currentRoom])

  const leave = useCallback(async () => {
    if (!user || !currentRoom) return
    await leaveRoom(currentRoom.id, user.uid, currentRoom.members)
    setCurrentRoom(null)
    toast('Left the room')
    fetchRooms()
  }, [user, currentRoom, fetchRooms])

  return { rooms, loading, currentRoom, create, join, leave, refetch: fetchRooms }
}
