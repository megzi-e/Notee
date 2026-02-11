/**
 * Renders an array of TextSpan objects as inline <span> elements.
 * Applies bold / italic / underline styles based on span flags.
 *
 * This is a pure display component — no editing logic here.
 */

import type { TextSpan } from '@/types/note'

type Props = {
  spans: TextSpan[]
}

export function TextSpanRenderer({ spans }: Props) {
  return (
    <>
      {spans.map((span, i) => {
        const style: React.CSSProperties = {
          fontWeight: span.bold ? 'bold' : undefined,
          fontStyle: span.italic ? 'italic' : undefined,
          textDecoration: span.underline ? 'underline' : undefined,
        }

        // If no formatting, avoid wrapping in a span at all for perf.
        const hasFormatting = span.bold || span.italic || span.underline
        if (!hasFormatting) {
          // We still need a keyed element so React can reconcile.
          return <span key={i}>{span.text}</span>
        }

        return (
          <span key={i} style={style}>
            {span.text}
          </span>
        )
      })}
    </>
  )
}
