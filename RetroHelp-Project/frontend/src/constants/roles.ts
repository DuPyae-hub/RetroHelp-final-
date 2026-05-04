export const ROLE = {
  communityMember: 1,
  clinicStaff: 2,
  admin: 3,
} as const

export function isCommunityMember(roleId: number | undefined): boolean {
  return roleId === ROLE.communityMember
}

export function isStaffOrAdmin(roleId: number | undefined): boolean {
  return roleId === ROLE.clinicStaff || roleId === ROLE.admin
}

export function isAdmin(roleId: number | undefined): boolean {
  return roleId === ROLE.admin
}
