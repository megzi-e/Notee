/**
 * ChecklistBlock — renders a list of toggleable checklist items.
 *
 * Rendering constraints:
 *   - No contentEditable
 *   - No dangerouslySetInnerHTML
 *   - Checkbox state is controlled (checked prop, not defaultChecked)
 *   - Toggle dispatches a structured TOGGLE_CHECKLIST_ITEM action
 */

import type { ChecklistBlock as ChecklistBlockType } from '@/types/note'
import { useEditorDispatch } from '@/state/EditorContext'
import { TextSpanRenderer } from './TextSpanRenderer'

export type ChecklistBlockProps = {
  block: ChecklistBlockType
  noteId: string
}

export function ChecklistBlock({ block, noteId }: ChecklistBlockProps) {
  const dispatch = useEditorDispatch()

  const handleToggle = (itemId: string) => {
    dispatch({
      type: 'TOGGLE_CHECKLIST_ITEM',
      noteId,
      blockId: block.id,
      itemId,
    })
  }

  return (
    <div data-block-id={block.id} data-block-type="checklist">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {block.items.map((item) => (
          <li key={item.id} data-checklist-item-id={item.id}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
              />
              <span style={{ textDecoration: item.checked ? 'line-through' : undefined }}>
                <TextSpanRenderer spans={item.content} />
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
