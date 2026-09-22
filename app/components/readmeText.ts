type Run = { text: string; color?: '33' | '90'; href?: string };

/** Read the same semantic content used by the HTML fallback. */
function readRuns(node: Node, style: Omit<Run, 'text'> = {}): Run[] {
  if (node.nodeType === Node.TEXT_NODE) return [{ text: node.textContent ?? '', ...style }];
  if (!(node instanceof HTMLElement)) return [];

  const next = { ...style };
  if (node instanceof HTMLAnchorElement) {
    next.href = node.href;
    next.color = '33';
  }
  if (node.classList.contains('simple-hash')) next.color = '33';
  if (node.classList.contains('simple-experience-period')) next.color = '90';

  const runs = Array.from(node.childNodes).flatMap(child => readRuns(child, next));
  if (node.classList.contains('simple-hash')) runs.push({ text: ' ' });
  return runs;
}

function escapeRun(run: Run, text: string): string {
  const color = `\x1b[${run.color ?? '39'}m`;
  if (run.href && /^https?:\/\//.test(run.href)) {
    return `${color}\x1b[4m\x1b]8;;${run.href}\x1b\\${text}\x1b]8;;\x1b\\\x1b[0m`;
  }
  return `${color}${text}\x1b[0m`;
}

/** Wrap words before adding ANSI styling, so escape codes consume no columns. */
function wrap(runs: Run[], columns: number): string {
  const lines: string[] = [];
  let line = '';
  let width = 0;
  let space = false;
  const newLine = () => {
    lines.push(line);
    line = '';
    width = 0;
    space = false;
  };

  for (const run of runs) {
    for (const token of run.text.match(/\n|[^\S\n]+|[^\s]+/g) ?? []) {
      if (token === '\n') {
        newLine();
      } else if (/^\s+$/.test(token)) {
        space = width > 0;
      } else {
        const chars = Array.from(token);
        if (width && width + Number(space) + chars.length > columns) newLine();
        if (space) {
          line += ' ';
          width++;
          space = false;
        }
        while (chars.length) {
          if (width === columns) newLine();
          const part = chars.splice(0, columns - width);
          line += escapeRun(run, part.join(''));
          width += part.length;
        }
      }
    }
  }
  lines.push(line);
  return lines.join('\r\n');
}

export function readmeText(root: HTMLElement, columns: number): string {
  const blocks = Array.from(root.querySelectorAll('h1, h2, h3, p, dl'));
  return blocks.map(block => {
    if (block.classList.contains('simple-experience-heading')) {
      const title = readRuns(block.querySelector('.simple-experience-title')!);
      const period = readRuns(block.querySelector('.simple-experience-period')!);
      const titleWidth = title.reduce((sum, run) => sum + Array.from(run.text).length, 0);
      const periodWidth = period.reduce((sum, run) => sum + run.text.length, 0);
      if (titleWidth + periodWidth + 2 <= columns) {
        return wrap(title, columns) + ' '.repeat(columns - titleWidth - periodWidth) + wrap(period, columns);
      }
      return wrap(title, columns) + '\r\n' + wrap(period, columns);
    }
    if (block.tagName === 'DL') {
      return Array.from(block.querySelectorAll('dt')).map(term =>
        wrap([
          { text: `${term.textContent}  ` },
          ...readRuns(term.nextElementSibling!),
        ], columns),
      ).join('\r\n');
    }
    return wrap(readRuns(block), columns);
  }).join('\r\n\r\n');
}
