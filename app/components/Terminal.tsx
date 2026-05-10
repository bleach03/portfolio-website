'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { PROJECTS } from '../data/projects';
import { useDraggable } from './useDraggable';

/**
 * Parse `[label](url)` inline markdown links inside a string and return
 * a flat array of strings + anchor nodes. Anything that isn't a link
 * stays as plain text. URLs open in a new tab.
 */
function renderRich(text: string): ReactNode[] {
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

type Entry =
  | { kind: 'cmd'; text: string; path: string }
  | { kind: 'out'; text: string };

/** Display form of cwd: `/` → `~`, `/projects` → `~/projects` */
const pathDisplay = (cwd: string) => (cwd === '/' ? '~' : `~${cwd}`);

const ABOUT = `working at the intersection of entrepreneurship, ai, and media.

currently building:
  opencampus  agent for college life. lives in iMessage.
              signs you up for classes, connects you with
              people, gets things done.
  keyless     ai video overlay tool for founders making
              content about their product.

off the keyboard: electronic music, climbing, film.`;

const CONTACT = `linkedin   [linkedin.com/in/ethanbenjakul](https://linkedin.com/in/ethanbenjakul)
email      ecm2211 [at] columbia [dot] edu`;

const HELP = `about, projects, project [name], contact, clear, help`;

const TODO_MD = `launch openCampus on eight campuses this fall
hit 10k mrr w/ keyless
get into y combinator
graduate (optional)`;

const SECRETS = `you found me! here's a joke:

🐟: i'm trying to find this thing they call the ocean.
🐠: the ocean? that's what you're in right now!
🐟: this? this is water. what i want is the ocean!

dm me this on linkedin for a surprise`;

const CLAUDE_UI = `   ┌──┐    Claude Code v2.1.132
   │··│    Opus 4.7 (1M context) · Claude Max
   └──┘    ~/Desktop/portfolio-website

────────────────────────────────────────
›

portfolio-website  |  ctx --  |  Opus 4.7 (1M context)
14 skill descriptions dropped · /doctor for details`;

const projectsList = () =>
  PROJECTS.map(p => `  ${p.name.padEnd(16)}${p.desc}`).join('\n') +
  `\n\ntype \`project [name]\` to learn more.`;

const projectDetail = (n: number): Entry => {
  const p = PROJECTS[n - 1];
  if (!p) return { kind: 'out', text: `no project at index ${n}` };

  const meta = [p.year, p.desc].filter(Boolean).join(' / ');
  const linksLine = p.links?.length
    ? '\n\nlinks:  ' +
      p.links.map(l => `[${l.label}](${l.href})`).join('  ')
    : '';

  return {
    kind: 'out' as const,
    text: `${p.name}\n${meta}\n${'─'.repeat(28)}\n${p.body ?? p.desc}${linksLine}`,
  };
};

const ROUTE_HINTS = ['about', 'projects', 'contact', 'help', 'clear'];

/* ───────── fake filesystem (easter egg) ─────────
   /
   ├── about.txt
   ├── projects/
   │   ├── opencampus.txt
   │   ├── keyless.txt
   │   ├── raise.txt
   │   ├── screenwriting.txt
   │   └── bleach.txt
   ├── TODO.md
   └── .secrets    (hidden)
*/

function listAt(cwd: string, showHidden: boolean): string | null {
  if (cwd === '/') {
    const visible = ['about.txt', 'projects', 'todo.md'];
    const hidden = ['.secrets'];
    return (showHidden ? [...visible, ...hidden] : visible).join('   ');
  }
  if (cwd === '/projects') {
    return PROJECTS.map(p => `${p.slug}.txt`).join('   ');
  }
  return null;
}

function readFileAt(
  cwd: string,
  name: string,
): { kind: 'file'; text: string } | { kind: 'dir' } | null {
  const n = name.replace(/\/$/, '');
  if (cwd === '/') {
    if (n === 'about.txt') return { kind: 'file', text: ABOUT };
    if (n === 'todo.md') return { kind: 'file', text: TODO_MD };
    if (n === '.secrets') return { kind: 'file', text: SECRETS };
    if (n === 'projects') return { kind: 'dir' };
    return null;
  }
  if (cwd === '/projects') {
    const slug = n.replace(/\.txt$/, '');
    const idx = PROJECTS.findIndex(p => p.slug === slug);
    if (idx === -1) return null;
    return { kind: 'file', text: projectDetail(idx + 1).text };
  }
  return null;
}

function resolveCd(cwd: string, target: string): string | null {
  const t = target.replace(/\/$/, '').trim();
  if (t === '' || t === '/' || t === '~') return '/';
  if (t === '..') return '/'; // we only have one level deep
  if (cwd === '/' && t === 'projects') return '/projects';
  if (t === '/projects') return '/projects';
  return null;
}

const INTRO: Entry[] = [
  { kind: 'out', text: 'ethan miller — portfolio.sh' },
  { kind: 'out', text: 'cs + film @ columbia' },
  { kind: 'out', text: 'type `help` for a list of commands.' },
  { kind: 'out', text: 'not into typing? click `simple` (top-left).' },
];

export function Terminal() {
  const [history, setHistory] = useState<Entry[]>(INTRO);
  const [value, setValue] = useState('');
  const [recallIdx, setRecallIdx] = useState<number | null>(null);
  const [cwd, setCwd] = useState<string>('/');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { pos, dragging, handleProps } = useDraggable();

  // Past commands for ↑/↓ recall
  const cmds = history.filter(h => h.kind === 'cmd').map(h => h.text);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll history to bottom on new entries
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history]);

  const append = (...entries: Entry[]) =>
    setHistory(h => [...h, ...entries]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    // Always echo the user's input first (capture cwd at submission time
    // so the history shows the correct prompt for past commands)
    const echo: Entry = { kind: 'cmd', text: cmd, path: cwd };

    if (cmd === 'clear') {
      setHistory(INTRO);
      return;
    }
    if (cmd === 'help' || cmd === '?') {
      append(echo, { kind: 'out', text: HELP });
      return;
    }
    if (cmd === 'about') {
      append(echo, { kind: 'out', text: ABOUT });
      return;
    }
    if (cmd === 'projects') {
      append(echo, { kind: 'out', text: projectsList() });
      return;
    }
    if (cmd === 'project') {
      append(echo, { kind: 'out', text: 'usage: project [name]' });
      return;
    }
    if (cmd === 'contact') {
      append(echo, { kind: 'out', text: CONTACT });
      return;
    }

    // ── easter eggs (undocumented shell-style commands) ──

    // rm — refuse, with personality
    if (cmd === 'rm' || cmd.startsWith('rm ')) {
      append(echo, { kind: 'out', text: 'nice try.' });
      return;
    }

    // claude — render a tiny version of the Claude Code splash
    if (cmd === 'claude') {
      append(echo, { kind: 'out', text: CLAUDE_UI });
      return;
    }

    // pwd — print current dir
    if (cmd === 'pwd') {
      append(echo, { kind: 'out', text: cwd });
      return;
    }

    // ls — directory listing, supports -a / -la / -al for hidden
    if (cmd === 'ls' || cmd.startsWith('ls ')) {
      const args = cmd.slice(2).trim();
      const showHidden = /-\w*a/.test(args);
      const out = listAt(cwd, showHidden);
      if (out === null) {
        append(echo, { kind: 'out', text: '' });
      } else {
        append(echo, { kind: 'out', text: out });
      }
      return;
    }

    // cd — navigate the fake fs
    if (cmd === 'cd' || cmd === 'cd ~' || cmd === 'cd /') {
      setCwd('/');
      append(echo);
      return;
    }
    const cdMatch = cmd.match(/^cd\s+(.+)$/);
    if (cdMatch) {
      const target = cdMatch[1].trim();
      const next = resolveCd(cwd, target);
      if (next === null) {
        append(echo, {
          kind: 'out',
          text: `cd: no such file or directory: ${target}`,
        });
        return;
      }
      setCwd(next);
      append(echo);
      return;
    }

    // cat — print file contents
    if (cmd === 'cat') {
      append(echo, { kind: 'out', text: 'usage: cat [file]' });
      return;
    }
    const catMatch = cmd.match(/^cat\s+(.+)$/);
    if (catMatch) {
      const target = catMatch[1].trim();
      const found = readFileAt(cwd, target);
      if (found === null) {
        append(echo, {
          kind: 'out',
          text: `cat: ${target}: No such file or directory`,
        });
        return;
      }
      if (found.kind === 'dir') {
        append(echo, { kind: 'out', text: `cat: ${target}: Is a directory` });
        return;
      }
      append(echo, { kind: 'out', text: found.text });
      return;
    }

    // `project NAME` or `project N`
    const projMatch = cmd.match(/^project\s+(.+)$/);
    if (projMatch) {
      const arg = projMatch[1].trim().toLowerCase();
      const asNum = parseInt(arg, 10);
      let n: number;
      if (!isNaN(asNum)) {
        n = asNum;
      } else {
        const idx = PROJECTS.findIndex(p => p.slug === arg);
        if (idx === -1) {
          append(echo, {
            kind: 'out',
            text: `no project named "${arg}". try \`projects\` for the list.`,
          });
          return;
        }
        n = idx + 1;
      }
      append(echo, projectDetail(n));
      return;
    }

    append(echo, {
      kind: 'out',
      text: `zsh: command not found: ${cmd}. type \`help\` for a list of commands.`,
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(value);
    setValue('');
    setRecallIdx(null);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    // Tab — autocomplete first match
    if (e.key === 'Tab') {
      e.preventDefault();
      const prefix = value.toLowerCase();
      if (!prefix) return;
      const match = ROUTE_HINTS.find(
        k => k.startsWith(prefix) && k.length > prefix.length,
      );
      if (match) setValue(match);
      return;
    }
    // ↑ / ↓ — recall command history
    if (e.key === 'ArrowUp') {
      if (cmds.length === 0) return;
      e.preventDefault();
      const next = recallIdx === null ? cmds.length - 1 : Math.max(0, recallIdx - 1);
      setRecallIdx(next);
      setValue(cmds[next] ?? '');
      return;
    }
    if (e.key === 'ArrowDown') {
      if (recallIdx === null) return;
      e.preventDefault();
      const next = recallIdx + 1;
      if (next >= cmds.length) {
        setRecallIdx(null);
        setValue('');
      } else {
        setRecallIdx(next);
        setValue(cmds[next] ?? '');
      }
    }
  };

  return (
    <div
      className={`terminal${dragging ? ' is-dragging' : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      onMouseDown={e => {
        // clicking inside the body (not the bar) focuses the input
        const target = e.target as HTMLElement;
        if (target.closest('.terminal-bar')) return;
        if (e.target !== inputRef.current) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      <div className="terminal-bar" aria-hidden {...handleProps}>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="path">~/ethan-miller — sh</span>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {history.map((e, i) => {
          if (e.kind === 'cmd') {
            return (
              <div key={i} className="terminal-row hist">
                {e.path !== '/' && (
                  <span className="path-prefix">{pathDisplay(e.path)}</span>
                )}
                <span className="glyph" aria-hidden>
                  &gt;
                </span>
                <span>{e.text}</span>
              </div>
            );
          }
          return (
            <div key={i} className="terminal-line">
              {renderRich(e.text).map((node, j) => (
                <Fragment key={j}>{node}</Fragment>
              ))}
            </div>
          );
        })}

        <form onSubmit={submit} className="terminal-row" autoComplete="off">
          {cwd !== '/' && (
            <span className="path-prefix">{pathDisplay(cwd)}</span>
          )}
          <span className="glyph" aria-hidden>
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="command input"
          />
        </form>
      </div>
    </div>
  );
}
