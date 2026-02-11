/**
 * TaskItemView — custom TipTap NodeView for task list items.
 *
 * Replaces the default TaskItem rendering with a Figma-accurate
 * circular checkbox that uses IconCheckmark1Small for the check icon.
 *
 * ─── Figma spec (node 904:2229 / 905:2264) ────────────────────────────
 *
 *   Checkbox (20x20 circle):
 *     Unchecked : white bg, 2px border #f5f5f5 (overlay-2)
 *     Checked   : black bg (#000), white checkmark icon
 *
 *   Text:
 *     Unchecked : JetBrains Mono, black
 *     Checked   : JetBrains Mono, #767676 (text/secondary), strikethrough
 *
 * ────────────────────────────────────────────────────────────────────────
 */

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { IconCheckmark1Small } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconCheckmark1Small'

export function TaskItemView({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  const checked = node.attrs.checked as boolean

  return (
    <NodeViewWrapper
      as="li"
      className="task-item"
      data-type="taskItem"
      data-checked={checked}
    >
      {/* ── Circular checkbox ── */}
      <button
        type="button"
        className={`task-checkbox ${checked ? 'task-checkbox--checked' : ''}`}
        onClick={() => updateAttributes({ checked: !checked })}
        aria-label={checked ? 'Uncheck task' : 'Check task'}
        aria-checked={checked}
        role="checkbox"
        contentEditable={false}
      >
        {checked && (
          <span className="task-checkbox__icon">
            <IconCheckmark1Small size={14} />
          </span>
        )}
      </button>

      {/* ── Editable text content ── */}
      <NodeViewContent
        as="div"
        className={`task-content ${checked ? 'task-content--checked' : ''}`}
      />
    </NodeViewWrapper>
  )
}
