/**
 * Date grouping utility for the sidebar note list.
 *
 * Groups notes by creation date into: Today, Yesterday, This Week, Older.
 * Notes within each group are sorted by updatedAt descending.
 */

import type { Note } from '@/types/note'

export type DateGroup = 'Today' | 'Yesterday' | 'This Week' | 'Older'

const GROUP_ORDER: DateGroup[] = ['Today', 'Yesterday', 'This Week', 'Older']

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getDateGroup(timestamp: number): DateGroup {
  const now = new Date()
  const date = new Date(timestamp)

  if (isSameDay(now, date)) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(yesterday, date)) return 'Yesterday'

  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  if (date >= weekAgo) return 'This Week'

  return 'Older'
}

export type GroupedNotes = { group: DateGroup; notes: Note[] }

/**
 * Group notes by `createdAt` date bucket.
 * Notes within each group are sorted by `updatedAt` descending.
 * Empty groups are omitted.
 */
export function groupNotesByDate(notes: Note[]): GroupedNotes[] {
  // Sort all notes by updatedAt desc (most recently updated first)
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt)

  // Bucket by createdAt
  const buckets = new Map<DateGroup, Note[]>()
  for (const note of sorted) {
    const group = getDateGroup(note.createdAt)
    const list = buckets.get(group)
    if (list) {
      list.push(note)
    } else {
      buckets.set(group, [note])
    }
  }

  // Return in canonical order, omitting empty groups
  return GROUP_ORDER
    .filter((g) => buckets.has(g))
    .map((g) => ({ group: g, notes: buckets.get(g)! }))
}
