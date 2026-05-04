import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { isCommunityMember, isStaffOrAdmin } from '../constants/roles'
import { useLanguage } from '../i18n/LanguageContext'
import { PatientRecordsPanel } from '../components/PatientRecordsPanel'
import type { ArtCenterSearchItem } from '../types/api'

type GuestTab = 'signin' | 'register' | 'staff'

export function ProfilePage() {
  const { t } = useLanguage()
  const {
    user,
    loading,
    register,
    loginCommunityMember,
    loginStaff,
    logout,
    updateNickname,
  } = useAuth()
  const [tab, setTab] = useState<GuestTab>('signin')
  const [registerKind, setRegisterKind] = useState<'patient' | 'clinic_staff'>(
    'patient',
  )
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [regNickname, setRegNickname] = useState('')
  const [regFullName, setRegFullName] = useState('')
  const [regStaffNickname, setRegStaffNickname] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPassword2, setRegPassword2] = useState('')
  const [staffRegisterNotice, setStaffRegisterNotice] = useState(false)
  const [fullName, setFullName] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [editNickname, setEditNickname] = useState('')
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [centerOptions, setCenterOptions] = useState<ArtCenterSearchItem[]>([])
  const [regArtCenterId, setRegArtCenterId] = useState('')
  const [registerNewClinic, setRegisterNewClinic] = useState(false)
  const [ncName, setNcName] = useState('')
  const [ncTownship, setNcTownship] = useState('')
  const [ncArea, setNcArea] = useState('')
  const [ncContact, setNcContact] = useState('')
  const [ncImage, setNcImage] = useState('')
  const [ncLat, setNcLat] = useState('')
  const [ncLng, setNcLng] = useState('')
  const [staffLoginCenterId, setStaffLoginCenterId] = useState('')
  const [adminSignIn, setAdminSignIn] = useState(false)

  useEffect(() => {
    if (registerKind !== 'clinic_staff' && tab !== 'staff') {
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<{ data: ArtCenterSearchItem[] }>(
          '/api/art-centers/search?limit=300',
        )
        if (!cancelled) {
          setCenterOptions(data.data)
        }
      } catch {
        if (!cancelled) {
          setCenterOptions([])
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [registerKind, tab])

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

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError(null)
    setStaffRegisterNotice(false)
    try {
      if (registerKind === 'patient') {
        await register({
          accountType: 'patient',
          nickname: regNickname.trim(),
          password: regPassword,
          passwordConfirmation: regPassword2,
        })
        setRegPassword('')
        setRegPassword2('')
      } else {
        if (!registerNewClinic) {
          const id = Number.parseInt(regArtCenterId, 10)
          if (!Number.isFinite(id) || id < 1) {
            setFormError(t.profile.staffClinicRequired)
            return
          }
        } else {
          if (
            !ncName.trim() ||
            !ncTownship.trim() ||
            !ncArea.trim() ||
            !ncContact.trim()
          ) {
            setFormError(t.profile.staffClinicRequired)
            return
          }
        }
        await register({
          accountType: 'clinic_staff',
          fullName: regFullName.trim(),
          nickname: regStaffNickname.trim() || undefined,
          password: regPassword,
          passwordConfirmation: regPassword2,
          artCenterId:
            !registerNewClinic && regArtCenterId
              ? Number.parseInt(regArtCenterId, 10)
              : undefined,
          newCenter: registerNewClinic
            ? {
                name: ncName.trim(),
                township: ncTownship.trim(),
                area: ncArea.trim(),
                contactNo: ncContact.trim(),
                image: ncImage.trim() || undefined,
                latitude: ncLat.trim() || undefined,
                longitude: ncLng.trim() || undefined,
              }
            : undefined,
        })
        setRegFullName('')
        setRegStaffNickname('')
        setRegPassword('')
        setRegPassword2('')
        setRegArtCenterId('')
        setRegisterNewClinic(false)
        setNcName('')
        setNcTownship('')
        setNcArea('')
        setNcContact('')
        setNcImage('')
        setNcLat('')
        setNcLng('')
        setStaffRegisterNotice(true)
      }
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
      let centerId: number | null = null
      if (!adminSignIn) {
        const cid = Number.parseInt(staffLoginCenterId, 10)
        if (!Number.isFinite(cid) || cid < 1) {
          setFormError(t.profile.staffClinicRequired)
          return
        }
        centerId = cid
      }
      await loginStaff(fullName.trim(), staffPassword, centerId, adminSignIn)
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

  const switchTab = (next: GuestTab) => {
    setTab(next)
    setFormError(null)
    setStaffRegisterNotice(false)
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
        className="mx-auto max-w-3xl"
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
          <>
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
            {isStaffOrAdmin(user.role_id) && user.art_center && (
              <p className="text-xs text-stone-600">
                <span className="font-semibold text-stone-800">
                  {t.profile.loggedInClinic}:
                </span>{' '}
                {user.art_center.name}
                {user.art_center.nickname
                  ? ` (${user.art_center.nickname})`
                  : ''}
              </p>
            )}

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
          {isCommunityMember(user.role_id) ? <PatientRecordsPanel /> : null}
          </>
        ) : (
          <div className="mt-8 rounded-3xl border border-orange-100/90 bg-white p-6 shadow-xl shadow-teal-900/5 sm:p-8">
            <div className="flex flex-wrap gap-2 rounded-2xl bg-orange-50/80 p-1">
              <button
                type="button"
                onClick={() => switchTab('signin')}
                className={`min-w-[5.5rem] flex-1 rounded-xl py-2 text-center text-xs font-semibold sm:text-sm ${
                  tab === 'signin'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                {t.profile.tabSignIn}
              </button>
              <button
                type="button"
                onClick={() => switchTab('register')}
                className={`min-w-[5.5rem] flex-1 rounded-xl py-2 text-center text-xs font-semibold sm:text-sm ${
                  tab === 'register'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                {t.profile.tabRegister}
              </button>
              <button
                type="button"
                onClick={() => switchTab('staff')}
                className={`min-w-[5.5rem] flex-1 rounded-xl py-2 text-center text-xs font-semibold sm:text-sm ${
                  tab === 'staff'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                {t.profile.tabStaff}
              </button>
            </div>

            {tab === 'signin' && (
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
            )}

            {tab === 'register' && (
              <form onSubmit={onRegister} className="mt-6 space-y-4">
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-stone-800">
                    {t.profile.registerAccountType}
                  </legend>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm has-[:checked]:border-teal-400 has-[:checked]:bg-teal-50/80">
                      <input
                        type="radio"
                        name="registerKind"
                        checked={registerKind === 'patient'}
                        onChange={() => {
                          setRegisterKind('patient')
                          setStaffRegisterNotice(false)
                        }}
                        className="text-teal-600"
                      />
                      {t.profile.registerAsPatient}
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm has-[:checked]:border-teal-400 has-[:checked]:bg-teal-50/80">
                      <input
                        type="radio"
                        name="registerKind"
                        checked={registerKind === 'clinic_staff'}
                        onChange={() => {
                          setRegisterKind('clinic_staff')
                          setStaffRegisterNotice(false)
                        }}
                        className="text-teal-600"
                      />
                      {t.profile.registerAsStaff}
                    </label>
                  </div>
                </fieldset>

                {registerKind === 'patient' ? (
                  <p className="text-sm leading-relaxed text-stone-600">
                    {t.profile.registerIntro}
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-stone-600">
                    {t.profile.staffRegisterIntro}
                  </p>
                )}

                {staffRegisterNotice && (
                  <p className="rounded-2xl border border-teal-200 bg-teal-50/90 px-4 py-3 text-sm text-teal-900">
                    {t.profile.staffPendingBanner}
                  </p>
                )}

                {registerKind === 'patient' ? (
                  <>
                    <label className="block text-sm font-medium text-stone-700">
                      {t.profile.nicknameLabel}
                      <input
                        required
                        minLength={2}
                        maxLength={255}
                        value={regNickname}
                        onChange={(e) => setRegNickname(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 font-mono text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                        autoComplete="username"
                      />
                    </label>
                    <p className="text-xs text-stone-500">{t.profile.nicknameHelp}</p>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-stone-700">
                      {t.profile.fullNameLabel}
                      <input
                        required
                        minLength={2}
                        maxLength={255}
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                        autoComplete="name"
                      />
                    </label>
                    <label className="block text-sm font-medium text-stone-700">
                      {t.profile.staffOptionalNickname}
                      <input
                        maxLength={255}
                        value={regStaffNickname}
                        onChange={(e) => setRegStaffNickname(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 font-mono text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                        autoComplete="off"
                      />
                    </label>
                    <p className="text-xs text-stone-500">
                      {t.profile.staffOptionalNicknameHelp}
                    </p>
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={registerNewClinic}
                        onChange={(e) => {
                          setRegisterNewClinic(e.target.checked)
                          if (e.target.checked) {
                            setRegArtCenterId('')
                          }
                        }}
                        className="mt-1 text-teal-600"
                      />
                      <span>{t.profile.staffRegisterNewListing}</span>
                    </label>
                    {!registerNewClinic ? (
                      <label className="block text-sm font-medium text-stone-700">
                        {t.profile.staffClinicSelectLabel}
                        <select
                          required={!registerNewClinic}
                          value={regArtCenterId}
                          onChange={(e) => setRegArtCenterId(e.target.value)}
                          className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                        >
                          <option value="">{t.profile.staffClinicSelectPh}</option>
                          {centerOptions.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                              {c.name}
                              {c.nickname ? ` · ${c.nickname}` : ''}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <div className="space-y-3 rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
                        <p className="text-xs leading-relaxed text-teal-950">
                          {t.profile.staffNewCenterIntro}
                        </p>
                        <label className="block text-sm font-medium text-stone-800">
                          {t.profile.newCenterName}
                          <input
                            required
                            value={ncName}
                            onChange={(e) => setNcName(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                          />
                        </label>
                        <label className="block text-sm font-medium text-stone-800">
                          {t.profile.newCenterTownship}
                          <input
                            required
                            value={ncTownship}
                            onChange={(e) => setNcTownship(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                          />
                        </label>
                        <label className="block text-sm font-medium text-stone-800">
                          {t.profile.newCenterArea}
                          <input
                            required
                            value={ncArea}
                            onChange={(e) => setNcArea(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                          />
                        </label>
                        <label className="block text-sm font-medium text-stone-800">
                          {t.profile.newCenterContact}
                          <input
                            required
                            value={ncContact}
                            onChange={(e) => setNcContact(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                          />
                        </label>
                        <label className="block text-sm font-medium text-stone-800">
                          {t.profile.newCenterImageOptional}
                          <input
                            value={ncImage}
                            onChange={(e) => setNcImage(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-sm font-medium text-stone-800">
                            {t.profile.newCenterLatOptional}
                            <input
                              value={ncLat}
                              onChange={(e) => setNcLat(e.target.value)}
                              className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                            />
                          </label>
                          <label className="block text-sm font-medium text-stone-800">
                            {t.profile.newCenterLngOptional}
                            <input
                              value={ncLng}
                              onChange={(e) => setNcLng(e.target.value)}
                              className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.passwordLabel}
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="new-password"
                  />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  {t.profile.passwordConfirm}
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={regPassword2}
                    onChange={(e) => setRegPassword2(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="new-password"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
                >
                  {t.profile.registerSubmit}
                </button>
              </form>
            )}

            {tab === 'staff' && (
              <form onSubmit={onStaffLogin} className="mt-6 space-y-4">
                <p className="text-xs text-stone-500">{t.profile.staffHint}</p>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={adminSignIn}
                    onChange={(e) => {
                      setAdminSignIn(e.target.checked)
                      setFormError(null)
                    }}
                    className="mt-1 h-4 w-4 rounded border-orange-300 text-teal-700 focus:ring-teal-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-stone-900">
                      {t.profile.adminSignInToggle}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-stone-600">
                      {t.profile.adminSignInHelp}
                    </span>
                  </span>
                </label>
                {!adminSignIn ? (
                  <label className="block text-sm font-medium text-stone-700">
                    {t.profile.staffLoginClinicLabel}
                    <select
                      required
                      value={staffLoginCenterId}
                      onChange={(e) => setStaffLoginCenterId(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    >
                      <option value="">{t.profile.staffLoginClinicPh}</option>
                      {centerOptions.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name}
                          {c.nickname ? ` · ${c.nickname}` : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                {adminSignIn ? (
                  <div className="rounded-2xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-xs leading-relaxed text-teal-950">
                    <p className="font-semibold text-teal-900">{t.profile.adminCalloutTitle}</p>
                    <p className="mt-1 text-teal-900/95">{t.profile.adminCalloutBody}</p>
                  </div>
                ) : null}
                <label className="block text-sm font-medium text-stone-700">
                  {adminSignIn ? t.profile.adminFullNameLabel : t.profile.fullNameLabel}
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="name"
                    placeholder={adminSignIn ? t.profile.adminFullNamePlaceholder : undefined}
                  />
                  {adminSignIn ? (
                    <span className="mt-1 block text-xs text-stone-500">
                      {t.profile.adminFullNameHint}
                    </span>
                  ) : null}
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  {adminSignIn ? t.profile.adminPasswordLabel : t.profile.passwordLabel}
                  <input
                    required
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-orange-100 px-4 py-3 text-stone-900 outline-none ring-teal-500/25 focus:ring-2"
                    autoComplete="current-password"
                  />
                  {adminSignIn ? (
                    <span className="mt-1 block text-xs text-stone-500">
                      {t.profile.adminPasswordHint}
                    </span>
                  ) : null}
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className={`w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60 ${
                    adminSignIn
                      ? 'bg-gradient-to-r from-stone-700 to-stone-900'
                      : 'bg-gradient-to-r from-teal-600 to-teal-700'
                  }`}
                >
                  {adminSignIn ? t.profile.loginAdmin : t.profile.loginStaff}
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
