// import React, { useEffect, useRef, useState } from 'react'
// import { Alert, Box, Button, Chip, Divider, IconButton, InputBase, Typography } from '@mui/material'
// import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
// import AddRoundedIcon from '@mui/icons-material/AddRounded'
// import { startInquiry, answerInquiry } from '../Services/salesApi'
// import SalesReport from './SalesReport'
// import { AgentMessage, ThinkingMessage, UserMessage, RoundProgress } from './ChatMessages'
// import { THEME, SERIF } from './salesTheme'

// const uid = () =>
//   window.crypto && window.crypto.randomUUID
//     ? window.crypto.randomUUID()
//     : `${Date.now()}-${Math.random()}`

// // Turn one API response into a message shown on the left side
// const toAgentMessage = (data) => ({
//   id: uid(),
//   role: 'agent',
//   kind: 'round',
//   round: data.round,
//   maxRounds: data.max_rounds,
//   questions: data.questions || [],
//   facts: data.facts || [],
//   opinions: data.opinions || [],
//   unverifiedClaims: data.unverified_claims || [],
//   missingInformation: data.missing_information || [],
// })

// // Merge an API response into the chat object
// const applyResponse = (base, data) => {
//   // The conversation is only finished once the API returns the final report
//   const done = Boolean(data.report)
//   return {
//     ...base,
//     sessionId: data.session_id || base.sessionId,
//     status: done ? 'completed' : 'questions',
//     round: data.round ?? base.round,
//     maxRounds: data.max_rounds ?? base.maxRounds,
//     messages: done ? base.messages : [...base.messages, toAgentMessage(data)],
//     report: done ? data.report || null : null,
//     updatedAt: Date.now(),
//   }
// }

// const STATUS_LABEL = {
//   starting: 'Analyzing',
//   questions: 'Gathering information',
//   completed: 'Completed',
// }

// /**
//  * Props
//  *  - initialChat: saved chat object to open (null = new opportunity screen)
//  *  - readOnly:    true for chats opened from history (no answer box)
//  *  - onSave(chat): persist chat (called after every successful API response)
//  *  - onCreated(id): called once when a new chat is created
//  *  - onNew():      start a fresh opportunity
//  */
// function SalesAgent({ initialChat = null, readOnly = false, onSave, onCreated, onNew }) {
//   const [chat, setChat] = useState(initialChat)
//   const [title, setTitle] = useState('')
//   const [inquiry, setInquiry] = useState('')
//   const [draft, setDraft] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const endRef = useRef(null)

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
//   }, [chat?.messages?.length, chat?.report, loading])

//   /* ------------------------------ Start inquiry ----------------------------- */

//   const handleStart = async () => {
//     const t = title.trim()
//     const q = inquiry.trim()

//     if (!t || !q) {
//       setError('Please enter both a title and a description of the opportunity.')
//       return
//     }

//     const base = {
//       id: uid(),
//       title: t,
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//       sessionId: null,
//       status: 'starting',
//       round: 0,
//       maxRounds: 3,
//       messages: [{ id: uid(), role: 'user', kind: 'opportunity', text: q }],
//       report: null,
//     }

//     setError('')
//     setLoading(true)
//     setChat(base) // show the user's message + loading indicator immediately

//     try {
//       const data = await startInquiry(q)
//       const next = applyResponse(base, data)
//       setChat(next)
//       onSave?.(next)
//       onCreated?.(next.id)
//       setTitle('')
//       setInquiry('')
//     } catch (err) {
//       setChat(null) // back to the form, inputs are preserved
//       setError(err.message || 'Something went wrong.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   /* ------------------------------ Submit answer ----------------------------- */

//   const handleAnswer = async () => {
//     const text = draft.trim()
//     if (!text || loading || !chat?.sessionId) return

//     const before = chat
//     const answered = {
//       ...before,
//       messages: [...before.messages, { id: uid(), role: 'user', kind: 'answer', text }],
//     }

//     setChat(answered)
//     setDraft('')
//     setError('')
//     setLoading(true)

//     try {
//       const data = await answerInquiry(before.sessionId, text)
//       const next = applyResponse(answered, data)
//       setChat(next)
//       onSave?.(next)
//     } catch (err) {
//       setChat(before) // roll back and restore the draft so nothing is lost
//       setDraft(text)
//       setError(err.message || 'Something went wrong.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const onDraftKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleAnswer()
//     }
//   }

//   const onStartKeyDown = (e) => {
//     if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
//       e.preventDefault()
//       handleStart()
//     }
//   }

//   // Answer box is open for ANY chat (live or saved) until its report exists
//   const canAnswer = Boolean(chat) && Boolean(chat.sessionId) && !chat.report
//   const lastAgentId = chat ? [...chat.messages].reverse().find((m) => m.role === 'agent')?.id : null
//   const loadingLabel = chat?.status === 'starting' ? 'Analyzing your opportunity…' : 'Reviewing your answer…'

//   /* ------------------------------ New opportunity --------------------------- */

//   if (!chat) {
//     return (
//       <Box
//         sx={{
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           px: 2,
//           bgcolor: THEME.bg,
//         }}
//       >
//         <Typography
//           component="h1"
//           sx={{ fontFamily: SERIF, fontSize: { xs: 28, md: 36 }, fontWeight: 500, mb: 3, textAlign: 'center' }}
//         >
//           What opportunity are we analyzing?
//         </Typography>

//         <Box
//           sx={{
//             width: '100%',
//             maxWidth: 720,
//             bgcolor: THEME.surface,
//             border: `1px solid ${THEME.border}`,
//             borderRadius: '20px',
//             boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
//             overflow: 'hidden',
//           }}
//         >
//           <InputBase
//             fullWidth
//             placeholder="Opportunity title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             onKeyDown={onStartKeyDown}
//             inputProps={{ 'aria-label': 'Opportunity title', maxLength: 120 }}
//             sx={{ px: 2.5, py: 1.5, fontSize: 17, fontWeight: 500 }}
//           />
//           <Divider />
//           <InputBase
//             fullWidth
//             multiline
//             minRows={5}
//             maxRows={12}
//             placeholder="Describe the opportunity: customer, project, requirements, budget, timeline, decision maker, or anything else you know…"
//             value={inquiry}
//             onChange={(e) => setInquiry(e.target.value)}
//             onKeyDown={onStartKeyDown}
//             inputProps={{ 'aria-label': 'Opportunity description' }}
//             sx={{ px: 2.5, py: 1.5, fontSize: 15, lineHeight: 1.6, alignItems: 'flex-start' }}
//           />
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', px: 2, pb: 1.5 }}>
//             {/* <Typography sx={{ fontSize: 12, color: THEME.muted }}>Ctrl + Enter to start</Typography> */}
//             <Button
//               variant="contained"
//               disableElevation
//               onClick={handleStart}
//               disabled={loading || !title.trim() || !inquiry.trim()}
//               sx={{
//                 bgcolor: THEME.text,
//                 textTransform: 'none',
//                 borderRadius: '10px',
//                 px: 2.5,
//                 '&:hover': { bgcolor: '#000' },
//               }}
//             >
//               Start analysis
//             </Button>
//           </Box>
//         </Box>

//         {error && (
//           <Alert severity="error" onClose={() => setError('')} sx={{ mt: 2, width: '100%', maxWidth: 720 }}>
//             {error}
//           </Alert>
//         )}
//       </Box>
//     )
//   }

//   /* --------------------------------- Chat view ------------------------------ */

//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: THEME.bg }}>
//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: 2,
//           px: 3,
//           py: 1.5,
//           borderBottom: `1px solid ${THEME.border}`,
//           bgcolor: THEME.surface,
//         }}
//       >
//         <Box sx={{ minWidth: 0 }}>
//           <Typography noWrap sx={{ fontSize: 16, fontWeight: 600 }}>
//             {chat.title}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
//             {chat.round > 0 && <RoundProgress round={chat.round} maxRounds={chat.maxRounds} />}
//             <Chip
//               size="small"
//               label={STATUS_LABEL[chat.status] || chat.status}
//               sx={{
//                 height: 22,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 bgcolor: chat.status === 'completed' ? THEME.successBg : THEME.hover,
//                 color: chat.status === 'completed' ? THEME.success : THEME.muted,
//               }}
//             />
//             {readOnly && chat.report && (
//               <Chip
//                 size="small"
//                 variant="outlined"
//                 label="View only"
//                 sx={{ height: 22, fontSize: 12, color: THEME.muted }}
//               />
//             )}
//           </Box>
//         </Box>

//         <Button
//           variant="outlined"
//           startIcon={<AddRoundedIcon />}
//           onClick={onNew}
//           sx={{
//             textTransform: 'none',
//             borderRadius: '10px',
//             color: THEME.text,
//             borderColor: THEME.border,
//             flexShrink: 0,
//             '&:hover': { borderColor: THEME.muted, bgcolor: THEME.hover },
//           }}
//         >
//           New opportunity
//         </Button>
//       </Box>

//       {/* Conversation */}
//       <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
//         <Box sx={{ maxWidth: 860, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
//           {chat.messages.map((m) =>
//             m.role === 'user' ? (
//               <UserMessage key={m.id} message={m} />
//             ) : (
//               <AgentMessage key={m.id} message={m} defaultOpen={!chat.report && m.id === lastAgentId} />
//             )
//           )}

//           {loading && <ThinkingMessage label={loadingLabel} />}

//           {error && (
//             <Alert severity="error" onClose={() => setError('')}>
//               {error}
//             </Alert>
//           )}

//           {chat.report && <SalesReport report={chat.report} title={chat.title} />}

//           <div ref={endRef} />
//         </Box>
//       </Box>

//       {/* Answer box (only for the live conversation) */}
//       {canAnswer && (
//         <Box sx={{ px: { xs: 2, md: 3 }, pb: 2.5, pt: 1 }}>
//           <Box sx={{ maxWidth: 860, mx: 'auto' }}>
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'flex-end',
//                 gap: 1,
//                 bgcolor: THEME.surface,
//                 border: `1px solid ${THEME.border}`,
//                 borderRadius: '18px',
//                 boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
//                 pl: 2,
//                 pr: 1,
//                 py: 1,
//                 '&:focus-within': { borderColor: '#A8A29E' },
//               }}
//             >
//               <InputBase
//                 fullWidth
//                 multiline
//                 maxRows={8}
//                 placeholder="Type your answer here…"
//                 value={draft}
//                 onChange={(e) => setDraft(e.target.value)}
//                 onKeyDown={onDraftKeyDown}
//                 disabled={loading}
//                 inputProps={{ 'aria-label': 'Your answer' }}
//                 sx={{ fontSize: 15, lineHeight: 1.6, py: 0.5 }}
//               />
//               <IconButton
//                 onClick={handleAnswer}
//                 disabled={!draft.trim() || loading}
//                 aria-label="Send answer"
//                 sx={{
//                   bgcolor: THEME.text,
//                   color: '#fff',
//                   width: 36,
//                   height: 36,
//                   '&:hover': { bgcolor: '#000' },
//                   '&.Mui-disabled': { bgcolor: THEME.active, color: THEME.muted },
//                 }}
//               >
//                 <ArrowUpwardRoundedIcon fontSize="small" />
//               </IconButton>
//             </Box>
//             <Typography sx={{ mt: 0.75, textAlign: 'center', fontSize: 12, color: THEME.muted }}>
//               Enter to send · Shift + Enter for a new line
//             </Typography>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default SalesAgent

import React, { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, Chip, Divider, IconButton, InputBase, Typography } from '@mui/material'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { startInquiry, answerInquiry } from '../Services/salesApi'
import SalesReport from './SalesReport'
import { AnalysisMessage, QuestionMessage, ThinkingMessage, UserMessage, RoundProgress } from './ChatMessages'
import { THEME, SERIF } from './salesTheme'
 
const uid = () =>
  window.crypto && window.crypto.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`
 
const toAnalysisMessage = (data) => ({
  id: uid(),
  role: 'agent',
  kind: 'analysis',
  round: data.round,
  maxRounds: data.max_rounds,
  facts: data.facts || [],
  opinions: data.opinions || [],
  unverifiedClaims: data.unverified_claims || [],
  missingInformation: data.missing_information || [],
})
 
const toQuestionMessage = (data, list, index) => ({
  id: uid(),
  role: 'agent',
  kind: 'question',
  round: data.round,
  maxRounds: data.max_rounds,
  questionNumber: index + 1,
  totalQuestions: list.length,
  text: list[index],
})
 
// Combine one round's Q&A pairs into the single answer string the API expects
const combineQA = (list, answers) =>
  list.map((q, i) => `${i + 1}. ${q}\nAnswer: ${answers[i]}`).join('\n\n')
 
// Merge an API response into the chat object, setting up the question queue
// for this round (or finalizing with the report on the last round).
const applyResponse = (base, data) => {
  const done = Boolean(data.report)
  const questions = data.questions || []
 
  if (done) {
    return {
      ...base,
      sessionId: data.session_id || base.sessionId,
      status: 'completed',
      round: data.round ?? base.round,
      maxRounds: data.max_rounds ?? base.maxRounds,
      activeQuestions: null,
      report: data.report,
      updatedAt: Date.now(),
    }
  }
 
  const messages = [...base.messages]
  const analysisMsg = toAnalysisMessage(data)
  if (analysisMsg.facts.length || analysisMsg.opinions.length || analysisMsg.unverifiedClaims.length || analysisMsg.missingInformation.length) {
    messages.push(analysisMsg)
  }
 
  let activeQuestions = null
  if (questions.length > 0) {
    messages.push(toQuestionMessage(data, questions, 0))
    activeQuestions = { list: questions, index: 0, answers: [], round: data.round, maxRounds: data.max_rounds }
  }
 
  return {
    ...base,
    sessionId: data.session_id || base.sessionId,
    status: 'in-round',
    round: data.round ?? base.round,
    maxRounds: data.max_rounds ?? base.maxRounds,
    messages,
    activeQuestions,
    report: null,
    updatedAt: Date.now(),
  }
}
 
const STATUS_LABEL = {
  starting: 'Analyzing',
  'in-round': 'Gathering information',
  completed: 'Completed',
}
 
/**
 * Props
 *  - initialChat: saved chat object to open (null = new opportunity screen)
 *  - readOnly:    true for chats opened from history (badge only; answers still allowed)
 *  - onSave(chat): persist chat (called after every successful API response)
 *  - onCreated(id): called once when a new chat is created
 *  - onNew():      start a fresh opportunity
 */
function SalesAgent({ initialChat = null, readOnly = false, onSave, onCreated, onNew }) {
  const [chat, setChat] = useState(initialChat)
  const [title, setTitle] = useState('')
  const [inquiry, setInquiry] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
 
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chat?.messages?.length, chat?.report, loading])
 
  /* ------------------------------ Start inquiry ----------------------------- */
 
  const handleStart = async () => {
    const t = title.trim()
    const q = inquiry.trim()
 
    if (!t || !q) {
      setError('Please enter both a title and a description of the opportunity.')
      return
    }
 
    const base = {
      id: uid(),
      title: t,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sessionId: null,
      status: 'starting',
      round: 0,
      maxRounds: 3,
      messages: [{ id: uid(), role: 'user', kind: 'opportunity', text: q }],
      activeQuestions: null,
      report: null,
    }
 
    setError('')
    setLoading(true)
    setChat(base) // show the user's message + loading indicator immediately
 
    try {
      const data = await startInquiry(q)
      const next = applyResponse(base, data)
      setChat(next)
      onSave?.(next)
      onCreated?.(next.id)
      setTitle('')
      setInquiry('')
    } catch (err) {
      setChat(null) // back to the form, inputs are preserved
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }
 
  /* ------------------------------ Submit answer ------------------------------
   * Questions in a round are asked one at a time. Answering a question that
   * isn't the last one in the round just advances locally to the next
   * question — no API call. Only once every question in the round's list has
   * been answered do we call the API, which returns either the next round
   * (new analysis + question queue) or the final report.
   * --------------------------------------------------------------------- */
 
  const handleAnswer = async () => {
    const text = draft.trim()
    if (!text || loading || !chat?.sessionId) return
 
    const aq = chat.activeQuestions
 
    // Fallback: no question queue for this round — send the raw answer as-is
    if (!aq) {
      await sendToApi(text, chat)
      return
    }
 
    const currentQuestion = aq.list[aq.index]
    const answeredMsg = {
      id: uid(),
      role: 'user',
      kind: 'answer',
      text,
      questionText: currentQuestion,
    }
    const nextIndex = aq.index + 1
    const newAnswers = [...aq.answers, text]
 
    if (nextIndex < aq.list.length) {
      // More questions left in this round — advance locally, no API call
      const nextQuestionMsg = {
        id: uid(),
        role: 'agent',
        kind: 'question',
        round: aq.round,
        maxRounds: aq.maxRounds,
        questionNumber: nextIndex + 1,
        totalQuestions: aq.list.length,
        text: aq.list[nextIndex],
      }
 
      const next = {
        ...chat,
        messages: [...chat.messages, answeredMsg, nextQuestionMsg],
        activeQuestions: { ...aq, index: nextIndex, answers: newAnswers },
        updatedAt: Date.now(),
      }
 
      setChat(next)
      onSave?.(next)
      setDraft('')
      setError('')
      return
    }
 
    // Last question of the round — combine every Q&A pair and call the API
    const withAnswer = { ...chat, messages: [...chat.messages, answeredMsg] }
    const combined = combineQA(aq.list, newAnswers)
    await sendToApi(combined, withAnswer)
  }
 
  const sendToApi = async (answerText, baseChat) => {
    setChat(baseChat)
    setDraft('')
    setError('')
    setLoading(true)
 
    try {
      const data = await answerInquiry(baseChat.sessionId, answerText)
      const next = applyResponse(baseChat, data)
      setChat(next)
      onSave?.(next)
    } catch (err) {
      setChat(chat) // roll back to before this submit; keep the draft so nothing is lost
      setDraft(answerText)
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }
 
  const onDraftKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAnswer()
    }
  }
 
  const onStartKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleStart()
    }
  }
 
  // Answer box is open for any chat (live or saved) until its report exists
  const canAnswer = Boolean(chat) && Boolean(chat.sessionId) && !chat.report
  const lastAnalysisId = chat
    ? [...chat.messages].reverse().find((m) => m.role === 'agent' && m.kind === 'analysis')?.id
    : null
  const loadingLabel = chat?.status === 'starting' ? 'Analyzing your opportunity…' : 'Reviewing your answers…'
 
  /* ------------------------------ New opportunity --------------------------- */
 
  if (!chat) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          bgcolor: THEME.bg,
        }}
      >
        <Typography
          component="h1"
          sx={{ fontFamily: SERIF, fontSize: { xs: 28, md: 36 }, fontWeight: 500, mb: 3, textAlign: 'center' }}
        >
          What opportunity are we analyzing?
        </Typography>
 
        <Box
          sx={{
            width: '100%',
            maxWidth: 720,
            bgcolor: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <InputBase
            fullWidth
            placeholder="Opportunity title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={onStartKeyDown}
            inputProps={{ 'aria-label': 'Opportunity title', maxLength: 120 }}
            sx={{ px: 2.5, py: 1.5, fontSize: 17, fontWeight: 600 }}
          />
          <Divider />
          <InputBase
            fullWidth
            multiline
            minRows={5}
            maxRows={12}
            placeholder="Describe the opportunity: customer, project, requirements, budget, timeline, decision maker, or anything else you know…"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            onKeyDown={onStartKeyDown}
            inputProps={{ 'aria-label': 'Opportunity description' }}
            sx={{ px: 2.5, py: 1.5, fontSize: 15, lineHeight: 1.6, alignItems: 'flex-start' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: THEME.muted }}>Ctrl + Enter to start</Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={handleStart}
              disabled={loading || !title.trim() || !inquiry.trim()}
              sx={{
                bgcolor: THEME.text,
                textTransform: 'none',
                borderRadius: '10px',
                px: 2.5,
                '&:hover': { bgcolor: '#000' },
              }}
            >
              Start analysis
            </Button>
          </Box>
        </Box>
 
        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mt: 2, width: '100%', maxWidth: 720 }}>
            {error}
          </Alert>
        )}
      </Box>
    )
  }
 
  /* --------------------------------- Chat view ------------------------------ */
 
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: THEME.bg }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          py: 1.5,
          borderBottom: `1px solid ${THEME.border}`,
          bgcolor: THEME.surface,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 16, fontWeight: 600 }}>
            {chat.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
            {chat.round > 0 && <RoundProgress round={chat.round} maxRounds={chat.maxRounds} />}
            <Chip
              size="small"
              label={STATUS_LABEL[chat.status] || chat.status}
              sx={{
                height: 22,
                fontSize: 12,
                fontWeight: 600,
                bgcolor: chat.status === 'completed' ? THEME.successBg : THEME.hover,
                color: chat.status === 'completed' ? THEME.success : THEME.muted,
              }}
            />
            {readOnly && chat.report && (
              <Chip
                size="small"
                variant="outlined"
                label="View only"
                sx={{ height: 22, fontSize: 12, color: THEME.muted }}
              />
            )}
          </Box>
        </Box>
 
        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={onNew}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            color: THEME.text,
            borderColor: THEME.border,
            flexShrink: 0,
            '&:hover': { borderColor: THEME.muted, bgcolor: THEME.hover },
          }}
        >
          New opportunity
        </Button>
      </Box>
 
      {/* Conversation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        <Box sx={{ maxWidth: 860, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {chat.messages.map((m) => {
            if (m.role === 'user') return <UserMessage key={m.id} message={m} />
            if (m.kind === 'question') return <QuestionMessage key={m.id} message={m} />
            return <AnalysisMessage key={m.id} message={m} defaultOpen={!chat.report && m.id === lastAnalysisId} />
          })}
 
          {loading && <ThinkingMessage label={loadingLabel} />}
 
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
 
          {chat.report && <SalesReport report={chat.report} title={chat.title} />}
 
          <div ref={endRef} />
        </Box>
      </Box>
 
      {/* Answer box */}
      {canAnswer && (
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 2.5, pt: 1 }}>
          <Box sx={{ maxWidth: 860, mx: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                bgcolor: THEME.surface,
                border: `1px solid ${THEME.border}`,
                borderRadius: '18px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                pl: 2,
                pr: 1,
                py: 1,
                '&:focus-within': { borderColor: '#A8A29E' },
              }}
            >
              <InputBase
                fullWidth
                multiline
                maxRows={8}
                placeholder="Type your answer here…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onDraftKeyDown}
                disabled={loading}
                inputProps={{ 'aria-label': 'Your answer' }}
                sx={{ fontSize: 15, lineHeight: 1.6, py: 0.5 }}
              />
              <IconButton
                onClick={handleAnswer}
                disabled={!draft.trim() || loading}
                aria-label="Send answer"
                sx={{
                  bgcolor: THEME.text,
                  color: '#fff',
                  width: 36,
                  height: 36,
                  '&:hover': { bgcolor: '#000' },
                  '&.Mui-disabled': { bgcolor: THEME.active, color: THEME.muted },
                }}
              >
                <ArrowUpwardRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography sx={{ mt: 0.75, textAlign: 'center', fontSize: 12, color: THEME.muted }}>
              {chat.activeQuestions && chat.activeQuestions.index < chat.activeQuestions.list.length - 1
                ? `Enter to send · ${chat.activeQuestions.list.length - chat.activeQuestions.index - 1} question(s) left this round`
                : 'Enter to send · Shift + Enter for a new line'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
 
export default SalesAgent
 