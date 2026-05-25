/** Fired after a patient submits a clinic review so Home can refetch recent reviews. */
export const RECENT_REVIEWS_EVENT = 'retrohelp:recent-reviews-updated'

export function notifyRecentReviewsUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(RECENT_REVIEWS_EVENT))
  }
}
