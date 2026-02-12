/**
 * TipTap Editor — Custom Extension Configuration
 *
 * Every extension is explicitly imported and configured.
 * StarterKit is intentionally NOT used so each node, mark, and plugin
 * is individually controlled, keeping the schema predictable and auditable.
 *
 * ─── Document schema (ProseMirror) ─────────────────────────────────────
 *
 *   doc                           content: "block+"
 *   ├── paragraph                 content: "inline*"   group: "block"
 *   │   ├── text                  (carries marks: bold, italic, underline)
 *   │   └── hardBreak             inline node (<br>)
 *   ├── heading [level 1|2|3]     content: "inline*"   group: "block"
 *   │   ├── text
 *   │   └── hardBreak
 *   ├── bulletList                content: "listItem+" group: "block"
 *   │   └── listItem              content: "paragraph block*"
 *   │       ├── paragraph
 *   │       └── bulletList | orderedList   (nested — arbitrary depth)
 *   ├── orderedList               content: "listItem+" group: "block"
 *   │   └── listItem              content: "paragraph block*"
 *   │       ├── paragraph
 *   │       └── bulletList | orderedList   (nested — arbitrary depth)
 *   └── taskList                  content: "taskItem+" group: "block"
 *       └── taskItem [checked]    content: "paragraph block*"  (nested: true)
 *           ├── paragraph
 *           └── taskList                  (nested — arbitrary depth)
 *
 *   Marks: bold, italic, underline
 *   Plugins: history (undo / redo)
 *
 * ────────────────────────────────────────────────────────────────────────
 */

import type { Extensions } from '@tiptap/core'

// ── Nodes ───────────────────────────────────────────────────────────────
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TaskList from '@tiptap/extension-task-list'
import HardBreak from '@tiptap/extension-hard-break'

// ── List item overrides (smart Enter + explicit Tab / Shift-Tab) ────────
import { CustomListItem, CustomTaskItem, ListKeymap } from './listKeymap'

// ── Marks ───────────────────────────────────────────────────────────────
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'

// ── Plugins ─────────────────────────────────────────────────────────────
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'

// ────────────────────────────────────────────────────────────────────────
// Extension array — the single source of truth for the editor schema.
//
// Each extension is configured inline.  Where the default behaviour is
// acceptable the extension is included bare (e.g. Document, Text) so
// intent is still explicit rather than hidden behind StarterKit.
// ────────────────────────────────────────────────────────────────────────

export const extensions: Extensions = [
  // ── Structure ───────────────────────────────────────────────────────
  /**
   * Root document node.
   * content: "block+"  → one or more block-level children.
   */
  Document,

  /**
   * The default block.  Created when the user presses Enter on an
   * empty line or when no other block type applies.
   * content: "inline*"  → text + hardBreak.
   */
  Paragraph,

  /**
   * Inline text leaf.  All marks (bold, italic, underline) attach here.
   */
  Text,

  // ── Block types ─────────────────────────────────────────────────────
  /**
   * Heading node with an explicit whitelist of levels.
   *
   * Only levels 1, 2, 3 are enabled.  Levels 4-6 are omitted to match
   * the design system's typography scale (H1 24px, H2 20px, H3 18px).
   */
  Heading.configure({
    levels: [1, 2, 3],
  }),

  /**
   * Unordered list.
   *
   * Renders as <ul>.  Nesting is handled by the ListItem content rule
   * ("paragraph block*") — no extra configuration needed on BulletList
   * itself.
   *
   * HTMLAttributes keep the existing data-attribute convention for
   * styling / test selectors.
   */
  BulletList.configure({
    HTMLAttributes: {
      class: 'bullet-list',
    },
  }),

  /**
   * Ordered (numbered) list.
   *
   * keepMarks + keepAttributes ensure that inline marks survive when
   * the user presses Enter to create a new list item (the caret
   * inherits any active bold/italic/underline).
   */
  OrderedList.configure({
    HTMLAttributes: {
      class: 'ordered-list',
    },
  }),

  /**
   * Generic list item shared by BulletList and OrderedList.
   *
   * Uses CustomListItem (see ./listKeymap.ts) which extends the stock
   * ListItem with smarter keyboard behaviour:
   *
   *   Enter  — on an empty item: liftListItem (exit / outdent)
   *            on a non-empty item: splitListItem (new sibling)
   *   Tab    — sinkListItem (indent one level)
   *   Shift-Tab — liftListItem (outdent one level)
   *
   * The content rule is unchanged: "paragraph block*", enabling
   * arbitrarily deep nesting.
   */
  CustomListItem.configure({
    HTMLAttributes: {
      class: 'list-item',
    },
  }),

  /**
   * Task (checkbox) list.
   *
   * Rendered as a <ul> with data-type="taskList"; each child is a
   * TaskItem with a checkbox control.
   */
  TaskList.configure({
    HTMLAttributes: {
      class: 'task-list',
    },
  }),

  /**
   * Individual task item.
   *
   * Uses CustomTaskItem (see ./listKeymap.ts) which extends the stock
   * TaskItem with the same smart Enter behaviour as CustomListItem.
   *
   * `nested: true` changes the content rule from "paragraph" to
   * "paragraph block*", allowing task items to contain child task
   * lists for sub-task hierarchies.  It also enables the Tab shortcut
   * for indenting tasks.
   */
  CustomTaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: 'task-item',
    },
  }),

  // ── List boundary handling (Backspace / Delete) ─────────────────────
  /**
   * Built-in ListKeymap from @tiptap/extension-list.
   *
   * Provides sophisticated Backspace and Delete behaviour at list
   * boundaries: joining with a preceding list, lifting the first item
   * on Backspace, and merging forward on Delete.
   *
   * This is separate from the Enter / Tab / Shift-Tab logic in
   * CustomListItem and CustomTaskItem so each concern is isolated.
   */
  ListKeymap.configure({
    listTypes: [
      { itemName: 'listItem',  wrapperNames: ['bulletList', 'orderedList'] },
      { itemName: 'taskItem',  wrapperNames: ['taskList'] },
    ],
  }),

  // ── Inline nodes ────────────────────────────────────────────────────
  /**
   * Hard break — an inline <br> node inserted with Shift+Enter.
   *
   * keepMarks ensures the caret retains bold/italic/underline after
   * the break.
   */
  HardBreak.configure({
    keepMarks: true,
  }),

  // ── Marks (inline formatting) ───────────────────────────────────────
  //
  // ProseMirror marks are metadata on text nodes.  They CANNOT create,
  // remove, or rearrange block nodes — the schema enforces this at the
  // transaction level, so marks can never break block structure.
  //
  // All three marks below set `excludes: ''` (the default) meaning
  // they can coexist freely — bold + italic + underline on the same
  // span is valid.
  //
  // Toggle from toolbar: editor.chain().focus().toggleBold().run()
  //   .focus()      — restores editor focus after the toolbar click
  //   .toggleBold() — applies/removes the mark on the current selection
  //   .run()        — executes the chained transaction
  //
  // When the selection is collapsed (cursor, no highlight), toggling
  // a mark stores it — the next characters typed will carry the mark,
  // but existing text is untouched.
  //
  // See ./markCommands.ts for the type-safe utility that maps toolbar
  // `InlineFormat` values to these commands.
  // ───────────────────────────────────────────────────────────────────

  /**
   * Bold — <strong>
   *
   * Keyboard  : Mod-b / Mod-B
   * Commands  : setBold, toggleBold, unsetBold
   * Input rule: **text** or __text__
   * Paste rule: same patterns recognised on paste
   * Parse HTML: <strong>, <b>, font-weight ≥ 500
   */
  Bold.configure({
    HTMLAttributes: {},
  }),

  /**
   * Italic — <em>
   *
   * Keyboard  : Mod-i / Mod-I
   * Commands  : setItalic, toggleItalic, unsetItalic
   * Input rule: *text* or _text_
   * Paste rule: same patterns recognised on paste
   * Parse HTML: <em>, <i>, font-style: italic
   */
  Italic.configure({
    HTMLAttributes: {},
  }),

  /**
   * Underline — <u>
   *
   * Keyboard  : Mod-u / Mod-U
   * Commands  : setUnderline, toggleUnderline, unsetUnderline
   * Parse HTML: <u>, text-decoration containing "underline"
   *
   * Note: Underline is a separate package (@tiptap/extension-underline)
   * and is NOT part of StarterKit.
   */
  Underline.configure({
    HTMLAttributes: {},
  }),

  // ── Plugins ─────────────────────────────────────────────────────────
  /**
   * History (undo / redo).
   *
   * depth  – how many steps to keep (100 is generous for a notes app).
   * newGroupDelay – ms before a new undo group is created after typing
   *                 pauses (500ms prevents every keystroke from being
   *                 its own undo step).
   *
   * Shortcuts:
   *   Undo: Ctrl/Cmd+Z
   *   Redo: Ctrl/Cmd+Shift+Z  (or Ctrl+Y on Windows)
   */
  History.configure({
    depth: 100,
    newGroupDelay: 500,
  }),

  /**
   * Placeholder — shows hint text when the editor is empty.
   *
   * The extension adds `is-empty` / `is-editor-empty` classes and a
   * `data-placeholder` attribute directly on the empty node, which the
   * CSS `::before` pseudo-element reads via `attr(data-placeholder)`.
   */
  Placeholder.configure({
    placeholder: 'Start writing here...',
  }),
]
