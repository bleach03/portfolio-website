'use client';

import { Fragment, type ReactNode } from 'react';
import { PROJECTS } from '../data/projects';
import { useDraggable } from './useDraggable';

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

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="simple-h">
      <span className="simple-hash" aria-hidden>
        ##
      </span>
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="simple-h">
      <span className="simple-hash" aria-hidden>
        ###
      </span>
      {children}
    </h3>
  );
}

export function SimpleView() {
  const { pos, dragging, handleProps } = useDraggable();

  return (
    <div
      className={`simple${dragging ? ' is-dragging' : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      <div className="terminal-bar" aria-hidden {...handleProps}>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="path">~/ethan-miller — readme.md</span>
      </div>

      <div className="simple-body">
        <h1 className="simple-h">
          <span className="simple-hash" aria-hidden>
            #
          </span>
          ethan miller
        </h1>
        <p>cs + film @ columbia</p>

        <H2>about</H2>
        <p>working at the intersection of entrepreneurship, ai, and media.</p>
        <p>off the keyboard: electronic music, climbing, film.</p>

        <H2>currently building</H2>
        <dl className="simple-defs">
          <dt>opencampus</dt>
          <dd>
            agent for college life. lives in iMessage. signs you up for
            classes, connects you with people, gets things done.
          </dd>
          <dt>keyless</dt>
          <dd>
            ai video overlay tool for founders making content about their
            product.
          </dd>
        </dl>

        <H2>projects</H2>
        {PROJECTS.map(p => (
          <div key={p.slug} className="simple-project">
            <H3>
              {p.name}
              {p.year ? ` / ${p.year}` : ''}
            </H3>
            <p>{p.desc}</p>
            {p.body && (
              <p className="simple-pre">
                {renderRich(p.body).map((node, j) => (
                  <Fragment key={j}>{node}</Fragment>
                ))}
              </p>
            )}
            {p.links?.length ? (
              <p>
                {p.links.map((l, j) => (
                  <Fragment key={l.href}>
                    {j > 0 && '  '}
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="terminal-link"
                    >
                      [{l.label}]
                    </a>
                  </Fragment>
                ))}
              </p>
            ) : null}
          </div>
        ))}

        <H2>contact</H2>
        <dl className="simple-defs">
          <dt>linkedin</dt>
          <dd>
            <a
              href="https://linkedin.com/in/ethanbenjakul"
              target="_blank"
              rel="noreferrer"
              className="terminal-link"
            >
              linkedin.com/in/ethanbenjakul
            </a>
          </dd>
          <dt>email</dt>
          <dd>ecm2211 [at] columbia [dot] edu</dd>
        </dl>
      </div>
    </div>
  );
}
