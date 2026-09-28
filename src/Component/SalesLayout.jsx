import React, { useState } from 'react'
import { Box } from '@mui/material'
import SideMenue from './SideMenue'
import SalesAgent from './SalesAgent'
import useSalesChats from '../Hooks/useSalesChats'

/**
 * Ties the sidebar (history) and the main panel together.
 * - Every chat is auto-saved to localStorage after each API response.
 * - Chats opened from the sidebar are view-only (no answer box).
 * - Only the conversation started in this session stays editable.
 */
function SalesLayout() {
  const { chats, saveChat } = useSalesChats()

  // key forces SalesAgent to remount when the user picks a chat / starts a new one
  const [view, setView] = useState({ key: 0, chat: null })
  const [activeId, setActiveId] = useState(null)
  const [liveId, setLiveId] = useState(null)

  const openChat = (chat) => {
    setActiveId(chat.id)
    setView((v) => ({ key: v.key + 1, chat }))
  }

  const newChat = () => {
    setActiveId(null)
    setView((v) => ({ key: v.key + 1, chat: null }))
  }

  const handleCreated = (id) => {
    setActiveId(id)
    setLiveId(id)
  }

  const readOnly = activeId !== null && activeId !== liveId

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SideMenue
        chats={chats}
        activeChatId={activeId}
        onNewChat={newChat}
        onSelectChat={openChat}
      />

      <Box sx={{ flex: 1, minWidth: 0, height: '100%' }}>
        <SalesAgent
          key={view.key}
          initialChat={view.chat}
          readOnly={readOnly}
          onSave={saveChat}
          onCreated={handleCreated}
          onNew={newChat}
        />
      </Box>
    </Box>
  )
}

export default SalesLayout
