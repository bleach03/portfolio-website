'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Terminal } from '@xterm/xterm';
import { readmeText } from './readmeText';

export function ReadmeTerminal({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current!;
    const content = contentRef.current!;
    let terminal: Terminal | undefined;
    let observer: ResizeObserver | undefined;
    let removeTouchHandlers: (() => void) | undefined;
    let disposed = false;
    let frame = 0;

    async function initialize() {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import('@xterm/xterm'),
        import('@xterm/addon-fit'),
        document.fonts.ready,
      ]);
      if (disposed) return;

      const style = getComputedStyle(host);
      const palette = getComputedStyle(document.documentElement);
      const term = new Terminal({
        allowTransparency: true,
        disableStdin: true,
        cursorBlink: false,
        cursorInactiveStyle: 'none',
        fontFamily: style.fontFamily,
        fontSize: parseFloat(style.fontSize),
        lineHeight: 1.2,
        scrollback: 1000,
        scrollOnUserInput: false,
        smoothScrollDuration: 0,
        screenReaderMode: true,
        theme: {
          background: '#00000000',
          foreground: palette.getPropertyValue('--fg-soft').trim(),
          yellow: palette.getPropertyValue('--accent').trim(),
          brightBlack: palette.getPropertyValue('--dim').trim(),
          selectionBackground: '#d6c19a55',
          scrollbarSliderBackground: '#00000000',
          scrollbarSliderHoverBackground: '#00000000',
          scrollbarSliderActiveBackground: '#00000000',
        },
        linkHandler: {
          activate: (_event, href) => {
            if (/^https?:\/\//.test(href)) window.open(href, '_blank', 'noopener,noreferrer');
          },
          hover: (_event, href) => { host.title = href; },
          leave: () => { host.removeAttribute('title'); },
        },
      });
      terminal = term;
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(host);
      if (term.textarea) {
        term.textarea.readOnly = true;
        term.textarea.inputMode = 'none';
        term.textarea.setAttribute('aria-label', 'Portfolio. Use arrow keys or Page Up and Page Down to scroll.');
      }

      // This is a document viewer: navigation keys move the scrollback buffer.
      term.attachCustomKeyEventHandler(event => {
        if (event.type !== 'keydown' || event.metaKey || event.ctrlKey || event.altKey) return true;
        switch (event.key) {
          case 'ArrowUp': term.scrollLines(-1); break;
          case 'ArrowDown': term.scrollLines(1); break;
          case 'PageUp': term.scrollPages(-1); break;
          case 'PageDown': term.scrollPages(1); break;
          case 'Home': term.scrollToTop(); break;
          case 'End': term.scrollToBottom(); break;
          case ' ': term.scrollPages(event.shiftKey ? -1 : 1); break;
          default: return event.key !== 'Tab';
        }
        event.preventDefault();
        return false;
      });

      // xterm's virtual scrollback is not a native touch-scrollable element.
      let touchY: number | undefined;
      let touchRemainder = 0;
      const touchStart = (event: TouchEvent) => {
        touchY = event.touches.length === 1 ? event.touches[0].clientY : undefined;
        touchRemainder = 0;
      };
      const touchMove = (event: TouchEvent) => {
        if (touchY === undefined || event.touches.length !== 1) return;
        const y = event.touches[0].clientY;
        const rowHeight = host.querySelector('.xterm-screen')!.getBoundingClientRect().height / term.rows;
        touchRemainder += touchY - y;
        touchY = y;
        const lines = Math.trunc(touchRemainder / rowHeight);
        if (lines) {
          term.scrollLines(lines);
          touchRemainder -= lines * rowHeight;
        }
        event.preventDefault();
      };
      const touchEnd = () => { touchY = undefined; };
      host.addEventListener('touchstart', touchStart, { passive: true });
      host.addEventListener('touchmove', touchMove, { passive: false });
      host.addEventListener('touchend', touchEnd);
      host.addEventListener('touchcancel', touchEnd);
      removeTouchHandlers = () => {
        host.removeEventListener('touchstart', touchStart);
        host.removeEventListener('touchmove', touchMove);
        host.removeEventListener('touchend', touchEnd);
        host.removeEventListener('touchcancel', touchEnd);
      };

      let writing = false;
      let resizePending = false;
      const draw = () => {
        if (disposed) return;
        if (writing) { resizePending = true; return; }
        const buffer = term.buffer.active;
        const progress = buffer.baseY ? buffer.viewportY / buffer.baseY : 0;
        term.options.fontSize = parseFloat(getComputedStyle(host).fontSize);
        fit.fit();
        writing = true;
        term.reset();
        // Hide the cursor, then populate the scrollback with the complete readme.
        term.write(`\x1b[?25l${readmeText(content, term.cols)}`, () => {
          if (disposed) return;
          term.scrollToLine(Math.round(progress * term.buffer.active.baseY));
          setReady(true);
          writing = false;
          if (resizePending) {
            resizePending = false;
            frame = requestAnimationFrame(draw);
          }
        });
      };
      draw();
      observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      });
      observer.observe(host);
    }

    // The semantic HTML stays usable if the terminal package fails to load.
    initialize().catch(error => {
      if (!disposed) {
        observer?.disconnect();
        removeTouchHandlers?.();
        terminal?.dispose();
        terminal = undefined;
        setReady(false);
        console.error('Could not initialize the readme viewer', error);
      }
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      removeTouchHandlers?.();
      terminal?.dispose();
    };
  }, []);

  return (
    <div className={`simple-body${ready ? ' is-ready' : ''}`}>
      <div ref={contentRef} hidden={ready}>{children}</div>
      <div ref={hostRef} className="readme-terminal" aria-hidden={!ready} />
    </div>
  );
}
