/**
 * HeadingBlock — renders an H1, H2, or H3 block.
 *
 * Rendering constraints:
 *   - No contentEditable
 *   - No dangerouslySetInnerHTML
 *   - Semantic heading element chosen by `block.level`
 *   - All future edits dispatch through structured state actions
 */

import type { HeadingBlock as HeadingBlockType } from '@/types/note'
import { TextSpanRenderer } from './TextSpanRenderer'

export type HeadingBlockProps = {
  block: HeadingBlockType
  noteId: string
}

const HeadingTag = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const

export function HeadingBlock({ block }: HeadingBlockProps) {
  const Tag = HeadingTag[block.level]

  return (
    <div data-block-id={block.id} data-block-type="heading" data-heading-level={block.level}>
      <Tag>
        <TextSpanRenderer spans={block.content} />
      </Tag>
    </div>
  )
}
