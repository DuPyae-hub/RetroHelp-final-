import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

type Tab = 'ai' | 'live'

type ChatMessage = { id: string; role: 'user' | 'bot'; text: string }

export function FloatingSupport() {
  const { lang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('ai')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    setMessages([
      { id: `welcome-${lang}`, role: 'bot', text: t.support.botWelcome },
    ])
  }, [lang, t])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed },
    ])
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: t.support.botReply,
        },
      ])
    }, 600)
  }

  return (
    <>
      <motion.button
        type="button"
        layout
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-900/30 ring-4 ring-orange-100/90 sm:bottom-8 sm:right-8"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="text-lg" aria-hidden>
          ✶
        </span>
        {t.support.open}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-stone-900"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="support-title"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed bottom-24 right-4 z-50 flex max-h-[min(560px,calc(100dvh-7rem))] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-3xl border border-orange-100/90 bg-white shadow-2xl shadow-teal-900/15 sm:right-8"
            >
              <div className="flex items-center justify-between border-b border-orange-50 bg-gradient-to-r from-orange-50 to-teal-50/60 px-4 py-3">
                <h2
                  id="support-title"
                  className="text-base font-bold text-stone-900"
                >
                  {t.support.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl p-2 text-stone-500 transition hover:bg-white/80 hover:text-stone-800"
                  aria-label={t.nav.closeMenu}
                >
                  ✕
                </button>
              </div>

              <div className="flex border-b border-orange-50 px-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTab('ai')}
                  className={`flex-1 rounded-t-2xl px-3 py-2.5 text-sm font-semibold transition ${
                    tab === 'ai'
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t.support.aiTab}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('live')}
                  className={`relative flex-1 rounded-t-2xl px-3 py-2.5 text-sm font-semibold transition ${
                    tab === 'live'
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t.support.liveTab}
                  <span className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                    {t.support.comingSoon}
                  </span>
                </button>
              </div>

              {tab === 'live' ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-10 text-center">
                  <div className="rounded-3xl bg-orange-50 px-4 py-3 text-4xl" aria-hidden>
                    💬
                  </div>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {t.support.liveHint}
                  </p>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                  <p className="border-b border-orange-50 px-4 py-2 text-xs leading-relaxed text-stone-500">
                    {t.support.aiHint}
                  </p>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
                    {messages.map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-3xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-teal-600 text-white'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {m.role === 'bot' && (
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-teal-700/90">
                              {t.support.botName}
                            </p>
                          )}
                          {m.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2 border-t border-orange-50 p-3">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && send()}
                      placeholder={t.support.aiPlaceholder}
                      className="min-w-0 flex-1 rounded-2xl border border-orange-100 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none ring-teal-500/30 placeholder:text-stone-400 focus:ring-2"
                    />
                    <button
                      type="button"
                      onClick={send}
                      className="shrink-0 rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-700"
                    >
                      {t.support.send}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
