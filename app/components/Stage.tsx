import { Scrapbook } from './Scrapbook';
import { HERO_TILES } from './heroTiles';
import { SimpleView } from './SimpleView';

export function Stage() {
  return (
    <div className="stage">
      <main className="content">
        <div className="view">
          <Scrapbook tiles={HERO_TILES}>
            <div className="hero-center">
              <SimpleView />
            </div>
          </Scrapbook>
        </div>
      </main>
    </div>
  );
}
