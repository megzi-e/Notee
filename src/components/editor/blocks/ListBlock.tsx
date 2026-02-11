/**
 * ListBlock — renders an ordered or unordered list.
 *
 * Rendering constraints:
 *   - No contentEditable
 *   - No dangerouslySetInnerHTML
 *   - Each list item is a controlled array of TextSpan[]
 *   - All future edits dispatch through structured state actions
 */

import type { ListBlock as ListBlockType } from '@/types/note'
import { TextSpanRenderer } from './TextSpanRenderer'

export type ListBlockProps = {
  block: ListBlockType
  noteId: string
}

export function ListBlock({ block }: ListBlockProps) {
  const Tag = block.ordered ? 'ol' : 'ul'

  return (
    <div data-block-id={block.id} data-block-type="list" data-list-ordered={block.ordered}>
      <Tag>
        {block.items.map((itemSpans, index) => (
          <li key={index}>
            <TextSpanRenderer spans={itemSpans} />
          </li>
        ))}
      </Tag>
    </div>
  )
}
