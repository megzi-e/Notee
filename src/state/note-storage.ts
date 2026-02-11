/**
 * localStorage persistence layer.
 *
 * Stores notes keyed under a single JSON blob so reads and writes are atomic.
 * All functions are pure wrappers around localStorage — no in-memory cache.
 */

import type { Note } from '@/types/note'

const STORAGE_KEY = 'notes-app:notes'

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Load all notes from localStorage. Returns [] if nothing is stored. */
export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Note[]
  } catch {
    return []
  }
}

/** Load a single note by id.  Returns undefined if not found. */
export function loadNote(id: string): Note | undefined {
  return loadNotes().find((n) => n.id === id)
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Persist the full notes array (replaces whatever was stored). */
export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

/** Persist a single note (upsert — insert or update in place). */
export function saveNote(note: Note): void {
  const notes = loadNotes()
  const idx = notes.findIndex((n) => n.id === note.id)
  if (idx >= 0) {
    notes[idx] = note
  } else {
    notes.push(note)
  }
  saveNotes(notes)
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/** Remove a note by id.  No-op if the id doesn't exist. */
export function deleteNoteFromStorage(id: string): void {
  saveNotes(loadNotes().filter((n) => n.id !== id))
}
