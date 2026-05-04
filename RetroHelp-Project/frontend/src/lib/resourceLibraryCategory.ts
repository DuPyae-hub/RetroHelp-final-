import type { ResourceLibraryItem } from '../types/api'

/** Canonical buckets used by the UI (phpMyAdmin values may differ in case/spacing). */
export type LibraryCategoryBucket = 'basics' | 'care' | 'other'

export function libraryCategoryBucket(
  category: string | null | undefined,
): LibraryCategoryBucket {
  const c = (category ?? '').trim().toLowerCase()
  if (c === 'basics' || c === 'basic') return 'basics'
  if (c === 'care') return 'care'
  return 'other'
}

export function partitionResourceLibrary(items: ResourceLibraryItem[]): {
  basics: ResourceLibraryItem[]
  care: ResourceLibraryItem[]
  other: ResourceLibraryItem[]
} {
  const basics: ResourceLibraryItem[] = []
  const care: ResourceLibraryItem[] = []
  const other: ResourceLibraryItem[] = []
  for (const item of items) {
    const b = libraryCategoryBucket(item.category)
    if (b === 'basics') basics.push(item)
    else if (b === 'care') care.push(item)
    else other.push(item)
  }
  return { basics, care, other }
}
