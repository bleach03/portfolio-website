import type { ReactNode } from 'react';

/**
 * Parse `[label](url)` inline markdown links inside a string and return
 * a flat array of strings + anchor nodes. Anything that isn't a link
 * stays as plain text. URLs open in a new tab.
 */
export function renderRich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) out.push(text.slice(lastIdx, m.index));
    out.push(
      <a
        key={m.index}
        href={m[2]}
        target="_blank"
        rel="noreferrer"
        className="terminal-link"
      >
        {m[1]}
      </a>,
    );
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return out.length ? out : [text];
}
