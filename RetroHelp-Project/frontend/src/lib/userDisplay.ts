import { ROLE } from '../constants/roles'
import type { SafeUser } from '../types/auth'

/** Primary label for UI (navbar, tooltips). */
export function getUserDisplayName(user: SafeUser | null): string {
  if (!user) return ''
  if (user.role_id === ROLE.communityMember) {
    return (user.nickname ?? '').trim() || '—'
  }
  return (user.full_name ?? user.nickname ?? '').trim() || '—'
}

/** Two characters for avatar chip (supports Burmese / no forced Latin uppercasing). */
export function getUserAvatarInitials(user: SafeUser | null): string {
  if (!user) return '?'
  const name = getUserDisplayName(user).trim()
  if (!name || name === '—') return '?'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? ''
    const b = parts[parts.length - 1]?.[0] ?? ''
    const pair = (a + b).trim()
    return pair.length > 0 ? pair.slice(0, 2) : name.slice(0, 2)
  }
  if (name.length >= 2) return name.slice(0, 2)
  return name + name
}
