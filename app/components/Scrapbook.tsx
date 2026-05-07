'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { TornImage } from './TornImage';

export type ScrapTile = {
  src: string;
  alt?: string;
  /** percentage of container width */
  x: number;
  /** percentage of container height */
  y: number;
  /** css width, e.g. "min(11vw, 170px)" */
  w: string;
  /** css height */
  h: string;
  /** use the rougher torn-edge variant */
  rough?: boolean;
};

type Props = {
  tiles: ScrapTile[];
  children?: ReactNode;
  /** ms between random idle "wakes" */
  wakeInterval?: number;
};

export function Scrapbook({ tiles, children, wakeInterval = 2200 }: Props) {
  const [awakeIndex, setAwakeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (tiles.length === 0) return;
    let lastIndex = -1;
    const tick = () => {
      let idx = Math.floor(Math.random() * tiles.length);
      if (idx === lastIndex && tiles.length > 1) {
        idx = (idx + 1) % tiles.length;
      }
      lastIndex = idx;
      setAwakeIndex(idx);
      window.setTimeout(
        () => setAwakeIndex(prev => (prev === idx ? null : prev)),
        1500,
      );
    };

    const startId = window.setTimeout(tick, 700);
    const id = window.setInterval(tick, wakeInterval);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(id);
    };
  }, [tiles.length, wakeInterval]);

  return (
    <div className="scrapbook">
      {tiles.map((t, i) => (
        <TornImage
          key={`${t.src}-${i}`}
          src={t.src}
          alt={t.alt ?? ''}
          rough={t.rough}
          rotate={0}
          awake={awakeIndex === i}
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: t.w,
            height: t.h,
          }}
        />
      ))}
      {children}
    </div>
  );
}
