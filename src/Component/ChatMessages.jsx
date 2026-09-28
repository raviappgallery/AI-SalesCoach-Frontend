import React, { useState } from 'react'
import { Box, Collapse, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { THEME } from './salesTheme'

const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`
const shimmer = keyframes`
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
`
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 #00363D3A; }
  50% { box-shadow: 0 0 0 8px rgba(217, 119, 87, 0); }
`

const ANALYSIS_SECTIONS = [
  { key: 'facts', label: 'Facts', color: '#15803D', bg: '#F0FDF4' },
  { key: 'opinions', label: 'Opinions', color: '#1D4ED8', bg: '#EFF6FF' },
  { key: 'unverifiedClaims', label: 'Unverified claims', color: '#B45309', bg: '#FFFBEB' },
  { key: 'missingInformation', label: 'Missing information', color: '#B91C1C', bg: '#FEF2F2' },
]

export function AgentAvatar({ busy = false }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: '50%',
        bgcolor: THEME.accent,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: busy ? `${pulse} 1.6s ease-in-out infinite` : 'none',
      }}
    >
      <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
    </Box>
  )
}

export function RoundProgress({ round, maxRounds }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {Array.from({ length: maxRounds }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 18,
              height: 4,
              borderRadius: 2,
              bgcolor: i < round ? THEME.text : THEME.border,
            }}
          />
        ))}
      </Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: THEME.muted }}>
        Round {round} of {maxRounds}
      </Typography>
    </Box>
  )
}

/* ---------------------------- User (right side) ---------------------------- */

export function UserMessage({ message }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box sx={{ maxWidth: '78%' }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: THEME.muted,
            textAlign: 'right',
            mb: 0.5,
          }}
        >
          {message.kind === 'opportunity' ? 'Opportunity' : 'Your answer'}
        </Typography>
        <Box
          sx={{
            bgcolor: THEME.active,
            color: THEME.text,
            px: 2,
            py: 1.5,
            borderRadius: '18px 18px 4px 18px',
            fontSize: 15,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.text}
        </Box>
      </Box>
    </Box>
  )
}

/* ---------------------------- Agent (left side) ---------------------------- */

export function AgentMessage({ message, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  const sections = ANALYSIS_SECTIONS.map((s) => ({
    ...s,
    items: message[s.key] || [],
  })).filter((s) => s.items.length > 0)

  const analysisCount = sections.reduce((n, s) => n + s.items.length, 0)
  const questions = message.questions || []

  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <AgentAvatar />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          maxWidth: 720,
          bgcolor: THEME.surface,
          border: `1px solid ${THEME.border}`,
          borderRadius: '4px 18px 18px 18px',
          p: 2.5,
        }}
      >
        <RoundProgress round={message.round} maxRounds={message.maxRounds} />

        {analysisCount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box
              role="button"
              tabIndex={0}
              onClick={() => setOpen((o) => !o)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen((o) => !o)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: THEME.muted,
                fontSize: 13,
                fontWeight: 600,
                '&:hover': { color: THEME.text },
              }}
            >
              What I've understood so far ({analysisCount})
              <ExpandMoreRoundedIcon
                sx={{
                  fontSize: 18,
                  transition: 'transform .2s',
                  transform: open ? 'rotate(180deg)' : 'none',
                }}
              />
            </Box>

            <Collapse in={open} unmountOnExit>
              <Box
                sx={{
                  mt: 1.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                {sections.map((s) => (
                  <Box key={s.key} sx={{ bgcolor: s.bg, borderRadius: '12px', p: 1.75 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 0.4,
                        textTransform: 'uppercase',
                        color: s.color,
                        mb: 0.75,
                      }}
                    >
                      {s.label}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.25, '& li': { fontSize: 14, lineHeight: 1.55, mb: 0.5 } }}>
                      {s.items.map((item, i) => (
                        <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        )}

        {questions.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1.5 }}>
              I need a few more details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {questions.map((q, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      borderRadius: '50%',
                      bgcolor: THEME.hover,
                      color: THEME.text,
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: '2px',
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography sx={{ fontSize: 15, lineHeight: 1.6 }}>
                    {typeof q === 'string' ? q : JSON.stringify(q)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

/* ------------------------- Loading indicator (left) ------------------------ */

const SkeletonLine = ({ width }) => (
  <Box
    sx={{
      height: 10,
      width,
      borderRadius: 5,
      background: `linear-gradient(90deg, ${THEME.hover} 25%, #fff 50%, ${THEME.hover} 75%)`,
      backgroundSize: '600px 100%',
      animation: `${shimmer} 1.4s linear infinite`,
    }}
  />
)

export function ThinkingMessage({ label = 'Analyzing…' }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }} aria-live="polite">
      <AgentAvatar busy />
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: THEME.surface,
          border: `1px solid ${THEME.border}`,
          borderRadius: '4px 18px 18px 18px',
          p: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: THEME.accent,
                  animation: `${dotBounce} 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: THEME.muted }}>{label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <SkeletonLine width="92%" />
          <SkeletonLine width="78%" />
          <SkeletonLine width="60%" />
        </Box>
      </Box>
    </Box>
  )
}
