import React from 'react'
import { Box, Chip, Typography } from '@mui/material'
import { THEME, SERIF } from './salesTheme'

const toList = (v) => (Array.isArray(v) ? v : v ? [v] : [])
const toText = (item) => (typeof item === 'string' ? item : JSON.stringify(item))

function ReportSection({ title, items, ordered = false, empty }) {
  const list = toList(items)
  return (
    <Box
      sx={{
        bgcolor: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderRadius: '14px',
        p: 2.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: THEME.muted,
          mb: 1.25,
        }}
      >
        {title}
      </Typography>

      {list.length > 0 ? (
        <Box
          component={ordered ? 'ol' : 'ul'}
          sx={{ m: 0, pl: 2.5, '& li': { fontSize: 15, lineHeight: 1.6, mb: 0.75 } }}
        >
          {list.map((item, i) => (
            <li key={i}>{toText(item)}</li>
          ))}
        </Box>
      ) : (
        <Typography sx={{ fontSize: 14, color: THEME.muted }}>{empty}</Typography>
      )}
    </Box>
  )
}

function SalesReport({ report, title }) {
  if (!report) return null

  return (
    <Box sx={{ mt: 5, pt: 4, borderTop: `1px solid ${THEME.border}` }}>
      {/* Main heading */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{ fontFamily: SERIF, fontSize: { xs: 28, md: 34 }, fontWeight: 500, lineHeight: 1.2 }}
          >
            Sales Opportunity Report
          </Typography>
          {title && (
            <Typography sx={{ mt: 0.5, fontSize: 15, color: THEME.muted }}>{title}</Typography>
          )}
        </Box>

        <Chip
          label={`Confidence: ${report.confidence || 'N/A'}`}
          sx={{
            bgcolor: THEME.successBg,
            color: THEME.success,
            fontWeight: 600,
            border: '1px solid #BBF7D0',
          }}
        />
      </Box>

      {/* Decision */}
      <Box
        sx={{
          bgcolor: THEME.surface,
          border: `1px solid ${THEME.border}`,
          borderLeft: `4px solid ${THEME.accent}`,
          borderRadius: '14px',
          p: 2.5,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: THEME.muted,
            mb: 0.75,
          }}
        >
          Final decision
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5 }}>
          {report.final_decision || 'N/A'}
        </Typography>
      </Box>

      {/* Reasoning */}
      <Box
        sx={{
          bgcolor: THEME.surface,
          border: `1px solid ${THEME.border}`,
          borderRadius: '14px',
          p: 2.5,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: THEME.muted,
            mb: 0.75,
          }}
        >
          Reasoning
        </Typography>
        <Typography sx={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {report.final_reasoning || 'No reasoning provided.'}
        </Typography>
      </Box>

      {/* Strengths / Risks */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mb: 2,
        }}
      >
        <ReportSection title="Strengths" items={report.strengths} empty="No strengths identified." />
        <ReportSection title="Risks" items={report.risks} empty="No risks identified." />
      </Box>

      {/* Evidence / Next steps */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ReportSection title="Evidence" items={report.evidence} empty="No evidence available." />
        <ReportSection
          title="Recommended next steps"
          items={report.recommended_next_steps}
          ordered
          empty="No next steps available."
        />
      </Box>
    </Box>
  )
}

export default SalesReport
