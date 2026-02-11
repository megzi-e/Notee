/**
 * One-way migration helper: legacy Block[] → TipTap-compatible HTML.
 *
 * Used once per note when `note.body` is empty but `note.blocks` has
 * content (i.e. notes created before the TipTap migration).
 */

import type { Block, TextSpan } from '@/types/note'

// ---------------------------------------------------------------------------
// Escape HTML entities
// ---------------------------------------------------------------------------

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---------------------------------------------------------------------------
// Spans → inline HTML
// ---------------------------------------------------------------------------

function spansToHtml(spans: TextSpan[]): string {
  return spans
    .map((s) => {
      let html = esc(s.text)
      if (!html) return ''
      if (s.bold) html = `<strong>${html}</strong>`
      if (s.italic) html = `<em>${html}</em>`
      if (s.underline) html = `<u>${html}</u>`
      return html
    })
    .join('')
}

// ---------------------------------------------------------------------------
// Block → HTML
// ---------------------------------------------------------------------------

function blockToHtml(block: Block): string {
  switch (block.type) {
    case 'paragraph':
      return `<p>${spansToHtml(block.content) || ''}</p>`

    case 'heading':
      return `<h${block.level}>${spansToHtml(block.content) || ''}</h${block.level}>`

    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul'
      const items = block.items
        .map((spans) => `<li><p>${spansToHtml(spans) || ''}</p></li>`)
        .join('')
      return `<${tag}>${items}</${tag}>`
    }

    case 'checklist': {
      const items = block.items
        .map((item) => {
          const checked = item.checked ? 'true' : 'false'
          return `<li data-type="taskItem" data-checked="${checked}"><label><input type="checkbox"${item.checked ? ' checked="checked"' : ''}><span></span></label><div><p>${spansToHtml(item.content) || ''}</p></div></li>`
        })
        .join('')
      return `<ul data-type="taskList">${items}</ul>`
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a legacy Block[] array into TipTap-compatible HTML.
 *
 * Returns `'<p></p>'` when blocks are empty or contain only a single
 * blank paragraph (so the editor always has valid content).
 */
export function blocksToHtml(blocks: Block[]): string {
  if (!blocks.length) return '<p></p>'

  const html = blocks.map(blockToHtml).join('')
  return html || '<p></p>'
}
