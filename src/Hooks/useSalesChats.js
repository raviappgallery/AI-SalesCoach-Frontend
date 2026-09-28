import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'sales_agent_chats_v1'

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Persists sales-agent conversations in localStorage.
 * Each chat: { id, title, createdAt, updatedAt, sessionId, status, round,
 *              maxRounds, messages: [], report }
 */
export default function useSalesChats() {
  const [chats, setChats] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (err) {
      console.warn('Could not save chats to localStorage', err)
    }
  }, [chats])

  // Insert or update by id; most recently updated goes to the top
  const saveChat = useCallback((chat) => {
    setChats((prev) => [
      { ...chat, updatedAt: Date.now() },
      ...prev.filter((c) => c.id !== chat.id),
    ])
  }, [])

  const deleteChat = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return { chats, saveChat, deleteChat }
}
