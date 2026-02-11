// ---------------------------------------------------------------------------
// Core data model — fully serializable to JSON / localStorage.
// ---------------------------------------------------------------------------

/**
 * An inline span of styled text.  Every field beyond `text` is optional;
 * absent means "not applied".
 */
export type TextSpan = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

// ---------------------------------------------------------------------------
// Block types
// ---------------------------------------------------------------------------

export type ParagraphBlock = {
  id: string
  type: 'paragraph'
  content: TextSpan[]
}

export type HeadingBlock = {
  id: string
  type: 'heading'
  level: 1 | 2 | 3
  content: TextSpan[]
}

export type ListBlock = {
  id: string
  type: 'list'
  ordered: boolean
  /** Each item is a run of styled text spans. */
  items: TextSpan[][]
}

export type ChecklistItem = {
  id: string
  checked: boolean
  content: TextSpan[]
}

export type ChecklistBlock = {
  id: string
  type: 'checklist'
  items: ChecklistItem[]
}

/**
 * Discriminated union of every block the editor supports.
 * Extend this union when new block types are added.
 */
export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | ChecklistBlock

// ---------------------------------------------------------------------------
// Note (top‑level document)
// ---------------------------------------------------------------------------

export type Note = {
  id: string
  title: string
  /** TipTap HTML content for the editor body. */
  body: string
  /**
   * @deprecated Legacy block array — kept only so old localStorage data
   * can be migrated to `body` on first load.  Do not write new code
   * against this field.
   */
  blocks: Block[]
  createdAt: number
  updatedAt: number
}
