'use client';

import { useEffect, useState } from 'react';
import { Scrapbook } from './Scrapbook';
import { HERO_TILES } from './heroTiles';
import { Terminal } from './Terminal';
import { SimpleView } from './SimpleView';
import { ViewToggle } from './ViewToggle';
import { VideoLog } from './VideoLog';

export type ViewMode = 'terminal' | 'simple';
const STORAGE_KEY = 'em_view_mode';

export function Stage() {
  const [mode, setMode] = useState<ViewMode>('terminal');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'simple' || stored === 'terminal') setMode(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, hydrated]);

  return (
    <div className="stage">
      <ViewToggle mode={mode} onChange={setMode} />
      <VideoLog />
      <main className="content">
        <div className="view">
          <Scrapbook tiles={HERO_TILES}>
            <div
              className={`hero-center${mode === 'simple' ? ' hero-center--simple' : ''}`}
            >
              <div className={mode === 'terminal' ? '' : 'is-hidden'}>
                <Terminal />
              </div>
              <div className={mode === 'simple' ? '' : 'is-hidden'}>
                <SimpleView />
              </div>
            </div>
          </Scrapbook>
        </div>
      </main>
    </div>
  );
}
