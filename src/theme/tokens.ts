/**
 * Design tokens extracted from Figma (My Design systems).
 * Use for React components and CSS-in-JS; optionally mirror in tokens.css.
 */

export const colors = {
  neutral: {
    white: '#ffffff',
    black: '#000000',
  },
  text: {
    primary: '#171717',
    secondary: '#767676',
    pry: '#000000',
  },
  background: {
    default: '#ffffff',
    overlay: '#f7f7f7',
    outline: '#e8e8e8',
  },
  interface: {
    overlay1: '#f7f7f7',
    overlay2: '#f5f5f5',
    overlay3: '#e8e8e8',
  },
  accent: {
    default: '#000000',
    primary: '#1a1a1a',
  },
  state: {
    destructive: '#ff3b30',
    destructiveTransparent: '#ff3b301a',
  },
  // Button-specific (alias for clarity)
  button: {
    primary: { default: '#000000', hover: '#262626' },
    secondary: { default: '#f7f7f7', hover: '#e8e8e8' },
    destructive: { default: '#ff3b30', hover: '#cd2f26' },
  },
} as const;

export const spacing = {
  xxSm: 4,
  xSm: 8,
  sm: 12,
  md: 16,
  big: 20,
  xBig: 24,
  xxBig: 28,
  xxxBig: 32,
  xxxxBig: 36,
} as const;

export const radius = {
  xs: 0,
  sm: 0,
} as const;

export const shadow = {
  md: '0 2px 4px -2px rgba(16, 24, 40, 0.06), 0 4px 8px -2px rgba(16, 24, 40, 0.10)',
} as const;

export const typography = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  title: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 700,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  heading1: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  heading2: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -2,
  },
  heading3: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -2,
  },
  normalText: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  labelLarge: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0,
  },
  labelSmall: {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
} as const;

/** Inline format styles applied on top of any block-level text style */
export const inlineFormat = {
  bold: { fontWeight: 700 },
  italic: { fontStyle: 'italic' as const },
  underline: { textDecoration: 'underline' as const },
} as const;

/** Sidebar, note tab, editor, toolbar layout/sizing */
export const layout = {
  sidebar: {
    width: 233,
    minWidth: 240,
    borderRightWidth: 1,
    itemPaddingY: 8,
    itemPaddingX: 12,
  },
  editor: {
    contentPadding: 32,
    titleBodyGap: 16,
  },
  toolbar: {
    paddingY: 12,
    paddingX: 32,
    gap: 16,
  },
} as const;
