import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { IconTitleCase } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconTitleCase'
import { IconH1 } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconH1'
import { IconH2 } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconH2'
import { IconH3 } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconH3'
import { IconBold } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconBold'
import { IconItalic } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconItalic'
import { IconUnderline } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconUnderline'
import { IconBulletList } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconBulletList'
import { IconNumberedList } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconNumberedList'
import { IconPlanning } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconPlanning'
import styles from './RichTextToolbar.module.css'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'checklist'

export type InlineFormat = 'bold' | 'italic' | 'underline'

export interface RichTextToolbarProps {
  /** The block type of the currently focused block */
  activeBlockType?: BlockType
  /** Set of active inline formats at the current cursor position */
  activeInlineFormats?: Set<InlineFormat>
  /** Called when the user selects a block type (heading picker or list toggles) */
  onBlockTypeChange?: (type: BlockType) => void
  /** Called when the user toggles an inline format */
  onInlineFormatToggle?: (format: InlineFormat) => void
}

// ---------------------------------------------------------------------------
// Heading picker options
// ---------------------------------------------------------------------------

type HeadingOption = {
  type: BlockType
  label: string
  icon: ReactNode
}

const headingOptions: HeadingOption[] = [
  { type: 'paragraph', label: 'Normal Text', icon: <IconTitleCase size={24} /> },
  { type: 'heading1', label: 'Large header', icon: <IconH1 size={24} /> },
  { type: 'heading2', label: 'Medium Header', icon: <IconH2 size={24} /> },
  { type: 'heading3', label: 'Small Header', icon: <IconH3 size={24} /> },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RichTextToolbar({
  activeBlockType = 'paragraph',
  activeInlineFormats = new Set(),
  onBlockTypeChange,
  onInlineFormatToggle,
}: RichTextToolbarProps) {
  const [headingOpen, setHeadingOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close heading picker on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setHeadingOpen(false)
    }
  }, [])

  useEffect(() => {
    if (!headingOpen) return
    document.addEventListener('mousedown', handleClickOutside as unknown as EventListener)
    return () => document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener)
  }, [headingOpen, handleClickOutside])

  const handleHeadingSelect = (type: BlockType) => {
    onBlockTypeChange?.(type)
    setHeadingOpen(false)
  }

  // In TipTap, inline marks (bold/italic/underline) work on ALL block
  // types — paragraphs, headings, and text inside list items.
  const _isTextBlock = true

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatting toolbar">
      {/* ── Heading picker (Aa) ── */}
      <div className={styles.headingPicker} ref={pickerRef}>
        <button
          className={[
            styles.formatBtn,
            headingOpen ? styles.formatBtnActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setHeadingOpen((prev) => !prev)}
          aria-label="Text style"
          aria-expanded={headingOpen}
          aria-haspopup="listbox"
        >
          <IconTitleCase size={24} />
        </button>

        {headingOpen && (
          <div className={styles.headingDropdown} role="listbox">
            {headingOptions.map((opt) => (
              <button
                key={opt.type}
                className={[
                  styles.headingItem,
                  activeBlockType === opt.type ? styles.headingItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="option"
                aria-selected={activeBlockType === opt.type}
                onClick={() => handleHeadingSelect(opt.type)}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Bold ── */}
      <button
        className={[
          styles.formatBtn,
          activeInlineFormats.has('bold') ? styles.formatBtnActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onInlineFormatToggle?.('bold')}
        aria-label="Bold"
        aria-pressed={activeInlineFormats.has('bold')}
        disabled={!_isTextBlock}
      >
        <IconBold size={24} />
      </button>

      {/* ── Italic ── */}
      <button
        className={[
          styles.formatBtn,
          activeInlineFormats.has('italic') ? styles.formatBtnActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onInlineFormatToggle?.('italic')}
        aria-label="Italic"
        aria-pressed={activeInlineFormats.has('italic')}
        disabled={!_isTextBlock}
      >
        <IconItalic size={24} />
      </button>

      {/* ── Underline ── */}
      <button
        className={[
          styles.formatBtn,
          activeInlineFormats.has('underline') ? styles.formatBtnActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onInlineFormatToggle?.('underline')}
        aria-label="Underline"
        aria-pressed={activeInlineFormats.has('underline')}
        disabled={!_isTextBlock}
      >
        <IconUnderline size={24} />
      </button>

      {/* ── Bullet list ── */}
      <button
        className={[
          styles.formatBtn,
          activeBlockType === 'bulletList' ? styles.formatBtnActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onBlockTypeChange?.('bulletList')}
        aria-label="Bullet list"
        aria-pressed={activeBlockType === 'bulletList'}
      >
        <IconBulletList size={24} />
      </button>

      {/* ── Numbered list ── */}
      <button
        className={[
          styles.formatBtn,
          activeBlockType === 'numberedList' ? styles.formatBtnActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onBlockTypeChange?.('numberedList')}
        aria-label="Numbered list"
        aria-pressed={activeBlockType === 'numberedList'}
      >
        <IconNumberedList size={24} />
      </button>

      {/* ── Checklist ── */}
      <button
        className={[
          styles.formatBtn,
          activeBlockType === 'checklist' ? styles.formatBtnActive : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onBlockTypeChange?.('checklist')}
        aria-label="Checklist"
        aria-pressed={activeBlockType === 'checklist'}
      >
        <IconPlanning size={24} />
      </button>
    </div>
  )
}
