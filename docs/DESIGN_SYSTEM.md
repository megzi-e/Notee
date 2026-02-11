# Notes App — Design System

Extracted from Figma (My Design systems). Use these tokens for a consistent, responsive UI.

---

## 1. Full Design System

### 1.1 Colors

| Token | Hex | Usage |
|-------|-----|--------|
| **Neutral** | | |
| `neutral.white` | `#ffffff` | Primary surfaces, default buttons, dialogs |
| `neutral.black` | `#000000` | Primary text on light, accent, primary buttons |
| **Text** | | |
| `text.primary` | `#171717` | Headings, body copy |
| `text.secondary` | `#767676` | Placeholders, captions, auxiliary text |
| `text.pry` | `#000000` | Emphasized text, button labels on light |
| **Background** | | |
| `background.default` | `#ffffff` | Page, editor, dialogs |
| `background.overlay` | `#f7f7f7` | Sidebar, secondary surfaces |
| **Interface (overlays / surfaces)** | | |
| `interface.overlay1` | `#f7f7f7` | Secondary buttons default, subtle panels |
| `interface.overlay2` | `#f5f5f5` | Hover/secondary surfaces |
| `interface.overlay3` | `#e8e8e8` | Borders, dividers, secondary hover |
| **Accent** | | |
| `accent.default` | `#000000` | Primary actions, selected states |
| `accent.primary` | `#1a1a1a` | Dark accent variant |
| **State — Destructive** | | |
| `state.destructive` | `#ff3b30` | Destructive buttons, delete icons |
| `state.destructiveTransparent` | `#ff3b301a` | Destructive hover/background tint |
| **Outline** | | |
| `background.outline` | `#e8e8e8` | Borders, editor outline |

### 1.2 Typography

- **Font family:** `JetBrains Mono` (entire UI).

| Style | Family | Weight | Size | Line height | Letter spacing |
|-------|--------|--------|------|-------------|----------------|
| **Title** | JetBrains Mono | 700 | 28px | 36px | 0 |
| **Heading 1** | JetBrains Mono | 700 | 24px | 32px | 0 |
| **Heading 2** | JetBrains Mono | 700 | 20px | 28px | -2px |
| **Heading 3** | JetBrains Mono | 700 | 18px | 24px | -2px |
| **Normal Text** | JetBrains Mono | 400 | 16px | 24px | 0 |
| **Label Large** | JetBrains Mono | 500 | 14px | 16px | 0 |
| **Label small** | JetBrains Mono | 500 | 12px | 14px | 0 |

**Scale (for reference):** `xx-sm: 12` → `x-sm: 14` → `sm: 16` → `md: 18` → `lg: 20` → `x-lg: 24` → `xx-lg: 28`.

#### Inline format styles (rich text editor)

Applied on top of any block-level text style (Normal Text, H1–H3, etc.):

| Format | CSS property | Value | Token |
|--------|-------------|-------|-------|
| **Bold** | `font-weight` | `700` | `inlineFormat.bold` |
| **Italic** | `font-style` | `italic` | `inlineFormat.italic` |
| **Underline** | `text-decoration` | `underline` | `inlineFormat.underline` |

### 1.3 Spacing

| Token | Value | Usage |
|-------|--------|--------|
| `spacing.xxSm` | 4px | Tight gaps, icon padding |
| `spacing.xSm` | 8px | Inline gaps, small padding |
| `spacing.sm` | 12px | Button padding, list item padding |
| `spacing.md` | 16px | Section gaps, toolbar gap |
| `spacing.big` | 20px | Block spacing |
| `spacing.xBig` | 24px | Headings, large gaps |
| `spacing.xxBig` | 28px | Title size / large spacing |
| `spacing.xxxBig` | 32px | Editor padding, large blocks |
| `spacing.xxxxBig` | 36px | Hero spacing, max padding |

### 1.4 Border radius

| Token | Value | Usage |
|-------|--------|--------|
| `radius.xs` | 4px | Chips, small controls, tight corners |
| `radius.sm` | 8px | Buttons, inputs, cards, list items, tabs, dialogs |

### 1.5 Shadows

| Token | Value | Usage |
|-------|--------|--------|
| `shadow.md` | See below | Modals, dropdowns, cards with elevation |

**`shadow.md` (CSS):**
```css
box-shadow:
  0 2px 4px -2px rgba(16, 24, 40, 0.06),
  0 4px 8px -2px rgba(16, 24, 40, 0.10);
```

---

## 2. Button Variants and States

### 2.1 Primary

- **Default:** `background: #000000`, `color: #ffffff`
- **Hover:** `background: #262626`, `color: #ffffff`
- **Use:** Main CTAs (e.g. Save, Create, Confirm).

### 2.2 Secondary

- **Default:** `background: #f7f7f7`, `color: #000000` (or `text.primary`)
- **Hover:** `background: #e8e8e8`, `color: #000000`
- **Use:** Cancel, secondary actions, "Button" style in design.

### 2.3 Destructive

- **Default:** `background: #ff3b30`, `color: #ffffff`
- **Hover:** `background: #cd2f26`, `color: #ffffff`
- **Use:** Delete, remove, irreversible actions.

### 2.4 Shared button styling

- **Border radius:** `8px` (`radius.sm`)
- **Padding:** use `spacing.sm` (12px) vertical, `spacing.md` (16px) horizontal (or from design)
- **Typography:** Label large or Normal text; medium/semi-bold for emphasis
- **Icon + text:** `spacing.xSm` (8px) between icon and label

### 2.5 Other controls (from frames)

- **New Note / Tab:** Light background (e.g. `#f7f7f7` or overlay), black text and "+" icon; same radius as buttons.
- **Toolbar format buttons:** Default white/light background, black icon; **active** black background, white icon.
- **Checkbox/toggle:** Unselected = circle outline; selected = filled black circle + white check.

---

## 3. Sidebar, Note Tab, Editor, Toolbar Tokens

### 3.1 Sidebar

| Token | Value | Notes |
|-------|--------|--------|
| Background | `#f7f7f7` / `background.overlay` | Slightly off-white |
| Width | `min-width: 240px` or ~20% | Responsive |
| Height | `100vh` or `100%` | Full height |
| Border right | `1px solid #e8e8e8` | `interface.overlay3` / `background.outline` |
| Item padding (horizontal) | `12px` | `spacing.sm` |
| Item height | `36px` | `spacing.xxxxBig` |
| Item gap (title ↔ delete icon) | `4px` | `spacing.xxSm` |
| Radii | `8px` on items | `radius.sm` |

### 3.2 Note tab (NotesTabs component)

The note tab has **4 variants** across two axes: interaction (Default / Hover) and selection (Inactive / Active).

#### Variant matrix

| | Default (no hover) | Hover |
|---|---|---|
| **Inactive** | Transparent BG, black text, no delete button | `#e8e8e8` (`interface.overlay3`) BG, black text, delete button visible |
| **Active** | `#000000` (`accent.default`) BG, white text, no delete button | `#1a1a1a` (`accent.primary`) BG, white text, delete button visible |

#### Title truncation

The title text uses `flex: 1 0 0` to fill remaining space. When the text exceeds the available width it is truncated with an ellipsis:

- `overflow: hidden`
- `text-overflow: ellipsis`
- `white-space: nowrap`
- `min-width: 1px` (prevents flex overflow)

On hover the delete button appears and the title's available space shrinks, so the ellipsis triggers sooner.

#### Delete button (hover only)

- **Hidden by default** — only rendered when hovered.
- Appears on hover for both active and inactive states.
- Icon: 24×24 red trash can (`#ff3b30` / `state.destructive`).
- Container: 4px padding around icon (32px total hit area).
- `flex-shrink: 0` — the delete button never compresses; the title text yields instead.

#### Full token table

| Property | Value | Token |
|----------|-------|-------|
| Width | `221px` in Figma (full sidebar width in practice) | — |
| Height | `36px` | `spacing.xxxxBig` |
| Padding (horizontal) | `12px` | `spacing.sm` |
| Gap (title ↔ delete) | `4px` | `spacing.xxSm` |
| Font | JetBrains Mono Medium, 14px / 16px line-height | `labelLarge` |
| Text (inactive) | `#000000` | `neutral.black` |
| Text (active) | `#ffffff` | `neutral.white` |
| BG default + inactive | transparent | — |
| BG default + active | `#000000` | `accent.default` |
| BG hover + inactive | `#e8e8e8` | `interface.overlay3` |
| BG hover + active | `#1a1a1a` | `accent.primary` |
| Delete icon size | 24×24 | — |
| Delete icon color | `#ff3b30` | `state.destructive` |
| Border radius | `8px` | `radius.sm` |

### 3.3 "New Note" button

| Token | Value | Notes |
|-------|--------|--------|
| Background | `#f7f7f7` | Same as sidebar |
| Color | `#000000` / `text.pry` | Icon + label |
| Padding | `8px 12px` | spacing.xSm, spacing.sm |
| Border radius | `8px` | radius.sm |
| Layout | Flex; align center; space-between for + / label / shortcut hint | |

### 3.4 Editor

| Token | Value | Notes |
|-------|--------|--------|
| Background | `#ffffff` | background.default |
| Border | `1px solid #e8e8e8` | background.outline |
| Padding (content) | `32px` | spacing.xxxBig |
| Title input | Font: Title (28px bold); color: text.primary / black | Placeholder: text.secondary |
| Body input | Font: Normal Text (16px); color: text.primary | Placeholder: "Start writing here..." in text.secondary |
| Title–body gap | `16px` | spacing.md |
| Radii | `0` (flat) or `8px` for container per design | Frames show mixed; use radius.sm if rounded |

### 3.5 Toolbar (formatting bar)

| Token | Value | Notes |
|-------|--------|--------|
| Background | `#ffffff` | background.default |
| Border top | `1px solid #e8e8e8` | background.outline |
| Padding | `12px` vertical, `32px` horizontal | spacing.sm, spacing.xxxBig |
| Layout | Flex; align center; gap `16px` | spacing.md |
| Item default | BG transparent/white, color `#000000` | Icons (B, I, U, lists, etc.) |
| Item active | BG `#000000`, color `#ffffff` | Selected format |
| Border radius (buttons) | `4px` / `8px` | radius.xs or radius.sm |

---

## 4. Delete confirmation dialog

- **Background:** `#ffffff`
- **Shadow:** `shadow.md`
- **Border radius:** `8px`
- **Primary action:** Destructive button ("Delete")
- **Secondary action:** Secondary button ("Cancel")
- **Caption:** "This action cannot be undone." in `text.secondary`, small/label style

---

## 5. Responsive Topbar (tablet / mobile)

Shown on tablet and mobile viewports when the sidebar is collapsed or hidden. Replaces the sidebar header and sits at the top of the screen.

### Layout

- **Direction:** Flex row
- **Background:** `#f7f7f7` (`background.overlay`)
- **Padding:** `8px` (`spacing.xSm`)
- **Gap:** `16px` (`spacing.md`)
- **Width:** Full viewport width (696px in Figma is a reference frame; use `100%`)
- **Height:** `52px` (8px top padding + 36px content + 8px bottom padding)
- **Border bottom:** `1px solid #e8e8e8` (`interface.overlay3`) — visible separator

### Children (left → right)

#### 1. Hamburger button (sidebar toggle)

| Property | Value | Token |
|----------|-------|-------|
| Container size | `36×36` | `spacing.xxxxBig` |
| Padding | `4px` | `spacing.xxSm` |
| Icon | `IconBarsTwo`, 24×24 | — |
| Icon color | `#000000` | `neutral.black` |
| Action | Toggles sidebar visibility (overlay / drawer) | — |

#### 2. "New Note" button

Same component as the sidebar "New Note" button (see §3.3):

| Property | Value | Token |
|----------|-------|-------|
| Width | `221px` (can flex in responsive) | — |
| Height | `36px` | `spacing.xxxxBig` |
| Padding (horizontal) | `12px` | `spacing.sm` |
| Layout | Flex; space-between; align center | — |
| Left: + icon | `IconPlusSmall`, 24×24 | — |
| Left: label | "New Note", JetBrains Mono Medium, 14px/16px | `labelLarge` |
| Left: icon ↔ label gap | `16px` | `spacing.md` |
| Right: shortcut hint | "⌘ N", 14px/16px, `#171717` | `text.primary` |

### Visibility rules

| Viewport | Topbar visible | Sidebar visible |
|----------|---------------|-----------------|
| Desktop (>1024px) | **No** | Yes (inline) |
| Tablet (768–1024px) | **Yes** | Collapsed; toggle via hamburger |
| Mobile (<768px) | **Yes** | Hidden; toggle via hamburger (overlay/drawer) |

---

## 6. Implementation notes

- Load **JetBrains Mono** from Google Fonts or similar.
- Prefer CSS variables or a theme object (e.g. in `src/theme/tokens.ts` or `tokens.css`) mapped from this doc.
- Use semantic names (e.g. `--color-text-primary`) in code; keep hex values in one place (tokens file).
- For responsive layout: sidebar can collapse to icons or drawer on small viewports; editor and toolbar remain as above with adjusted padding.
