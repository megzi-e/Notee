# PRD Validation & Build Plan — Web Notes App

## Part 1: Design vs PRD Validation

### 1.1 Date grouping

| PRD requirement | Design support | Status |
|-----------------|----------------|--------|
| Notes grouped by creation date (Today, Yesterday, This Week, Older) | Figma shows a “Today” label and note list; design system has typography for labels (Label small / Label large) and list item styling | **Partial** — Design implies a list with at least one group label; section headers for “Yesterday”, “This Week”, “Older” are not explicitly in the frames. |
| Automatic grouping, no user folders | Sidebar is a flat list of note tabs with no folder UI | **Aligned** |
| Notes ordered by most recently updated | No conflict with design; list order is data/state, not visual | **Aligned** |

**Gap:** Add explicit section headers in the sidebar for “Today”, “Yesterday”, “This Week”, “Older” using existing label typography and spacing. No design change needed beyond applying tokens.

---

### 1.2 Rich text formatting

| PRD requirement | Design support | Status |
|-----------------|----------------|--------|
| Normal, Bold, Italic, Underline | Toolbar shows format buttons (B, I, U, Aa); design has active/default states | **Aligned** |
| Bullet list, Numbered list | Toolbar implies list controls; list styling can use Normal Text + spacing | **Aligned** |
| Headings H1, H2, H3 | Design system defines Heading 1/2/3 (24/20/18px, bold, JetBrains Mono) | **Aligned** |
| No images, links, tables, mentions, Markdown export | Design has no such controls | **Aligned** |

**Gap:** None. Ensure toolbar includes one control per format (e.g. Aa for paragraph/headings or separate H1–H3) and that content area uses typography tokens for each block type.

---

### 1.3 Checklists / tasks

| PRD requirement | Design support | Status |
|-----------------|----------------|--------|
| Line can become checklist item; checkbox + text + completed state | Design specifies checkbox: unselected = circle outline, selected = filled black circle + white check | **Aligned** |
| Enter in checklist creates new checklist item | Behavior, not visual; no conflict | **Aligned** |
| Tasks inside notes, not separate | Single editor + content model; design has one editor | **Aligned** |

**Gap:** None. Implement checklist blocks in the rich-text model and render with the defined checkbox styles.

---

### 1.4 Keyboard shortcuts

| PRD requirement | Design support | Status |
|-----------------|----------------|--------|
| Cmd/Ctrl+N (new note) | No shortcut shown in UI; “New Note” button present | **Aligned** — Shortcuts are power-user; no need in Figma. |
| Cmd/Ctrl+S (prevent browser save, force save) | N/A | Implement in code. |
| Cmd/Ctrl+1/2/3 (headings) | Toolbar implies heading levels | **Aligned** |
| Cmd/Ctrl+Shift+C (toggle checklist) | Toolbar implies checklist | **Aligned** |
| Cmd/Ctrl+B / I / U (bold / italic / underline) | Toolbar shows B, I, U | **Aligned** |

**Gap:** None. Design does not need to show shortcuts; ensure app implements them and optionally add a shortcut hint (e.g. in tooltip or help modal) later.

---

### 1.5 Responsive behavior

| PRD requirement | Design support | Status |
|-----------------|----------------|--------|
| Desktop: Sidebar + editor visible | Two-panel layout in Figma; sidebar + editor with min-width | **Aligned** |
| Tablet: Sidebar collapsible, editor primary | Design doc notes “sidebar can collapse”; tokens support flexible layout | **Aligned** |
| Mobile: Sidebar hidden by default; toggle to open; full-screen editor | Design doc: “sidebar hidden by default on mobile, toggle to open” | **Aligned** |
| No split views on mobile | Single full-screen editor implied | **Aligned** |

**Gap:** Define one mobile sidebar pattern (e.g. overlay drawer or slide-in) and use existing overlay/backdrop tokens if needed. No new Figma required.

---

### 1.6 Other PRD ↔ design checks

| Area | PRD | Design | Status |
|------|-----|--------|--------|
| Delete note | Delete with confirmation | Delete modal with Cancel (secondary) / Delete (destructive), “This action cannot be undone.” | **Aligned** |
| Note tab empty title | Show placeholder “Untitled” | Placeholder styling (text.secondary) in design system | **Aligned** |
| Sidebar note hover | Reveal delete icon | Design: delete icon #ff3b30 on list row | **Aligned** |
| Auto-save | On change | No UI; implementation only | **Aligned** |
| Local storage only | No backend | N/A | **Aligned** |

---

### Validation summary

- **Fully aligned:** Rich text, checklists, keyboard shortcuts (implied), responsive intent, delete modal, note tabs, sidebar states.
- **Small gap:** Date grouping — use existing typography/spacing to add “Today”, “Yesterday”, “This Week”, “Older” section headers in the sidebar; no Figma change.
- **Clarification:** Mobile sidebar — choose overlay or slide-in and document in build; use existing tokens.

---

## Part 2: Build Plan

### 2.1 Figma component → React component mapping

| Figma / design element | React component | Notes |
|------------------------|-----------------|--------|
| **Design system (tokens)** | Already in repo | `src/theme/tokens.ts`, `tokens.css`; use across all components. |
| **Sidebar (container)** | `Sidebar` | Layout + date groups; responsive: visible / collapsible / overlay by viewport. |
| **Date group label** (“Today”, “Yesterday”, …) | `SidebarSection` or inline in `Sidebar` | Label small typography; spacing above/below group. |
| **Note tab (list item)** | `NoteTab` | Title (or “Untitled”), active/hover states, delete icon on hover; `onSelect`, `onDelete`. |
| **“New Note” action** | Part of `Sidebar` or `NoteTab` | First item or fixed header; + icon, “New Note” label; triggers create + Cmd/Ctrl+N. |
| **Editor (outer)** | `Editor` or `NoteEditor` | Wraps title + content + toolbar; border, padding from tokens. |
| **Title input** | `TitleInput` or inside `NoteEditor` | Single-line, Title typography, placeholder; controlled. |
| **Content area (rich text)** | `RichTextEditor` (or contenteditable + blocks) | Renders blocks (paragraph, headings, lists, checklist); handles shortcuts and toolbar. |
| **Toolbar** | `Toolbar` | Row of format buttons (Aa, B, I, U, lists, checklist, delete); active state from selection. |
| **Toolbar format button** | `ToolbarButton` | Default/active/hover; icon or label; `onClick` + optional shortcut. |
| **Delete note (toolbar)** | Button in `Toolbar` | Destructive icon button; opens delete modal. |
| **Delete confirmation modal** | `DeleteNoteModal` | Title “Delete ‘{note title}'?”, caption “This action cannot be undone.”, Cancel (secondary), Delete (destructive). |
| **Primary / Secondary / Destructive buttons** | `Button` | Variant prop; use design tokens for colors and states. |
| **Checkbox (checklist)** | `Checkbox` or inline in block renderer | Circle outline / filled + check; controlled checked state. |
| **Responsive Topbar** | `ResponsiveTopbar` | Shown on tablet/mobile; contains hamburger (`IconBarsTwo`) + "New Note" button. Replaces sidebar header. See DESIGN_SYSTEM.md §5. |
| **Mobile sidebar toggle** | Part of `ResponsiveTopbar` | Hamburger icon in topbar; toggles sidebar visibility (drawer/overlay). |

---

### 2.2 Feature → implementation steps

#### Notes management (core)

1. **Data layer**
   - Define note type: `id`, `title`, `content` (rich-text model), `createdAt`, `updatedAt`.
   - Implement local-storage load/save (get all, get one, create, update, delete).
   - Debounced auto-save on title/content change (e.g. 300–500 ms).
2. **State**
   - App state: `notes: Note[]`, `activeNoteId: string | null`, `sidebarOpen` (for responsive).
   - Create note (generate id, timestamps), update note, delete note (after confirmation).
3. **UI**
   - `Sidebar` + `NoteTab`: list notes, highlight active, “New Note” at top or first group.
   - `NoteEditor`: load active note; bind title and content to state; trigger save on change.
   - Empty state: when no notes, show empty sidebar and empty editor with “New Note” CTA.

#### Date grouping

1. **Logic**
   - Utility: `getDateGroup(createdAt: number): 'today' | 'yesterday' | 'thisWeek' | 'older'` (use UTC or local date per product rule).
   - Sort notes by `updatedAt` desc; group by `getDateGroup(createdAt)`; order groups: Today, Yesterday, This Week, Older.
2. **UI**
   - In `Sidebar`, render groups in order; each group has a section label (“Today”, “Yesterday”, “This Week”, “Older”) using Label small + spacing.
   - Render `NoteTab` per note within each group.

#### Rich text editing (scoped)

1. **Model**
   - Choose a simple block-based model (e.g. array of blocks: `{ type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'checklist', content: string, checked?: boolean }`). Alternative: use a small library (e.g. Slate, TipTap) if you want more structure.
   - Map PRD formats to block types; store as JSON in `content`.
2. **Input & shortcuts**
   - Either contenteditable with custom commands or a small editor that maps Cmd/Ctrl+1/2/3, B, I, U, Shift+C to block type / inline format.
   - Ensure Cmd/Ctrl+S prevents default and triggers save (no browser save dialog).
3. **Rendering**
   - Map each block type to the correct typography (Title for doc title; H1/H2/H3, Normal Text, list styles from design system).
4. **Toolbar**
   - `Toolbar` buttons dispatch format commands (bold, italic, underline, H1–H3, bullet, numbered, checklist) and reflect current selection/block state (active style).

#### Tasks / checklists

1. **Model**
   - Checklist block: `{ type: 'checklist', items: { text: string, checked: boolean }[] }` or one block per item with `checked`.
   - Persist in note `content`; include in auto-save.
2. **Behavior**
   - Enter in a checklist item: create new checklist item below (same block or next block).
   - Toggle checkbox updates `checked` and saves.
3. **UI**
   - Render checklist with design checkbox (circle outline / filled + check); label small or normal text for item text.

#### Keyboard shortcuts

1. **Global**
   - Cmd/Ctrl+N: create new note, focus editor.
   - Cmd/Ctrl+S: `preventDefault()`, trigger save.
2. **Editor**
   - Cmd/Ctrl+1/2/3: set block to H1/H2/H3.
   - Cmd/Ctrl+B / I / U: bold / italic / underline (if supported by model).
   - Cmd/Ctrl+Shift+C: toggle checklist at cursor.
   - Attach to `keydown` on editor container; prevent default when handled.

#### Delete flow

1. **Trigger**
   - Toolbar “Delete note” or delete icon on note tab (when not the only way to delete) opens modal.
2. **Modal**
   - `DeleteNoteModal`: title with note name, caption “This action cannot be undone.”, Cancel (secondary) / Delete (destructive).
   - On Delete: delete from storage and state, clear active note, close modal. On Cancel: close modal only.

#### Responsive behavior

1. **Breakpoints**
   - Define breakpoints (e.g. mobile &lt; 768, tablet 768–1024, desktop &gt; 1024); use same tokens, adjust layout only.
2. **Desktop**
   - Sidebar fixed or flex; editor fills rest; both visible.
3. **Tablet**
   - Sidebar collapsible (e.g. icon to toggle); editor primary; optional overlay when sidebar open.
4. **Mobile**
   - Sidebar hidden by default; hamburger or icon toggles overlay/slide-in; full-width editor; close sidebar on note select or outside click.

---

### 2.3 High-risk areas and mitigation

| Risk | Why it’s hard | Mitigation |
|------|----------------|------------|
| **Rich text model and cursor** | Contenteditable is brittle; cursor/selection can jump; block vs inline is easy to get wrong. | Option A: Use a minimal block-based model (array of blocks) and a small custom contenteditable layer only for typing, with explicit block boundaries. Option B: Use Slate or TipTap and restrict to PRD features only. Document “no images/links/tables” in data model and UI. |
| **Auto-save and concurrency** | Rapid typing + debounced save can feel laggy or conflict with read-after-write. | Debounce 300–500 ms; save only when note actually changed; avoid replacing entire note object on every keystroke (patch content/title if possible). |
| **Keyboard shortcuts vs browser/OS** | Cmd+S, Cmd+N can be captured by browser or OS. | Use `keydown` + `preventDefault()` for Cmd/Ctrl+S and Cmd/Ctrl+N; document that some shortcuts may need to be different on certain OS/browsers if conflicts appear. |
| **Date grouping edge cases** | Timezone, “today” rollover at midnight, empty groups. | Implement `getDateGroup` with clear rules (e.g. local date); decide whether to show empty groups (“This Week” with no notes) or hide them; add tests for boundary times. |
| **Checklist Enter behavior** | Enter should create new checklist item, not new paragraph. | Implement in block handler: when block is checklist and key is Enter, insert new checklist item and prevent default new paragraph. |
| **Mobile sidebar UX** | Overlay can feel cramped; accidental taps. | Use full-width overlay or slide-in from left; ensure touch target for close; close on route/selection; optional backdrop click to close. |
| **Accessibility** | Shortcuts and custom controls can be inaccessible. | Use semantic HTML (button, input, list); aria-labels on icon buttons; ensure focus management when opening/closing modal and sidebar; consider announcing “Saved” for screen readers. |

---

### 2.4 Suggested implementation order

1. **Setup** — React app (Vite/CRA), add `tokens.css` and font (JetBrains Mono), base layout (sidebar + editor placeholders).
2. **Data + notes CRUD** — Note type, local storage, state (notes, activeId), create/update/delete, auto-save.
3. **Sidebar + note list** — Date grouping utility, `Sidebar` with sections and `NoteTab`, “New Note”, active and hover (delete icon).
4. **Editor shell** — `NoteEditor` with title input and plain text content first; wire to state and save.
5. **Rich text model** — Block types, JSON content, minimal editor (or library) with B/I/U and H1–H3.
6. **Toolbar** — Format buttons and delete note; wire to editor commands and open delete modal.
7. **Checklists** — Checklist block type, checkbox UI, Enter creates new item, persist checked state.
8. **Delete modal** — `DeleteNoteModal` with design tokens; wire to delete flow.
9. **Keyboard shortcuts** — Global (N, S) and editor (1/2/3, B, I, U, Shift+C); preventDefault where needed.
10. **Responsive** — Breakpoints, collapsible sidebar, mobile overlay/toggle, polish.

This order gets core value (create, list, edit, save) first, then adds formatting, checklists, and polish.
