/**
 * BlockRenderer — renders a single Block from the data model
 * with design-system typography, styling, AND editable inputs.
 *
 * Block lifecycle:
 *   - Enter inserts a newline ('\n') inside the current block.
 *   - Enter does NOT split blocks or create new blocks/items.
 *   - Blocks are only created/changed via the toolbar format picker.
 *   - Backspace in an empty block removes the block (explicit user action).
 *
 * Constraints enforced:
 *   - No contentEditable
 *   - No dangerouslySetInnerHTML
 *   - Every text field is a controlled <textarea>
 *   - All mutations flow through structured dispatch actions
 */

import { useRef, useCallback, useEffect } from 'react'
import type {
  Block,
  TextSpan,
  ParagraphBlock,
  HeadingBlock,
  ListBlock,
  ChecklistBlock,
  ChecklistItem,
} from '@/types/note'
import { IconCheckmarkSmall } from '@/components/icons'
import { assertNever } from '@/utils/assert-never'
import { spansToText, textToSpans } from '@/utils/span-text'
import styles from './BlockRenderer.module.css'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface BlockRendererProps {
  /** The block data to render */
  block: Block
  /** The id of the parent note (needed for dispatch actions) */
  noteId: string
  /** Called when block content text changes (paragraph / heading) */
  onContentChange?: (blockId: string, content: TextSpan[]) => void
  /** Called when a list item's text changes */
  onListItemChange?: (blockId: string, itemIndex: number, content: TextSpan[]) => void
  /** Called when a checklist item's text changes */
  onChecklistItemChange?: (blockId: string, itemId: string, content: TextSpan[]) => void
  /** Called when a checklist item is toggled */
  onToggleChecklistItem?: (blockId: string, itemId: string) => void
  /** Called when Backspace is pressed in an empty block to remove it */
  onRemoveBlock?: (blockId: string) => void
  /** Called when Backspace is pressed in an empty list item */
  onRemoveListItem?: (blockId: string, itemIndex: number) => void
  /** Called when Backspace is pressed in an empty checklist item */
  onRemoveChecklistItem?: (blockId: string, itemId: string) => void
}

// ---------------------------------------------------------------------------
// Auto-resizing textarea hook
// ---------------------------------------------------------------------------

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return ref
}

// ---------------------------------------------------------------------------
// Block-type renderers
// ---------------------------------------------------------------------------

function ParagraphRenderer({
  block,
  onContentChange,
  onRemoveBlock,
}: {
  block: ParagraphBlock
  onContentChange?: BlockRendererProps['onContentChange']
  onRemoveBlock?: BlockRendererProps['onRemoveBlock']
}) {
  const text = spansToText(block.content)
  const ref = useAutoResize(text)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onContentChange?.(block.id, textToSpans(e.target.value))
    },
    [block.id, onContentChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter inserts a newline — let the browser handle it natively.
      // Only intercept Backspace on a completely empty block.
      if (e.key === 'Backspace' && text === '') {
        e.preventDefault()
        onRemoveBlock?.(block.id)
      }
    },
    [block.id, text, onRemoveBlock],
  )

  return (
    <textarea
      ref={ref}
      className={`${styles.editableInput} ${styles.paragraph}`}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something…"
      rows={1}
    />
  )
}

function HeadingRenderer({
  block,
  onContentChange,
  onRemoveBlock,
}: {
  block: HeadingBlock
  onContentChange?: BlockRendererProps['onContentChange']
  onRemoveBlock?: BlockRendererProps['onRemoveBlock']
}) {
  const text = spansToText(block.content)
  const ref = useAutoResize(text)

  const cls = (
    { 1: styles.heading1, 2: styles.heading2, 3: styles.heading3 } as const
  )[block.level]

  const placeholders = { 1: 'Heading 1', 2: 'Heading 2', 3: 'Heading 3' } as const

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onContentChange?.(block.id, textToSpans(e.target.value))
    },
    [block.id, onContentChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Backspace' && text === '') {
        e.preventDefault()
        onRemoveBlock?.(block.id)
      }
    },
    [block.id, text, onRemoveBlock],
  )

  return (
    <textarea
      ref={ref}
      className={`${styles.editableInput} ${cls}`}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholders[block.level]}
      rows={1}
    />
  )
}

function ListRenderer({
  block,
  onListItemChange,
  onRemoveListItem,
}: {
  block: ListBlock
  onListItemChange?: BlockRendererProps['onListItemChange']
  onRemoveListItem?: BlockRendererProps['onRemoveListItem']
}) {
  const Tag = block.ordered ? 'ol' : 'ul'

  return (
    <Tag className={styles.list}>
      {block.items.map((itemSpans, index) => (
        <ListItemInput
          key={index}
          blockId={block.id}
          index={index}
          spans={itemSpans}
          onListItemChange={onListItemChange}
          onRemoveListItem={onRemoveListItem}
        />
      ))}
    </Tag>
  )
}

function ListItemInput({
  blockId,
  index,
  spans,
  onListItemChange,
  onRemoveListItem,
}: {
  blockId: string
  index: number
  spans: TextSpan[]
  onListItemChange?: BlockRendererProps['onListItemChange']
  onRemoveListItem?: BlockRendererProps['onRemoveListItem']
}) {
  const text = spansToText(spans)
  const ref = useAutoResize(text)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onListItemChange?.(blockId, index, textToSpans(e.target.value))
    },
    [blockId, index, onListItemChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Backspace' && text === '') {
        e.preventDefault()
        onRemoveListItem?.(blockId, index)
      }
    },
    [blockId, index, text, onRemoveListItem],
  )

  return (
    <li>
      <textarea
        ref={ref}
        className={styles.editableInput}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="List item"
        rows={1}
      />
    </li>
  )
}

function ChecklistRenderer({
  block,
  onToggle,
  onChecklistItemChange,
  onRemoveChecklistItem,
}: {
  block: ChecklistBlock
  onToggle?: (blockId: string, itemId: string) => void
  onChecklistItemChange?: BlockRendererProps['onChecklistItemChange']
  onRemoveChecklistItem?: BlockRendererProps['onRemoveChecklistItem']
}) {
  return (
    <ul className={styles.checklist}>
      {block.items.map((item: ChecklistItem) => (
        <ChecklistItemInput
          key={item.id}
          blockId={block.id}
          item={item}
          onToggle={onToggle}
          onChecklistItemChange={onChecklistItemChange}
          onRemoveChecklistItem={onRemoveChecklistItem}
        />
      ))}
    </ul>
  )
}

function ChecklistItemInput({
  blockId,
  item,
  onToggle,
  onChecklistItemChange,
  onRemoveChecklistItem,
}: {
  blockId: string
  item: ChecklistItem
  onToggle?: (blockId: string, itemId: string) => void
  onChecklistItemChange?: BlockRendererProps['onChecklistItemChange']
  onRemoveChecklistItem?: BlockRendererProps['onRemoveChecklistItem']
}) {
  const text = spansToText(item.content)
  const ref = useAutoResize(text)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChecklistItemChange?.(blockId, item.id, textToSpans(e.target.value))
    },
    [blockId, item.id, onChecklistItemChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Backspace' && text === '') {
        e.preventDefault()
        onRemoveChecklistItem?.(blockId, item.id)
      }
    },
    [blockId, item.id, text, onRemoveChecklistItem],
  )

  return (
    <li className={styles.checklistItem}>
      <button
        type="button"
        className={[
          styles.checkbox,
          item.checked ? styles.checkboxChecked : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onToggle?.(blockId, item.id)}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
        aria-checked={item.checked}
        role="checkbox"
      >
        <span className={styles.checkIcon}>
          <IconCheckmarkSmall size={14} />
        </span>
      </button>
      <textarea
        ref={ref}
        className={`${styles.editableInput} ${item.checked ? styles.checklistTextChecked : ''}`}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="To-do"
        rows={1}
      />
    </li>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function BlockRenderer({
  block,
  onContentChange,
  onListItemChange,
  onChecklistItemChange,
  onToggleChecklistItem,
  onRemoveBlock,
  onRemoveListItem,
  onRemoveChecklistItem,
}: BlockRendererProps) {
  return (
    <div className={styles.block} data-block-id={block.id} data-block-type={block.type}>
      {(() => {
        switch (block.type) {
          case 'paragraph':
            return (
              <ParagraphRenderer
                block={block}
                onContentChange={onContentChange}
                onRemoveBlock={onRemoveBlock}
              />
            )
          case 'heading':
            return (
              <HeadingRenderer
                block={block}
                onContentChange={onContentChange}
                onRemoveBlock={onRemoveBlock}
              />
            )
          case 'list':
            return (
              <ListRenderer
                block={block}
                onListItemChange={onListItemChange}
                onRemoveListItem={onRemoveListItem}
              />
            )
          case 'checklist':
            return (
              <ChecklistRenderer
                block={block}
                onToggle={onToggleChecklistItem}
                onChecklistItemChange={onChecklistItemChange}
                onRemoveChecklistItem={onRemoveChecklistItem}
              />
            )
          default:
            return assertNever(block)
        }
      })()}
    </div>
  )
}
