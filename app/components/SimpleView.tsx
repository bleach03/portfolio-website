'use client';

import { Fragment, type ReactNode } from 'react';
import { EXPERIENCE } from '../data/experience';
import { PROJECTS } from '../data/projects';
import { useDraggable } from './useDraggable';
import { renderRich } from './renderRich';
import { WindowBar } from './WindowBar';

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
      <WindowBar path="~/ethan-miller — readme.md" handleProps={handleProps} />

      <div className="simple-body">
        <h1 className="simple-h">
          <span className="simple-hash" aria-hidden>
            #
          </span>
          ethan miller
        </h1>
        <p>cs + film @ columbia</p>

        <H2>work experience</H2>
        <div className="simple-experiences">
          {EXPERIENCE.map(experience => (
            <div key={experience.company} className="simple-experience">
              <p className="simple-experience-heading">
                <a
                  href={experience.href}
                  target="_blank"
                  rel="noreferrer"
                  className="terminal-link"
                >
                  {experience.company}
                </a>
                <span>{experience.period}</span>
              </p>
            </div>
          ))}
        </div>

        <H2>about</H2>
        <p>working at the intersection of entrepreneurship, ai, and media.</p>
        <p>off the keyboard: electronic music, climbing, film.</p>

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
