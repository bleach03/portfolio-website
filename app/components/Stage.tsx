'use client';

import { Scrapbook } from './Scrapbook';
import { HERO_TILES } from './heroTiles';
import { Terminal } from './Terminal';

export function Stage() {
  return (
    <div className="stage">
      <main className="content">
        <div className="view" key="home">
          <Scrapbook tiles={HERO_TILES}>
            <div className="hero-center">
              <Terminal />
            </div>
          </Scrapbook>
        </div>
      </main>
    </div>
  );
}
