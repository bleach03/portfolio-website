'use client';

import { Fragment, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { VIDEOS, MELIUS_NOTE } from '../data/videos';
import { useDraggable } from './useDraggable';

export function VideoLog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname === '/watch');
  const { pos, dragging, handleProps } = useDraggable();

  // Re-open when the URL changes to /watch (e.g. via client-side nav).
  useEffect(() => {
    if (pathname === '/watch') setOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`melius-btn${open ? ' is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="open video log for Melius"
      >
        <img
          src="/img/melius.png"
          alt="Melius"
          className="melius-btn-logo"
          draggable={false}
        />
      </button>

      {open && (
        <div
          className={`video-log${dragging ? ' is-dragging' : ''}`}
          style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
          role="dialog"
          aria-label="video log for Melius"
        >
          <div className="terminal-bar" {...handleProps}>
            <span className="dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="path">~/ethan-miller — for-melius.log</span>
            <button
              type="button"
              className="video-log-close"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              ×
            </button>
          </div>

          <div className="video-log-body">
            <video
              className="video-log-reel"
              src="https://utpkxzfuo51jw4vl.public.blob.vercel-storage.com/bruhmium.mp4"
              controls
              preload="metadata"
              playsInline
            />

            {VIDEOS.map(v => (
              <article key={v.title} className="video-entry">
                <header className="video-entry-head">
                  <span className="video-entry-title">{v.title}</span>
                </header>
                <p className="video-entry-desc">
                  {v.desc}{' '}
                  {v.links.map((l, i) => (
                    <Fragment key={l.label}>
                      {i > 0 && ' '}
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="terminal-link"
                      >
                        ({l.label})
                      </a>
                    </Fragment>
                  ))}
                </p>
              </article>
            ))}

            <div className="video-log-note">{MELIUS_NOTE}</div>
          </div>
        </div>
      )}
    </>
  );
}
