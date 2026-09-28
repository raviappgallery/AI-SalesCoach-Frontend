import React, { useMemo, useState } from 'react'
import { Box, IconButton, InputBase, Tooltip, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import logo from '../assets/Images/Logo.png'
import logo2 from '../assets/Images/AppGallery.png'

const THEME = {
  bg: '#FAFAF9',
  border: '#E7E5E4',
  hover: '#F0EFED',
  active: '#E8E6E3',
  text: '#1C1917',
  muted: '#78716C',
  accent: '#1C1917',
}

// Replace with real data (e.g. from props / API / redux)
const DEFAULT_CHATS = [
  { id: 1, title: 'Chat Created 1' },
  { id: 2, title: 'Chat Created 2' },
  { id: 3, title: 'Chat Created 3' },
]

function SideMenue({
  chats = DEFAULT_CHATS,
  activeChatId = null,
  onNewChat = () => {},
  onSelectChat = () => {},
  onCollapse,
}) {
  const [query, setQuery] = useState('')

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? chats.filter((c) => c.title.toLowerCase().includes(q)) : chats
  }, [chats, query])


  console.log("Filtered Chats", filteredChats)
  console.log("Chats", chats)

  return (
    <Box
      component="nav"
      sx={{
        width: '30%',
        maxWidth: 260,
        minWidth: 220,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: THEME.bg,
        borderRight: `1px solid ${THEME.border}`,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ height: 40, objectFit: 'contain' }} />
        {onCollapse && (
          <Tooltip title="Collapse sidebar">
            <IconButton size="small" onClick={onCollapse} sx={{ color: THEME.muted }}>
              <ViewSidebarOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Search */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.5,
            bgcolor: '#fff',
            border: `1px solid ${THEME.border}`,
            borderRadius: '10px',
            '&:focus-within': { borderColor: '#A8A29E' },
          }}
        >
          <SearchRoundedIcon sx={{ fontSize: 18, color: THEME.muted }} />
          <InputBase
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1, fontSize: 14, color: THEME.text }}
            inputProps={{ 'aria-label': 'Search chats' }}
          />
        </Box>
      </Box>

      {/* New chat */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box
          component="button"
          type="button"
          onClick={onNewChat}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 1.25,
            py: 1,
            border: 'none',
            borderRadius: '10px',
            bgcolor: THEME.active,
            color: THEME.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color .15s',
            '&:hover': { bgcolor: '#DEDBD7' },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 20 }} />
          New chat
        </Box>
      </Box>

      {/* Recents */}
      <Typography
        sx={{
          px: 2.5,
          pt: 1.5,
          pb: 0.75,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
          color: THEME.muted,
        }}
      >
        Recents
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          pb: 2,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: THEME.border, borderRadius: 3 },
        }}
      >
        {filteredChats.length === 0 && (
          <Typography sx={{ px: 1.25, py: 1, fontSize: 13, color: THEME.muted }}>
            No chats found
          </Typography>
        )}

        {filteredChats.map((chat) => {
          const isActive = chat.id === activeChatId
          return (
            <Box
              key={chat.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectChat(chat)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectChat(chat)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.25,
                py: 0.9,
                mb: 0.25,
                borderRadius: '10px',
                cursor: 'pointer',
                bgcolor: isActive ? THEME.active : 'transparent',
                color: THEME.text,
                transition: 'background-color .15s',
                '&:hover': { bgcolor: isActive ? THEME.active : THEME.hover },
                '&:focus-visible': { outline: `2px solid ${THEME.accent}`, outlineOffset: -2 },
              }}
            >
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17, color: THEME.muted }} />
              <Typography
                noWrap
                title={chat.title}
                sx={{ fontSize: 14, fontWeight: isActive ? 500 : 400 }}
              >
                {chat.title}
              </Typography>
            </Box>
          )
        })}
      </Box>

      <Box className='d-flex flex-column p-2 align-items-center gap-2 mb-2'>
        <Typography variant='caption' className='text-center mx-auto' sx={{color:"#0000008A"}}>Powered By</Typography>   
        <Box component={'img'} src={logo2} width={'90%'}/>
      </Box>
    </Box>
  )
}

export default SideMenue