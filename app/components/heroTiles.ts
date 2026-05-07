import type { ScrapTile } from './Scrapbook';

/**
 * Layout copied from poke.com — only 05.jpg moved out of the center
 * to keep room for the hero / terminal in the middle.
 */
export const HERO_TILES: ScrapTile[] = [
  // ── top band ─────────────────────────────────────
  { src: '/img/scrapbook/01.jpg', x: 3,  y: 18, w: '13vw', h: '17vw' },                  // door
  { src: '/img/scrapbook/02.jpg', x: 28, y: 10, w: '14vw', h: '18vw', rough: true },     // eiffel (taller)
  { src: '/img/scrapbook/07.mp4', x: 50, y: 14, w: '15vw', h: '13vw' },                  // window (video)
  { src: '/img/scrapbook/08.jpg', x: 68, y: 18, w: '13vw', h: '10vw', rough: true },     // sleeping
  { src: '/img/scrapbook/03.jpg', x: 86, y: 28, w: '10vw', h: '11vw' },                  // road (small)

  // ── bottom band ──────────────────────────────────
  { src: '/img/scrapbook/04.jpg', x: 5,  y: 55, w: '10vw', h: '15vw', rough: true },     // forest walk (mid-far-left)
  { src: '/img/scrapbook/05.jpg', x: 18, y: 58, w: '22vw', h: '14vw' },                  // microscope (XL)
  { src: '/img/scrapbook/06.jpg', x: 70, y: 58, w: '24vw', h: '15vw', rough: true },     // hammock (XL)
];
