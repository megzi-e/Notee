/**
 * ParagraphBlock — renders a single paragraph block.
 *
 * Rendering constraints:
 *   - No contentEditable
 *   - No dangerouslySetInnerHTML
 *   - All future edits dispatch through structured state actions
 *   - Output is purely controlled React elements
 */

import type { ParagraphBlock as ParagraphBlockType } from '@/types/note'
import { TextSpanRenderer } from './TextSpanRenderer'

export type ParagraphBlockProps = {
  block: ParagraphBlockType
  noteId: string
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <div data-block-id={block.id} data-block-type="paragraph">
      <p>
        <TextSpanRenderer spans={block.content} />
      </p>
    </div>
  )
}
