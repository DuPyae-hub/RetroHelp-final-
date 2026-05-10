import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { api, getApiErrorMessage } from '../api/client'
import { useSupportOpener } from '../context/SupportOpenerContext'
import { useLanguage } from '../i18n/LanguageContext'

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

function toApiMessages(rows: ChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  return rows.map((m) => ({ role: m.role, content: m.text }))
}

function IconHeadset({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 14v-3a6 6 0 1 1 12 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6 14v2.5a2 2 0 0 0 2 2h1M18 14v2.5a2 2 0 0 1-2 2h-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        fill="currentColor"
        d="M8 14h2v4H8a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2Zm8 0h2v4h-2a2 2 0 0 0-2-2v0a2 2 0 0 0 2-2Z"
        opacity=".35"
      />
    </svg>
  )
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 5h6l1 2h3v2H5V7h3l1-2Zm0 4v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12l16-6-6 16-2-6-6-2-2-2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-stone-100 bg-white px-3 py-2 shadow-sm">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-teal-500"
          animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  )
}

function SupportMascot() {
  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
      <motion.div
        className="absolute h-36 w-36 rounded-full bg-teal-400/25"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.2, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-28 w-28 rounded-full bg-orange-300/20"
        animate={{ scale: [1.08, 1, 1.08] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-xl shadow-teal-900/25 ring-4 ring-white"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <IconHeadset className="h-14 w-14 text-white drop-shadow-sm" />
      </motion.div>
    </div>
  )
}

export function FloatingSupport() {
  const { lang, t } = useLanguage()
  const { registerOpen } = useSupportOpener()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{ id: `welcome-${lang}`, role: 'assistant', text: t.support.botWelcome }])
    setSendError(null)
  }, [lang, t])

  useEffect(() => {
    const openPanel = () => {
      setOpen(true)
    }
    registerOpen(openPanel)
    return () => registerOpen(null)
  }, [registerOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending, open])

  const hasUserMessages = messages.some((m) => m.role === 'user')

  const resetChat = () => {
    setMessages([{ id: `welcome-${lang}-${Date.now()}`, role: 'assistant', text: t.support.botWelcome }])
    setSendError(null)
    setInput('')
  }

  const send = async (presetText?: string) => {
    const trimmed = (presetText ?? input).trim()
    if (!trimmed || sending) return
    if (!presetText) setInput('')
    setSendError(null)

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    const nextThread = [...messages, userMsg]
    setMessages(nextThread)
    setSending(true)

    try {
      const { data } = await api.post<{ data: { message: string } }>('/api/support/chat', {
        messages: toApiMessages(nextThread),
      })
      const reply = data?.data?.message?.trim()
      if (!reply) {
        setSendError(t.support.aiError)
        return
      }
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: reply }])
    } catch (err) {
      const msg = getApiErrorMessage(err)
      if (msg.includes('GROQ_API_KEY') || msg.includes('not configured')) {
        setSendError(t.support.aiUnavailable)
      } else {
        setSendError(msg || t.support.aiError)
      }
    } finally {
      setSending(false)
    }
  }

  const suggestions = t.support.chatSuggestions

  const suggestionPills = (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          onClick={() => void send(text)}
          disabled={sending}
          className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-left text-xs font-medium leading-snug text-stone-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/60 disabled:opacity-50"
        >
          {text}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <motion.button
        type="button"
        layout
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-xl shadow-teal-900/35 ring-4 ring-orange-100/90 sm:bottom-8 sm:right-8"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t.support.open}
        title={t.support.open}
      >
        <IconHeadset className="h-7 w-7" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-stone-900/35 backdrop-blur-[2px]"
              aria-label={t.nav.closeMenu}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="support-title"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="fixed bottom-20 right-4 z-50 flex max-h-[min(620px,calc(100dvh-5.5rem))] w-[min(100vw-1.5rem,400px)] flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-white shadow-2xl shadow-stone-900/15 sm:right-8"
            >
              {/* Header — reference-style */}
              <header className="flex shrink-0 items-center gap-2 border-b border-stone-100 bg-white px-2 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                  aria-label={t.support.closePanel}
                  title={t.support.closePanel}
                >
                  <IconChevronLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-lg font-bold tracking-tight text-stone-900" aria-hidden>
                      ✶
                    </span>
                    <h2 id="support-title" className="truncate text-sm font-bold text-stone-900">
                      {t.brand}
                    </h2>
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-teal-700">
                    {t.support.aiTab}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetChat}
                  className="flex items-center gap-1 rounded-xl px-2 py-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                  aria-label={`${t.support.clearChat}. ${t.support.clearChatDetail}`}
                  title={`${t.support.clearChat}. ${t.support.clearChatDetail}`}
                >
                  <IconTrash className="h-5 w-5 shrink-0" />
                  <span className="max-w-[3.25rem] text-[10px] font-bold leading-tight text-stone-600 sm:max-w-none">
                    {t.support.clearChatShort}
                  </span>
                </button>
              </header>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-stone-50/80">
                {/* Former pill style; sticky only after user starts chatting */}
                {hasUserMessages ? (
                  <div className="shrink-0 border-b border-orange-50/90 bg-white px-5 pb-4 pt-4">
                    <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {t.support.title}
                    </p>
                    {suggestionPills}
                  </div>
                ) : null}

                <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
                  {!hasUserMessages ? (
                    <div className="flex flex-col items-center px-5 pb-4 pt-6">
                      <SupportMascot />
                      <p className="mt-5 max-w-[280px] text-center text-[15px] font-semibold leading-snug text-stone-800">
                        {t.support.chatWelcomeTitle}
                      </p>
                      <p className="mt-2 max-w-[300px] text-center text-xs leading-relaxed text-stone-500">
                        {t.support.aiHint}
                      </p>
                      <div className="mt-6 w-full max-w-[360px]">
                        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                          {t.support.title}
                        </p>
                        {suggestionPills}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 px-4 py-4">
                      {sendError ? (
                        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                          {sendError}
                        </p>
                      ) : null}
                      {messages.map((m, i) => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[90%] rounded-[1.25rem] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                              m.role === 'user'
                                ? 'rounded-br-md bg-teal-600 text-white'
                                : 'rounded-bl-md border border-stone-100 bg-white text-stone-800'
                            }`}
                          >
                            {m.role === 'assistant' && (
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-teal-700">
                                {t.support.botName}
                              </p>
                            )}
                            {m.text}
                          </div>
                        </motion.div>
                      ))}
                      <AnimatePresence>
                        {sending ? (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                          >
                            <TypingDots />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer hint */}
              <div className="shrink-0 border-t border-stone-100 bg-white px-4 py-2 text-center">
                <p className="text-[10px] text-stone-400">
                  <span className="font-semibold text-stone-500">{t.support.liveTab}</span>
                  {' · '}
                  {t.support.comingSoon}
                </p>
              </div>

              {/* Pill input + send */}
              <div className="shrink-0 border-t border-stone-100 bg-white p-3 pt-2">
                <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 py-1 pl-4 pr-1 shadow-inner transition focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/20">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void send()
                    }}
                    disabled={sending}
                    placeholder={t.support.aiPlaceholder}
                    className="min-h-[44px] min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 disabled:opacity-60"
                  />
                  <motion.button
                    type="button"
                    disabled={sending || !input.trim()}
                    onClick={() => void send()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-md shadow-teal-900/20 transition enabled:hover:bg-teal-700 disabled:opacity-40"
                    aria-label={t.support.send}
                  >
                    <IconSend className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
