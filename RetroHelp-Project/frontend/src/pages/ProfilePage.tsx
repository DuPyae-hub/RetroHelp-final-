import { motion } from 'framer-motion'
import { useState } from 'react'
import { getApiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { isCommunityMember, isStaffOrAdmin } from '../constants/roles'
import { useLanguage } from '../i18n/LanguageContext'

export function ProfilePage() {
  const { t } = useLanguage()
  const {
    user,
    loading,
    loginCommunityMember,
    loginStaff,
    logout,
    updateNickname,
  } = useAuth()
  const [tab, setTab] = useState<'community' | 'staff'>('community')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [editNickname, setEditNickname] = useState('')
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  const onCommunityLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError(null)
    try {
      await loginCommunityMember(nickname.trim(), password)
      setPassword('')
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const onStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError(null)
    try {
      await loginStaff(fullName.trim(), staffPassword)
      setStaffPassword('')
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const onLogout = async () => {
    setBusy(true)
    setFormError(null)
    try {
      await logout()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const onSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isCommunityMember(user.role_id)) return
    setBusy(true)
    setProfileMsg(null)
    setFormError(null)
    try {
      const next = (editNickname || user.nickname || '').trim()
      await updateNickname(next)
      setEditNickname('')
      setProfileMsg(t.profile.nicknameSaved)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-stone-600">
        …
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {t.profile.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">
          {t.profile.description}
        </p>
        <p className="mt-3 rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-xs leading-relaxed text-teal-900">
          {t.profile.privacyNote}
        </p>

        {formError && (
          <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {formError}
          </p>
        )}

        {user ? (
          <div className="mt-8 space-y-6 rounded-3xl border border-orange-100/90 bg-white p-8 shadow-xl shadow-teal-900/5">
            <p className="text-sm text-stone-700">
              <span className="font-semibold text-stone-900">
                {t.profile.loggedInAs}
              </span>
              {isCommunityMember(user.role_id) && (
                <>
                  :{' '}
                  <span className="font-mono text-teal-800">
                    {user.nickname ?? '—'}
                  </span>
                </>
              )}
              {isStaffOrAdmin(user.role_id) && (
                <>
                  : <span className="text-stone-800">{user.full_name}</span>
                </>
              )}
            </p>

            {isCommunityMember(user.role_id) && (
              <form onSubmit={onSaveNickname} className="space-y-3">
                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.nicknameLabel}
                  <input
                    required
                    minLength={2}
                    maxLength={255}
                    value={editNickname || user.nickname || ''}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 font-mono text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="username"
                  />
                </label>
                <p className="text-xs text-stone-500">{t.profile.nicknameHelp}</p>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy ? t.profile.saving : t.profile.saveNickname}
                </button>
                {profileMsg && (
                  <p className="text-center text-sm text-teal-800">{profileMsg}</p>
                )}
              </form>
            )}

            <button
              type="button"
              disabled={busy}
              onClick={() => void onLogout()}
              className="w-full rounded-2xl border border-stone-200 py-3 text-sm font-semibold text-stone-800 disabled:opacity-60"
            >
              {t.profile.logout}
            </button>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-orange-100/90 bg-white p-6 shadow-xl shadow-teal-900/5 sm:p-8">
            <div className="flex gap-2 rounded-2xl bg-orange-50/80 p-1">
              <button
                type="button"
                onClick={() => {
                  setTab('community')
                  setFormError(null)
                }}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                  tab === 'community'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                {t.profile.loginCommunity}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('staff')
                  setFormError(null)
                }}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                  tab === 'staff'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                {t.profile.loginStaff}
              </button>
            </div>

            {tab === 'community' ? (
              <form onSubmit={onCommunityLogin} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.nicknameLabel}
                  <input
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 font-mono text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="username"
                  />
                </label>
                <p className="text-xs text-stone-500">{t.profile.nicknameHelp}</p>
                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.passwordLabel}
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="current-password"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
                >
                  {t.profile.loginCommunity}
                </button>
              </form>
            ) : (
              <form onSubmit={onStaffLogin} className="mt-6 space-y-4">
                <p className="text-xs text-stone-500">{t.profile.staffHint}</p>
                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.fullNameLabel}
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="name"
                  />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.passwordLabel}
                  <input
                    required
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="current-password"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
                >
                  {t.profile.loginStaff}
                </button>
              </form>
            )}
          </div>
        )}

        {!user && (
          <p className="mt-8 text-center text-xs text-stone-500">
            {t.profile.cardTitle} · {t.profile.cardBody}
          </p>
        )}
      </motion.div>
    </div>
  )
}
