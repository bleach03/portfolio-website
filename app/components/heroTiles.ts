import type { ScrapTile } from './Scrapbook';

/**
 * Layout copied from poke.com — only 05.webp moved out of the center
 * to keep room for the readme window in the middle.
 */
export const HERO_TILES: ScrapTile[] = [
  // ── top band ─────────────────────────────────────
  { src: '/img/scrapbook/01.webp', x: 3,  y: 18, w: '13vw', h: '17vw' },                  // door
  { src: '/img/scrapbook/02.webp', x: 28, y: 10, w: '14vw', h: '18vw', rough: true },     // eiffel (taller)
  { src: '/img/scrapbook/07.mp4', x: 50, y: 14, w: '15vw', h: '13vw' },                  // window (video)
  { src: '/img/scrapbook/08.webp', x: 68, y: 18, w: '13vw', h: '10vw', rough: true },     // sleeping
  { src: '/img/scrapbook/03.webp', x: 86, y: 28, w: '10vw', h: '11vw' },                  // road (small)

  // ── bottom band ──────────────────────────────────
  { src: '/img/scrapbook/04.webp', x: 5,  y: 55, w: '10vw', h: '15vw', rough: true },     // forest walk (mid-far-left)
  { src: '/img/scrapbook/05.webp', x: 18, y: 58, w: '22vw', h: '14vw' },                  // microscope (XL)
  { src: '/img/scrapbook/09.webp', alt: 'Two people talking outside a cabin', x: 43, y: 50, w: '24vw', h: '18vw', rough: true },
  { src: '/img/scrapbook/06.webp', x: 70, y: 58, w: '24vw', h: '15vw', rough: true },     // hammock (XL)
];
