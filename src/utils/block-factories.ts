/**
 * Pure factory functions for creating new blocks and notes.
 * Every factory returns a fully initialised, serialisable object.
 */

import type {
  Block,
  ChecklistBlock,
  ChecklistItem,
  HeadingBlock,
  ListBlock,
  Note,
  ParagraphBlock,
  TextSpan,
} from '@/types/note'
import { generateId } from './id'

// ---------------------------------------------------------------------------
// TextSpan helpers
// ---------------------------------------------------------------------------

/** Create a plain (unstyled) text span. */
export function plainSpan(text: string): TextSpan {
  return { text }
}

/** Returns an empty content array (one empty span) — the "blank line". */
export function emptyContent(): TextSpan[] {
  return [plainSpan('')]
}

// ---------------------------------------------------------------------------
// Block factories
// ---------------------------------------------------------------------------

export function createParagraphBlock(
  content: TextSpan[] = emptyContent(),
): ParagraphBlock {
  return { id: generateId(), type: 'paragraph', content }
}

export function createHeadingBlock(
  level: 1 | 2 | 3,
  content: TextSpan[] = emptyContent(),
): HeadingBlock {
  return { id: generateId(), type: 'heading', level, content }
}

export function createListBlock(
  ordered: boolean,
  items: TextSpan[][] = [emptyContent()],
): ListBlock {
  return { id: generateId(), type: 'list', ordered, items }
}

export function createChecklistItem(
  content: TextSpan[] = emptyContent(),
  checked = false,
): ChecklistItem {
  return { id: generateId(), checked, content }
}

export function createChecklistBlock(
  items?: ChecklistItem[],
): ChecklistBlock {
  return {
    id: generateId(),
    type: 'checklist',
    items: items ?? [createChecklistItem()],
  }
}

// ---------------------------------------------------------------------------
// Note factory
// ---------------------------------------------------------------------------

export function createNote(title = '', blocks?: Block[]): Note {
  const now = Date.now()
  return {
    id: generateId(),
    title,
    body: '<p></p>',
    blocks: blocks ?? [createParagraphBlock()],
    createdAt: now,
    updatedAt: now,
  }
}
